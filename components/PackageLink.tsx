"use client";

import { navigateCatalog } from "@/lib/navigation";
import { withBasePath } from "@/lib/paths";
import type { MouseEvent, ReactNode } from "react";
import { markModalOpenedInApp } from "@/lib/modalHistory";

interface PackageLinkProps {
  href: string;
  label: string;
  className: string;
  children: ReactNode;
}

export function PackageLink({ href, label, className, children }: PackageLinkProps) {
  const markInAppNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    markModalOpenedInApp();
    navigateCatalog(href, true);
  };

  return <a href={withBasePath(href)} onClick={markInAppNavigation} aria-label={label} className={className}>{children}</a>;
}
