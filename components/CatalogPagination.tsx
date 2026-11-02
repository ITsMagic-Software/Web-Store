"use client";

import { navigateCatalog } from "@/lib/navigation";

import { useCallback, useTransition } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/components/Providers";
import { buildCatalogUrl } from "@/lib/catalogUrl";
import { Button } from "@/components/Button";

interface CatalogPaginationProps {
  page: number;
  totalPages: number;
  searchString: string;
}

export function CatalogPagination({ page, totalPages, searchString }: CatalogPaginationProps) {
  const { t } = useApp();
  const pathname = usePathname();

  const [, startTransition] = useTransition();

  const goToPage = useCallback((nextPage: number) => {
    const nextPath = buildCatalogUrl(pathname, searchString, { page: nextPage > 1 ? String(nextPage) : "" });
    startTransition(() => navigateCatalog(nextPath));
  }, [pathname, searchString]);

  if (totalPages <= 1) return null;
  return (
    <nav aria-label={t("catalogTitle")} className="mt-8 flex items-center justify-center gap-3">
      <Button disabled={page <= 1} onClick={() => goToPage(page - 1)} aria-label={t("previousPage")} className="rounded-md">
        {t("previousPage")}
      </Button>
      <span className="text-sm tabular-nums text-muted-foreground">{t("pageIndicator", { page, total: totalPages })}</span>
      <Button disabled={page >= totalPages} onClick={() => goToPage(page + 1)} aria-label={t("nextPage")} className="rounded-md">
        {t("nextPage")}
      </Button>
    </nav>
  );
}

