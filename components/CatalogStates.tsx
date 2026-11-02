"use client";

import { navigateCatalog } from "@/lib/navigation";

import { usePathname } from "next/navigation";
import { useApp } from "@/components/Providers";
import { Button } from "@/components/Button";

export function EmptyCatalog({ hasFilters }: { hasFilters: boolean }) {
  const { t } = useApp();
  const pathname = usePathname();


  return (
    <section className="grid min-h-64 place-items-center rounded-xl border border-divider bg-surface px-5 py-12 text-center">
      <div className="max-w-md">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          {hasFilters ? t("emptySearchTitle") : t("emptyCatalogTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {hasFilters ? t("emptySearchDescription") : t("emptyCatalogDescription")}
        </p>
        {hasFilters && (
          <Button
            onClick={() => navigateCatalog(pathname)}
            variant="primary"
            className="mt-5 rounded-md"
          >
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </section>
  );
}

export function CatalogUnavailable() {
  const { t } = useApp();


  return (
    <section role="alert" className="grid min-h-64 place-items-center rounded-xl border border-divider bg-surface px-5 py-12 text-center">
      <div className="max-w-md">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("catalogUnavailableTitle")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("catalogUnavailableDescription")}</p>
        <Button variant="primary" onClick={() => window.location.reload()} className="mt-5 rounded-md">
          {t("retry")}
        </Button>
      </div>
    </section>
  );
}

