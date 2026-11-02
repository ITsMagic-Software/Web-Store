"use client";

import { useEffect } from "react";
import { useApp } from "@/components/Providers";
import { logger } from "@/lib/logger";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useApp();
  useEffect(() => {
    logger.error("Unhandled route error", {
      service: "storefront", operation: "renderRoute", code: "UNHANDLED_ROUTE_ERROR",
      err: { name: error.name, message: error.digest ?? "Route rendering failed" },
    });
  }, [error]);

  return (
    <main className="grid min-h-[70dvh] place-items-center bg-background px-4 py-12 text-center">
      <section className="max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t("errorTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("errorDescription")}</p>
        <button type="button" onClick={reset} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background">{t("retry")}</button>
      </section>
    </main>
  );
}
