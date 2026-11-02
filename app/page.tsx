"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StoreSkeleton } from "@/components/StoreSkeleton";
import { getDictionary } from "@/lib/i18n";
import { withBasePath } from "@/lib/paths";

export default function RootPage() {
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("itsmagic-locale"); } catch { /* Preferences are optional. */ }
    const locale = saved === "pt-BR" || (!saved && navigator.language.toLowerCase().startsWith("pt")) ? "pt-br" : "en";
    window.location.replace(`${withBasePath(`/${locale}`)}${window.location.search}`);
  }, []);
  return <><StoreSkeleton /><Link href="/en/">{getDictionary("en").backToCatalog}</Link></>;
}
