import { parseManifestDate } from "@/lib/date";
import type { Asset } from "@/domain/models";
import { getGitHubZipUrl } from "@/services/github/repositoryMetadata";

type RawAsset = Record<string, unknown>;

function isRecord(value: unknown): value is RawAsset {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function decodeBase64(value: string): string | null {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) return null;

  try {
    const binary = atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function decodeMaybe(value: unknown, forceBase64 = false): unknown {
  if (typeof value !== "string") return value;

  let result = value;
  const preserveString = forceBase64;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const prefixed = result.startsWith("base64@");
    if (!prefixed && (!forceBase64 || attempt > 0)) break;

    const decoded = decodeBase64(prefixed ? result.slice(7) : result);
    if (decoded === null) return forceBase64 ? null : result;
    result = decoded;
    forceBase64 = false;
  }

  if (preserveString) return result;
  try {
    return JSON.parse(result) as unknown;
  } catch {
    return result;
  }
}

function safeHttpsUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export interface AssetMappingResult {
  assets: Asset[];
  skippedInvalid: number;
  invalidDates: number;
}

export function mapManifestAssets(raw: unknown): AssetMappingResult {
  const decoded = decodeMaybe(raw);
  const root = isRecord(decoded) && isRecord(decoded.Database) ? decoded.Database : decoded;
  let rows: unknown[] = [];
  if (Array.isArray(decoded)) {
    rows = decoded;
  } else if (isRecord(root)) {
    if (Array.isArray(root.assets)) rows = root.assets;
    else if (Array.isArray(root.packages)) rows = root.packages;
  }

  const assets: Asset[] = [];
  let skippedInvalid = 0;
  let invalidDates = 0;

  for (const entry of rows) {
    const decodedEntry = decodeMaybe(entry);
    if (!isRecord(decodedEntry)) {
      skippedInvalid += 1;
      continue;
    }

    const item = decodedEntry;
    const get = (key: string, ...aliases: string[]) => {
      for (const field of [key, ...aliases]) {
        if (item[field] !== undefined) return decodeMaybe(item[field], field.endsWith("B64"));
      }
      return undefined;
    };
    const getString = (key: string, ...aliases: string[]) => {
      const value = get(key, ...aliases);
      return typeof value === "string" && value.trim() ? value.trim() : undefined;
    };

    const title = getString("title", "titleB64", "name");
    const id = getString("id", "slug", "packageName", "name");
    const rawMajorVersion = item.appMajorVersion;
    const majorVersion = typeof rawMajorVersion === "number"
      ? rawMajorVersion
      : typeof rawMajorVersion === "string" && /^\d+$/.test(rawMajorVersion)
        ? Number(rawMajorVersion)
        : null;

    if (majorVersion === null) {
      skippedInvalid += 1;
      continue;
    }
    if (majorVersion !== 2) continue;
    if (!title || !id) {
      skippedInvalid += 1;
      continue;
    }

    const template = item.isTemplate;
    const category = getString("category", "type")
      ?? (typeof template === "boolean" ? (template ? "template" : "package") : undefined);
    const creator = getString("creator", "author", "publisher", "userName");
    const tags = getString("tags", "tag")?.split(",").map((tag) => tag.trim()).filter(Boolean) ?? [];
    const thumbnailUrl = safeHttpsUrl(get("thumbnail", "image", "imageUrl"));
    const description = getString("description", "descriptionB64", "summary");
    const rawVersion = get("version", "release");
    const version = typeof rawVersion === "number" && Number.isFinite(rawVersion)
      ? String(rawVersion)
      : typeof rawVersion === "string" && rawVersion.trim()
        ? rawVersion.trim()
        : undefined;
    const packageUrl = safeHttpsUrl(get("repositoryURL"));
    const downloadUrl = packageUrl
      ? getGitHubZipUrl(packageUrl) ?? (/\.zip$/i.test(new URL(packageUrl).pathname) ? packageUrl : undefined)
      : undefined;
    const licenseUrl = safeHttpsUrl(get("licenseB64"));
    const date = parseManifestDate(getString("date") ?? "");
    if (!date) invalidDates += 1;

    assets.push({
      id,
      title,
      publishedAt: date?.toISOString() ?? "1970-01-01T00:00:00.000Z",
      ...(category ? { category } : {}),
      ...(creator ? { creator } : {}),
      ...(tags.length ? { tags } : {}),
      ...(thumbnailUrl ? { thumbnailUrl } : {}),
      ...(description ? { description } : {}),
      ...(version ? { version } : {}),
      ...(packageUrl ? { packageUrl } : {}),
      ...(downloadUrl ? { downloadUrl } : {}),
      ...(licenseUrl ? { licenseUrl } : {}),
    });
  }

  return { assets, skippedInvalid, invalidDates };
}
