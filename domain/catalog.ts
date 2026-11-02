import type { Asset } from "./models";

export interface CatalogParams {
  query?: string;
  category?: string;
  sort?: "date-desc" | "date-asc" | "title-asc";
  page?: number;
  pageSize?: number;
}
export type AssetCatalogResult = { status: "ready"; assets: Asset[] } | { status: "unavailable"; assets: [] };
export type AssetCatalogPage =
  | { status: "ready"; assets: Asset[]; categories: string[]; total: number; page: number; pageSize: number }
  | { status: "unavailable"; assets: []; categories: []; total: 0; page: 1; pageSize: number };

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
function positiveInteger(value: number | undefined, fallback: number) {
  return value !== undefined && Number.isFinite(value) && value >= 1 ? Math.trunc(value) : fallback;
}
export function selectCatalog(source: AssetCatalogResult, params: CatalogParams = {}): AssetCatalogPage {
  const pageSize = Math.min(100, positiveInteger(params.pageSize, 24));
  if (source.status === "unavailable") return { status: "unavailable", assets: [], categories: [], total: 0, page: 1, pageSize };
  const query = normalize(params.query ?? "");
  const collator = new Intl.Collator("en", { sensitivity: "base" });
  const assets = source.assets.filter((asset) => {
    if (params.category && asset.category !== params.category) return false;
    return !query || normalize([asset.title, asset.description, asset.category, asset.creator, asset.tags?.join(" ")].filter(Boolean).join(" ")).includes(query);
  }).toSorted((a, b) => {
    if (params.sort === "title-asc") return collator.compare(a.title, b.title);
    const left = Date.parse(a.publishedAt);
    const right = Date.parse(b.publishedAt);
    const invalidLeft = !Number.isFinite(left) || left === 0;
    const invalidRight = !Number.isFinite(right) || right === 0;
    if (invalidLeft !== invalidRight) return invalidLeft ? 1 : -1;
    if (!invalidLeft && left !== right) return params.sort === "date-asc" ? left - right : right - left;
    return collator.compare(a.title, b.title);
  });
  const total = assets.length;
  const page = Math.min(Math.max(1, Math.ceil(total / pageSize)), positiveInteger(params.page, 1));
  return {
    status: "ready", assets: assets.slice((page - 1) * pageSize, page * pageSize),
    categories: [...new Set(source.assets.flatMap((asset) => asset.category ? [asset.category] : []))].sort(collator.compare),
    total, page, pageSize,
  };
}
