"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { translate } from "@/lib/i18n";
import type { Dictionary, Locale } from "@/lib/i18n";

export type { Locale } from "@/lib/i18n";
export type Theme = "system" | "light" | "dark";
type MessageValues = Record<string, string | number>;
type AppContextValue = {
  locale: Locale;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (key: keyof Dictionary, values?: MessageValues) => string;
};

const AppContext = createContext<AppContextValue | null>(null);
const preferenceEvent = "itsmagic:preferences";

function subscribePreferences(callback: () => void) {
  window.addEventListener(preferenceEvent, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(preferenceEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

function readLocale(fallback: Locale): Locale {
  const saved = localStorage.getItem("itsmagic-locale");
  return saved === "pt-BR" || saved === "en" ? saved : fallback;
}

function readTheme(): Theme {
  const value = localStorage.getItem("itsmagic-theme");
  return value === "light" || value === "dark" ? value : "system";
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark));
  document.documentElement.style.colorScheme = theme === "system" ? "light dark" : theme;
}

function persistLocale(locale: Locale) {
  localStorage.setItem("itsmagic-locale", locale);
  document.cookie = `itsmagic-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale === "pt-BR" ? "pt-BR" : "en";
  window.dispatchEvent(new Event(preferenceEvent));
}

export function Providers({ children, initialLocale = "en" }: { children: React.ReactNode; initialLocale?: Locale }) {
  const savedLocale = useSyncExternalStore<Locale>(subscribePreferences, () => readLocale(initialLocale), () => initialLocale);
  const locale = savedLocale;
  const theme = useSyncExternalStore<Theme>(subscribePreferences, readTheme, () => "system");

  useEffect(() => {
    document.documentElement.lang = locale === "pt-BR" ? "pt-BR" : "en";
  }, [locale]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => { if (theme === "system") applyTheme("system"); };
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem("itsmagic-theme", next);
    applyTheme(next);
    window.dispatchEvent(new Event(preferenceEvent));
  }, []);

  const value = useMemo<AppContextValue>(() => ({
    locale,
    theme,
    setTheme,
    t: (key, values) => translate(locale, key, values),
  }), [locale, setTheme, theme]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function RouteLocaleProvider({ locale: initialLocale, children }: { locale: Locale; children: React.ReactNode }) {
  const preferences = useContext(AppContext);
  if (!preferences) throw new Error("RouteLocaleProvider must be used within Providers");
  useEffect(() => {
    persistLocale(initialLocale);
  }, [initialLocale]);

  const value = useMemo<AppContextValue>(() => ({
    ...preferences,
    locale: initialLocale,
    t: (key, values) => translate(initialLocale, key, values),
  }), [initialLocale, preferences]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within Providers");
  return context;
}
