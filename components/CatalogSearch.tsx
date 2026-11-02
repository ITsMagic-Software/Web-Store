"use client";

import { navigateCatalog } from "@/lib/navigation";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/Providers";
import { buildCatalogUrl } from "@/lib/catalogUrl";

interface CatalogSearchProps {
  initialQuery: string;
  searchString: string;
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4 shrink-0 text-muted-foreground">
      <circle cx="10.8" cy="10.8" r="6.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="m15.5 15.5 4.1 4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CatalogSearch({ initialQuery, searchString }: CatalogSearchProps) {
  const { t } = useApp();
  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [previousQuery, setPreviousQuery] = useState(initialQuery);
  if (previousQuery !== initialQuery) {
    setPreviousQuery(initialQuery);
    setQuery(initialQuery);
  }

  const updateQuery = useCallback((value: string) => {
    const nextPath = buildCatalogUrl(pathname, searchString, { q: value, page: "" });
    const currentPath = buildCatalogUrl(pathname, searchString);
    if (nextPath !== currentPath) startTransition(() => navigateCatalog(nextPath));
  }, [pathname, searchString]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentQuery = new URLSearchParams(searchString).get("q") ?? "";
      const nextQuery = query.trim();
      if (nextQuery !== currentQuery) updateQuery(nextQuery);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query, searchString, updateQuery]);

  return (
    <label className="flex h-11 w-full items-center gap-3 rounded-xl bg-surface px-3.5 shadow-sm transition-colors">
      <SearchIcon />
      <span className="sr-only">{t("searchPlaceholder")}</span>
      <input
        id="catalog-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-busy={isPending}
        className="h-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}

