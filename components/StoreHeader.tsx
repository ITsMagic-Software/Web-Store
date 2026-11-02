"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useApp } from "@/components/Providers";
import type { Locale, Theme } from "@/components/Providers";
import { localizedPath } from "@/lib/i18n";
import { buttonMotion, iconVariants, spring } from "@/lib/motion";
import { withBasePath } from "@/lib/paths";

function nextTheme(isDark: boolean): Theme {
  return isDark ? "light" : "dark";
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "system" ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4"><rect x="2.5" y="3" width="15" height="10.5" rx="1.8" stroke="currentColor" strokeWidth="1.5"/><path d="M7 17h6m-3-3.5V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ) : theme === "dark" ? (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4"><path d="M16.2 12.2A6.7 6.7 0 0 1 7.8 3.8a6.8 6.8 0 1 0 8.4 8.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4"><circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.5"/><path d="M10 1.8v1.5m0 13.4v1.5m8.2-8.2h-1.5M3.3 10H1.8m14-5.8-1.1 1.1M5.3 14.7l-1.1 1.1m11.6 0-1.1-1.1M5.3 5.3 4.2 4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  );
}

export function StoreHeader({ searchString }: { searchString: string }) {
  const { t, locale, theme, setTheme } = useApp();
  const pathname = usePathname();
  const nextLocale: Locale = locale === "en" ? "pt-BR" : "en";
  const localeHref = `${localizedPath(nextLocale, pathname)}${searchString ? `?${searchString}` : ""}`;

  return (
    <header className="store-header sticky top-0 z-40 h-16 bg-background/70 backdrop-blur-2xl">
      <nav aria-label={t("storeName")} className="mx-auto flex h-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <a href={withBasePath(`/${locale === "pt-BR" ? "pt-br" : "en"}`)} className="flex min-h-11 shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground">
          <Image src="/store/itsmagic-logo.png" alt="" width={34} height={34} priority className="size-8" />
          <span>{t("brandDisplay")}</span>
        </a>
        <div className="flex shrink-0 items-center gap-1 rounded-full border-divider/70 bg-surface/55 p-1 shadow-sm backdrop-blur-xl">
          <Link href={localeHref} prefetch={false} scroll={false} aria-label={t("languageLabel")} className="flex min-h-10 min-w-12 items-center justify-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none">
            <m.span whileHover={buttonMotion.hover} whileTap={buttonMotion.tap} transition={spring.hover}>{nextLocale}</m.span>
          </Link>
          <m.button type="button" whileHover={buttonMotion.hover} whileTap={buttonMotion.tap} transition={spring.hover} onClick={() => setTheme(nextTheme(document.documentElement.classList.contains("dark")))} aria-label={theme === "dark" ? t("themeLight") : theme === "light" ? t("themeDark") : t("themeLabel")} className="grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none">
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={theme} variants={iconVariants} initial="hidden" animate="visible" exit="exit" className="grid place-items-center">
                <ThemeIcon theme={theme} />
              </m.span>
            </AnimatePresence>
          </m.button>
        </div>
      </nav>
    </header>
  );
}
