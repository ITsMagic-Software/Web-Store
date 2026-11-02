"use client";

import { m } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { navigateCatalog } from "@/lib/navigation";
import { Modal } from "@/components/Modal";
import { consumeModalOpenedInApp, resetModalHistory } from "@/lib/modalHistory";
import { buttonMotion, spring, transition } from "@/lib/motion";
import { useApp } from "@/components/Providers";

interface AssetDetailModalProps {
  open: boolean;
  packageId: string | null;
  closeHref: string;
  closeLabel: string;
  title: string;
  children: ReactNode;
}

export function AssetDetailModal({ open, packageId, closeHref, closeLabel, title, children }: AssetDetailModalProps) {
  const { t } = useApp();
  const [modalState, setModalState] = useState({ packageId, closing: false, shouldNavigate: false });

  if (modalState.packageId !== packageId) {
    setModalState({ packageId, closing: false, shouldNavigate: false });
  }

  const closing = modalState.packageId === packageId && modalState.closing;

  useEffect(() => {
    if (!open) resetModalHistory();
  }, [open, packageId]);

  useEffect(() => () => resetModalHistory(), []);

  const requestClose = () => {
    if (!open || closing) return;
    setModalState({ packageId, closing: true, shouldNavigate: true });
  };

  const finishClose = () => {
    if (!modalState.shouldNavigate) return;
    if (consumeModalOpenedInApp()) {
      window.history.back();
      return;
    }
    resetModalHistory();
    navigateCatalog(closeHref);
  };

  return (
    <Modal
      open={open && !closing}
      onRequestClose={requestClose}
      onExitComplete={finishClose}
      labelledBy="asset-detail-title"
      className="asset-detail-dialog"
      surfaceClassName="asset-detail-panel"
    >
      <header className="asset-detail-header flex shrink-0 items-start justify-between gap-4 border-b border-divider px-5 py-4 sm:px-7 sm:py-5">
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground">{t("assetDetailTitle")}</p>
          <h2 id="asset-detail-title" className="wrap-anywhere text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">{title}</h2>
        </div>
        <m.button autoFocus type="button" onClick={requestClose} aria-label={closeLabel} title={closeLabel} initial="rest" whileHover="hover" whileTap={buttonMotion.tap} transition={spring.hover} className="grid size-11 shrink-0 place-items-center rounded-full border border-divider bg-surface text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <m.svg variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }} transition={transition.reveal} aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-5"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></m.svg>
        </m.button>
      </header>
      {children}
    </Modal>
  );
}
