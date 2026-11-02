"use client";

import { useSyncExternalStore } from "react";
import { getDictionary, localeFromPath } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("itsmagic:preferences", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("itsmagic:preferences", callback);
  };
}

function readLocale() {
  const saved = localStorage.getItem("itsmagic-locale");
  return localeFromPath(window.location.pathname, saved === "pt-BR" ? "pt-BR" : "en");
}

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useSyncExternalStore<Locale>(subscribeLocale, readLocale, () => "en");
  const messages = getDictionary(locale);

  return (
    <html lang={locale === "pt-BR" ? "pt-BR" : "en"} suppressHydrationWarning>
      <body className="grid min-h-dvh place-items-center bg-background px-4 py-12 text-center text-foreground">
        <main className="max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">{messages.errorTitle}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{messages.errorDescription}</p>
          <button type="button" onClick={reset} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-foreground px-5 text-sm font-medium text-background">{messages.retry}</button>
        </main>
      </body>
    </html>
  );
}
