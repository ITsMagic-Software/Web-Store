"use client";

import { navigateCatalog } from "@/lib/navigation";

import { m } from "motion/react";
import { transition } from "@/lib/motion";
import { useCallback, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/Providers";
import { CatalogSearch } from "@/components/CatalogSearch";
import { Button } from "@/components/Button";
import { Select } from "@/components/Select";
import { CategoryFilters } from "@/components/CategoryFilters";
import { Modal } from "@/components/Modal";
import { buildCatalogUrl, CATALOG_PAGE_SIZES, DEFAULT_CATALOG_PAGE_SIZE, normalizeCatalogPageSize } from "@/lib/catalogUrl";

type Sort = "date-desc" | "date-asc" | "title-asc";

function isSort(value: string): value is Sort {
  return value === "date-desc" || value === "date-asc" || value === "title-asc";
}

interface CatalogToolbarProps {
  categories: string[];
  category: string;
  sort: Sort;
  pageSize: number;
  resultCount: number;
  searchString: string;
  initialQuery: string;
}

export function CatalogToolbar({ categories, category, sort, pageSize, resultCount, searchString, initialQuery }: CatalogToolbarProps) {
  const { t } = useApp();
  const pathname = usePathname();

  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState(category);
  const [draftSort, setDraftSort] = useState<Sort>(sort);
  const [draftPageSize, setDraftPageSize] = useState(pageSize || DEFAULT_CATALOG_PAGE_SIZE);
  const sortOptions = [
    { value: "date-desc", label: t("sortRecent") },
    { value: "date-asc", label: t("sortOldest") },
    { value: "title-asc", label: t("sortTitle") },
  ];
  const pageSizeOptions = CATALOG_PAGE_SIZES.map((size) => ({
    value: String(size),
    label: t("itemsPerPageOption", { count: size }),
  }));

  const navigate = useCallback((changes: Partial<Record<"category" | "sort" | "perPage" | "page", string>>) => {
    const nextPath = buildCatalogUrl(pathname, searchString, changes);
    const currentPath = buildCatalogUrl(pathname, searchString);
    if (nextPath !== currentPath) startTransition(() => navigateCatalog(nextPath));
  }, [pathname, searchString]);

  const updateUrl = (key: "category" | "sort" | "perPage", value: string) => navigate({ [key]: value, page: "" });

  const openFilters = () => {
    setDraftCategory(category);
    setDraftSort(sort);
    setDraftPageSize(pageSize || DEFAULT_CATALOG_PAGE_SIZE);
    setFiltersOpen(true);
  };

  const applyFilters = () => {
    navigate({
      category: draftCategory,
      sort: draftSort === "date-desc" ? "" : draftSort,
      perPage: draftPageSize === DEFAULT_CATALOG_PAGE_SIZE ? "" : String(draftPageSize),
      page: "",
    });
    setFiltersOpen(false);
  };

  return (
    <m.section initial={false} aria-label={t("catalogTitle")} className="bg-background/70 py-3 backdrop-blur-2xl sm:sticky sm:top-16 sm:z-30">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(24.5rem,1fr)_minmax(0,20rem)_minmax(24.5rem,1fr)] lg:items-center lg:gap-4 lg:px-8">
        <div className="hidden min-w-0 overflow-x-auto lg:block">
          <CategoryFilters categories={categories} selectedCategory={category} layoutId="catalog-active-filter" onSelect={(value) => updateUrl("category", value)} className="lg:justify-start" />
        </div>

        <div className="flex min-w-0 items-center gap-2 lg:w-full lg:justify-self-center">
          <div className="min-w-0 flex-1 lg:w-full">
            <CatalogSearch initialQuery={initialQuery} searchString={searchString} />
          </div>
          <Button onClick={openFilters} aria-haspopup="dialog" className="h-11 shrink-0 px-3 whitespace-nowrap lg:hidden">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4"><path d="M3.5 5h13M6 10h8m-5.5 5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <span >{t("filterButton")}</span>
          </Button>
        </div>

        <div className="hidden min-w-0 items-center justify-end gap-2 lg:flex">
          <Select label={t("sortLabel")} value={sort} options={sortOptions} className="w-44 shrink-0" onChange={(value) => updateUrl("sort", value === "date-desc" ? "" : value)} />
          <Select label={t("itemsPerPageLabel")} value={String(pageSize || DEFAULT_CATALOG_PAGE_SIZE)} options={pageSizeOptions} className="w-30 shrink-0" onChange={(value) => updateUrl("perPage", value === String(DEFAULT_CATALOG_PAGE_SIZE) ? "" : value)} />
          <p aria-live="polite" title={t("resultCount", { count: resultCount })} className="w-20 shrink-0 truncate text-right text-sm tabular-nums text-muted-foreground">{t("resultCount", { count: resultCount })}</p>
        </div>
      </div>

      <Modal open={filtersOpen} onRequestClose={() => setFiltersOpen(false)} labelledBy="catalog-filter-title" className="catalog-filter-dialog lg:hidden" surfaceClassName="w-full rounded-2xl border border-divider bg-surface p-0 text-foreground shadow-md">
        <div className="flex max-h-[85dvh] flex-col">
          <header className="flex items-center justify-between border-b border-divider px-5 py-4">
            <h2 id="catalog-filter-title" className="text-lg font-semibold tracking-tight">{t("filterDialogTitle")}</h2>
            <Button size="icon" onClick={() => setFiltersOpen(false)} aria-label={t("closeFilters")} className="size-10">
              <m.svg variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }} transition={transition.reveal} aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></m.svg>
            </Button>
          </header>
          <div className="space-y-6 overflow-y-auto px-5 py-5">
            <section className="space-y-3" aria-label={t("allCategories")}>
              <h3 className="text-sm font-medium">{t("allCategories")}</h3>
              <CategoryFilters categories={categories} selectedCategory={draftCategory} layoutId="mobile-active-filter" onSelect={setDraftCategory} />
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><p className="text-sm font-medium">{t("sortLabel")}</p><Select label={t("sortLabel")} value={draftSort} options={sortOptions} className="w-full" onChange={(value) => { if (isSort(value)) setDraftSort(value); }} /></div>
              <div className="space-y-2"><p className="text-sm font-medium">{t("itemsPerPageLabel")}</p><Select label={t("itemsPerPageLabel")} value={String(draftPageSize)} options={pageSizeOptions} className="w-full" onChange={(value) => setDraftPageSize(normalizeCatalogPageSize(value))} /></div>
            </section>
            <p aria-live="polite" className="text-sm text-muted-foreground">{t("resultCount", { count: resultCount })}</p>
          </div>
          <footer className="flex gap-3 border-t border-divider px-5 py-4">
            <Button onClick={() => setFiltersOpen(false)} className="flex-1">{t("filterCancel")}</Button>
            <Button variant="primary" onClick={applyFilters} className="flex-1">{t("filterApply")}</Button>
          </footer>
        </div>
      </Modal>
    </m.section>
  );
}

