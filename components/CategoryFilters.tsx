"use client";

import { LayoutGroup, m } from "motion/react";
import { useApp } from "@/components/Providers";
import { buttonMotion, spring } from "@/lib/motion";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  layoutId: "catalog-active-filter" | "mobile-active-filter";
  onSelect: (category: string) => void;
  className?: string;
}

export function CategoryFilters({ categories, selectedCategory, layoutId, onSelect, className = "" }: CategoryFiltersProps) {
  const { t } = useApp();
  const options = ["", ...categories];

  return (
    <LayoutGroup id={layoutId}>
      <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label={t("allCategories")}>
        {options.map((category) => {
          const selected = selectedCategory === category;
          const label = category === "template"
            ? t("templatesCategory")
            : category === "package"
              ? t("packagesCategory")
              : category || t("allCategories");

          return (
            <m.button
              key={category || "all"}
              type="button"
              whileTap={buttonMotion.tap}
              transition={spring.hover}
              aria-pressed={selected}
              onClick={() => onSelect(category)}
              className={`relative isolate min-h-10 whitespace-nowrap rounded-full px-3.5 shadow-sm text-sm transition-colors ${selected ? "text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {selected && <m.span layoutId={layoutId} transition={spring.layout} aria-hidden="true" className="absolute inset-0 -z-10 rounded-full bg-foreground" />}
              <span className="relative">{label}</span>
            </m.button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
