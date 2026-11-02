"use client";

import Link from "next/link";
import { useApp } from "@/components/Providers";

export default function NotFound() {
  const { t, locale } = useApp();
  return (
    <main className="grid min-h-[70dvh] place-items-center bg-background px-4 py-12 text-center text-foreground">
      <section className="max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t("notFoundDescription")}</p>
        <Link href={`/${locale === "pt-BR" ? "pt-br" : "en"}`} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background">{t("backToCatalog")}</Link>
      </section>
    </main>
  );
}
