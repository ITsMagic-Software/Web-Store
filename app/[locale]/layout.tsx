import { notFound } from "next/navigation";
import { RouteLocaleProvider } from "@/components/Providers";
import type { ReactNode } from "react";

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "pt-br") notFound();
  return (
    <RouteLocaleProvider locale={locale === "pt-br" ? "pt-BR" : "en"}>
      {children}
    </RouteLocaleProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt-br" }];
}
