import en from "@/locales/en.json";
import ptBR from "@/locales/pt-BR.json";
import { withoutBasePath } from "./paths";

export type Locale = "en" | "pt-BR";
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, "pt-BR": ptBR };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function translate(locale: Locale, key: keyof Dictionary, values?: Record<string, string | number>): string {
  const message = String(dictionaries[locale][key]);
  return values ? message.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match)) : message;
}

export function localeFromPath(pathname: string | null, fallback: Locale = "en"): Locale {
  pathname = pathname === null ? null : withoutBasePath(pathname);
  if (pathname === "/pt-br" || pathname?.startsWith("/pt-br/")) return "pt-BR";
  if (pathname === "/en" || pathname?.startsWith("/en/")) return "en";
  return fallback;
}

export function localizedPath(locale: Locale, pathname: string): string {
  const suffix = withoutBasePath(pathname).replace(/^\/(en|pt-br)(?=\/|$)/i, "");
  const prefix = locale === "pt-BR" ? "pt-br" : "en";
  return `/${prefix}${suffix}`;
}
