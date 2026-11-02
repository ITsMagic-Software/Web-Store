import { describe, expect, it } from "vitest";
import { selectCatalog } from "@/domain/catalog";
import type { AssetCatalogResult } from "@/domain/catalog";

const source: AssetCatalogResult = { status: "ready", assets: [
  { id: "old", title: "Árvore", category: "package", publishedAt: "2025-01-01T00:00:00.000Z" },
  { id: "new", title: "Car", category: "template", publishedAt: "2026-01-01T00:00:00.000Z" },
  { id: "invalid", title: "Broken date", publishedAt: "not-a-date" },
] };

describe("static catalog selection", () => {
  it("finds accented titles and retains all category options while filtering", () => {
    const result = selectCatalog(source, { query: "arvore", category: "package" });
    expect(result.assets.map((asset) => asset.id)).toEqual(["old"]);
    expect(result.categories).toEqual(["package", "template"]);
  });
  it("keeps invalid dates last for either date order", () => {
    expect(selectCatalog(source).assets.map((asset) => asset.id)).toEqual(["new", "old", "invalid"]);
    expect(selectCatalog(source, { sort: "date-asc" }).assets.map((asset) => asset.id)).toEqual(["old", "new", "invalid"]);
  });
  it("clamps pages and handles non-finite URL parameters", () => {
    expect(selectCatalog(source, { page: 999, pageSize: 1 }).page).toBe(3);
    const result = selectCatalog(source, { page: NaN, pageSize: Infinity });
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(24);
    expect(result.total).toBe(3);
  });
});
