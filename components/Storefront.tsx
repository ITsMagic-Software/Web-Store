"use client";

import type { ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { contentVariants } from "@/lib/motion";
import { Reveal } from "@/components/MotionEffects";
import type { AssetCatalogPage } from "@/services";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { AssetCard } from "@/components/AssetCard";
import { CatalogPagination } from "@/components/CatalogPagination";
import { CatalogUnavailable, EmptyCatalog } from "@/components/CatalogStates";
import { CatalogToolbar } from "@/components/CatalogToolbar";
import { StoreHeader } from "@/components/StoreHeader";
import { StoreFooter } from "@/components/StoreFooter";

interface StorefrontProps {
  locale: Locale;
  searchString: string;
  children: ReactNode;
}

interface CatalogContentProps {
  catalog: AssetCatalogPage;
  query: string;
  category: string;
  sort: "date-desc" | "date-asc" | "title-asc";
  searchString: string;
}

export function Storefront({ locale, searchString, children }: StorefrontProps) {
  const messages = getDictionary(locale);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-3 focus:text-sm focus:text-background">
        {messages.skipToContent}
      </a>
      <StoreHeader searchString={searchString} />
      <main id="main-content" className="min-h-[calc(100dvh-3.5rem)] text-foreground">
        <section id="top" className="relative isolate overflow-hidden px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pt-28">
          <div aria-hidden="true" className="store-hero-grid pointer-events-none absolute inset-0 -z-10 opacity-35" />
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-1 -z-10 mx-auto h-72 max-w-4xl" />
          <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.065em] text-foreground sm:text-6xl lg:text-7xl">
              {messages.storeHeroTitle}
            </h1>
            <p className="mt-5 max-w-[58ch] text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
              {messages.storeHeroDescription}
            </p>
          </Reveal>
        </section>
        {children}
      </main>
      <StoreFooter locale={locale} />
    </>
  );
}

export function CatalogContent({ catalog, query, category, sort, searchString }: CatalogContentProps) {
  const unavailable = catalog.status === "unavailable";
  const assets = catalog.status === "ready" ? catalog.assets : [];
  const categories = catalog.status === "ready" ? catalog.categories : [];
  const resultCount = catalog.status === "ready" ? catalog.total : 0;
  const totalPages = catalog.status === "ready" ? Math.max(1, Math.ceil(catalog.total / catalog.pageSize)) : 1;
  const currentPage = catalog.status === "ready" ? catalog.page : 1;

  return (
    <>
      <CatalogToolbar categories={categories} category={category} sort={sort} pageSize={catalog.pageSize} resultCount={resultCount} searchString={searchString} initialQuery={query} />
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <AnimatePresence initial={false} mode="wait">
        <m.div key={`${query}|${category}|${sort}|${catalog.pageSize}|${currentPage}|${catalog.status}`} variants={contentVariants} initial="hidden" animate="visible" exit="exit">
        {unavailable ? <CatalogUnavailable /> : assets.length === 0 ? <EmptyCatalog hasFilters={Boolean(query || category)} /> : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((asset) => <AssetCard key={asset.id} asset={asset} searchString={searchString} />)}
          </div>
        )}
        {!unavailable && <CatalogPagination page={currentPage} totalPages={totalPages} searchString={searchString} />}
        </m.div>
        </AnimatePresence>
      </section>
    </>
  );
}
