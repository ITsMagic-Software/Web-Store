"use client";

import { useSyncExternalStore } from "react";
import { withBasePath } from "@/lib/paths";

const catalogEvent = "itsmagic:catalog";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(catalogEvent, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(catalogEvent, callback);
  };
}
export function useCatalogSearch() {
  return useSyncExternalStore(subscribe, () => window.location.search.slice(1), () => "");
}
export function navigateCatalog(href: string, push = false) {
  const target = withBasePath(href);
  if (push) window.history.pushState(null, "", target);
  else window.history.replaceState(null, "", target);
  window.dispatchEvent(new Event(catalogEvent));
}
