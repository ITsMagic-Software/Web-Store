"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useId, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { menuVariants, transition } from "@/lib/motion";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export function Select({ label, value, options, onChange, className = "" }: SelectProps) {
  const labelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative flex h-11 min-w-0 items-center ${className}`}>
      <span id={labelId} className="sr-only">{label}</span>
      <DropdownMenu.Root
        modal={false}
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setPortalContainer(triggerRef.current?.closest("dialog") ?? document.body);
          setOpen(nextOpen);
        }}
      >
        <DropdownMenu.Trigger ref={triggerRef} aria-labelledby={labelId} className="catalog-select-trigger inline-flex h-full w-full min-w-0 items-center justify-between gap-3 rounded-xl bg-surface px-3.5 text-left text-sm font-medium text-foreground shadow-sm transition-colors">
          <span className="min-w-0 truncate" title={selectedOption?.label}>{selectedOption?.label}</span>
          <m.svg initial={false} animate={{ rotate: open ? 180 : 0 }} transition={transition.quick} aria-hidden="true" viewBox="0 0 20 20" fill="none" className="catalog-select-arrow size-4 shrink-0 text-muted-foreground">
            <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </m.svg>
        </DropdownMenu.Trigger>

        <AnimatePresence>
        {open && <DropdownMenu.Portal container={portalContainer} forceMount>
          <DropdownMenu.Content forceMount asChild side="bottom" align="start" sideOffset={4} collisionPadding={8}>
          <m.div variants={menuVariants} initial="hidden" animate="visible" exit="exit" aria-hidden={!open} inert={!open} className="catalog-select-content z-100 max-h-(--radix-dropdown-menu-content-available-height) w-max min-w-(--radix-dropdown-menu-trigger-width) max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl bg-surface p-1.5 text-foreground shadow-md outline-none" style={{ transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)" }}>
            <DropdownMenu.RadioGroup value={value} onValueChange={onChange}>
              {options.map((option) => (
                <DropdownMenu.RadioItem key={option.value} value={option.value} className="relative flex min-h-10 cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm outline-none data-highlighted:bg-muted data-highlighteds:text-foreground data-[state=checked]:bg-muted data-[state=checked]:font-medium">
                  <span className="min-w-0 truncate" title={option.label}>{option.label}</span>
                  <DropdownMenu.ItemIndicator className="absolute right-3 inline-flex items-center text-muted-foreground">
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4"><path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </DropdownMenu.ItemIndicator>
                </DropdownMenu.RadioItem>
              ))}
            </DropdownMenu.RadioGroup>
          </m.div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>}
        </AnimatePresence>
      </DropdownMenu.Root>
    </div>
  );
}
