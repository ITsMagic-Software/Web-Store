"use client";

import type { Locale } from "@/lib/i18n";
import type { AssetCatalogResult } from "@/services";
import { selectCatalog } from "@/domain/catalog";
import { normalizeCatalogPageSize } from "@/lib/catalogUrl";
import { useCatalogSearch } from "@/lib/navigation";
import { getDictionary } from "@/lib/i18n";
import { CatalogContent, Storefront } from "@/components/Storefront";
import { AssetDetailModal } from "@/components/AssetDetailModal";
import { AssetDetailContent } from "@/components/AssetDetail";

export function StaticCatalog({ source, locale }: { source: AssetCatalogResult; locale: Locale }) {
  const search = useCatalogSearch();
  const values = new URLSearchParams(search);
  const query = (values.get("q") ?? "").trim();
  const category = values.get("category") ?? "";
  const rawSort = values.get("sort");
  const sort = rawSort === "date-asc" || rawSort === "title-asc" ? rawSort : "date-desc";
  const page = Number(values.get("page") ?? 1);
  const pageSize = normalizeCatalogPageSize(values.get("perPage") ?? "");
  const catalog = selectCatalog(source, { query, category, sort, page, pageSize });
  const selected = source.assets.find((asset) => asset.id === values.get("pkg"));
  const retained = new URLSearchParams(search);
  retained.delete("pkg");
  const searchString = retained.toString();
  const closeHref = `/${locale === "pt-BR" ? "pt-br" : "en"}/${searchString ? `?${searchString}` : ""}`;
  return (
    <>
      <Storefront locale={locale} searchString={searchString}>
        <CatalogContent catalog={catalog} query={query} category={category} sort={sort} searchString={searchString} />
      </Storefront>
      <AssetDetailModal open={Boolean(selected)} packageId={selected?.id ?? null} closeHref={closeHref} closeLabel={getDictionary(locale).backToCatalog} title={selected?.title ?? getDictionary(locale).assetDetailTitle}>
        {selected && <AssetDetailContent asset={selected} locale={locale} />}
      </AssetDetailModal>
    </>
  );
}
