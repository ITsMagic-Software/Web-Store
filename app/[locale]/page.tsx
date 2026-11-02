import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticCatalog } from "@/components/StaticCatalog";
import { getDictionary } from "@/lib/i18n";
import { withBasePath } from "@/lib/paths";
import { storeRepository } from "@/services";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "pt-br") return {};
  const messages = getDictionary(locale === "pt-br" ? "pt-BR" : "en");
  return {
    title: messages.storeName,
    description: messages.metadataDescription,
    alternates: { canonical: withBasePath(`/${locale}`), languages: { en: withBasePath("/en"), "pt-BR": withBasePath("/pt-br") } },
  };
}
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "pt-br") notFound();
  const source = await storeRepository.getSnapshot();
  if (source.status !== "ready") throw new Error("Cannot export an unavailable catalog");
  return <StaticCatalog source={source} locale={locale === "pt-br" ? "pt-BR" : "en"} />;
}
