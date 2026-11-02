import { logger } from "@/lib/logger";
import type { Asset } from "@/domain/models";
import { mapManifestAssets } from "@/services/assetMapper";
import { getDatabaseSources } from "@/services/endpoints";
import { getGitHubRepositoryCoordinates, getRepositoryUpdatedAt } from "@/services/github/repositoryMetadata";
import { fetchManifest, getHttpStatus } from "@/services/shared/httpClient";

export type { Asset } from "@/domain/models";

export type { AssetCatalogResult, AssetCatalogPage, CatalogParams } from "@/domain/catalog";
import { selectCatalog, type AssetCatalogResult, type AssetCatalogPage, type CatalogParams } from "@/domain/catalog";

export type AssetLookupResult =
  | { status: "ready"; asset: Asset | null }
  | { status: "unavailable"; asset: null };

interface AssetCache {
  endpoint: string;
  assets: Asset[];
  expiresAt: number;
}

const ASSET_CACHE_TTL_MS = 5 * 60 * 1000;
let assetCache: AssetCache | null = null;

let inFlightAssets: Promise<AssetCatalogResult> | null = null;

async function loadAssets(): Promise<AssetCatalogResult> {
  const correlationId = crypto.randomUUID();
  const startedAt = Date.now();
  const sources = getDatabaseSources();
  if (!sources) {
    logger.warn("Asset source is not configured or invalid", {
      service: "storeService",
      operation: "getAssets",
      code: "CATALOG_NOT_CONFIGURED",
      correlationId,
    });
    return { status: "unavailable", assets: [] };
  }

  try {
    let raw: unknown;
    try {
      raw = await fetchManifest(sources.primary, correlationId);
    } catch (error) {
      if (!sources.fallback) throw error;
      logger.warn("Compressed manifest failed; trying the plain JSON source", {
        service: "storeService",
        operation: "getAssets",
        code: "CATALOG_GZIP_FALLBACK",
        correlationId,
      });
      raw = await fetchManifest(sources.fallback, correlationId);
    }

    const mapped = mapManifestAssets(raw);
    logger.info("Asset catalog loaded", {
      service: "storeService",
      operation: "getAssets",
      durationMs: Date.now() - startedAt,
      skippedInvalid: mapped.skippedInvalid,
      invalidDates: mapped.invalidDates,
      correlationId,
    });
    return { status: "ready", assets: mapped.assets };
  } catch (error) {
    const status = getHttpStatus(error);
    logger.error("Asset source unavailable", {
      service: "storeService",
      operation: "getAssets",
      code: "CATALOG_UNAVAILABLE",
      ...(status !== undefined ? { status } : {}),
      durationMs: Date.now() - startedAt,
      correlationId,
      err: {
        name: error instanceof Error ? error.name : "UnknownError",
        message: error instanceof Error ? error.message : "Unknown failure",
        ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
      },
    });
    return { status: "unavailable", assets: [] };
  }
}

export function getAssets(): Promise<AssetCatalogResult> {
  const endpoint = getDatabaseSources()?.primary;
  if (assetCache && assetCache.endpoint === endpoint && assetCache.expiresAt > Date.now()) {
    return Promise.resolve({ status: "ready", assets: assetCache.assets });
  }
  if (inFlightAssets) return inFlightAssets;

  const staleCache = assetCache?.endpoint === endpoint ? assetCache : null;
  const request = loadAssets().then((result) => {
    if (result.status === "ready") {
      assetCache = { endpoint: endpoint ?? "", assets: result.assets, expiresAt: Date.now() + ASSET_CACHE_TTL_MS };
      return result;
    }
    if (!staleCache) return result;

    logger.warn("Serving stale asset catalog after refresh failure", {
      service: "storeService",
      operation: "getAssets",
      code: "CATALOG_STALE",
    });
    return { status: "ready" as const, assets: staleCache.assets };
  }).finally(() => {
    inFlightAssets = null;
  });

  inFlightAssets = request;
  return request;
}

export async function getCatalog(params: CatalogParams = {}): Promise<AssetCatalogPage> {
  return selectCatalog(await getAssets(), params);
}

export async function getAsset(id: string): Promise<AssetLookupResult> {
  const source = await getAssets();
  if (source.status === "unavailable") return { status: "unavailable", asset: null };
  const asset = source.assets.find((entry) => entry.id === id) ?? null;
  if (!asset) return { status: "ready", asset: null };

  const repository = asset.packageUrl ? getGitHubRepositoryCoordinates(asset.packageUrl) : null;
  if (!repository) return { status: "ready", asset };

  const updatedAt = await getRepositoryUpdatedAt(repository, crypto.randomUUID());
  return { status: "ready", asset: updatedAt ? { ...asset, updatedAt } : asset };
}

