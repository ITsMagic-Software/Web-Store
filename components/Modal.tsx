"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, m, useIsPresent } from "motion/react";
import { fadeVariants, modalVariants } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onRequestClose: () => void;
  onExitComplete?: () => void;
  labelledBy: string;
  className: string;
  surfaceClassName: string;
  children: ReactNode;
}

function Dialog({ onRequestClose, labelledBy, className, surfaceClassName, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPointerDown = useRef(false);
  const isPresent = useIsPresent();

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const isBackdrop = (target: EventTarget) => target === dialogRef.current || (target instanceof HTMLElement && target.dataset.modalBackdrop !== undefined);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      className={`store-modal ${className}`}
      data-state={isPresent ? "open" : "closed"}
      onPointerDown={(event) => { backdropPointerDown.current = isBackdrop(event.target); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab" || event.defaultPrevented) return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [tabindex]"))
          .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last && first) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        if (isPresent) onRequestClose();
      }}
      onClick={(event) => {
        if (isPresent && isBackdrop(event.target) && backdropPointerDown.current) onRequestClose();
        backdropPointerDown.current = false;
      }}
    >
      <m.div data-modal-backdrop="" aria-hidden="true" className="modal-backdrop" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" />
      <m.div className={`modal-surface ${surfaceClassName}`} variants={modalVariants} initial="hidden" animate="visible" exit="exit">
        {children}
      </m.div>
    </dialog>
  );
}

export function Modal(props: ModalProps) {
  return (
    <AnimatePresence onExitComplete={props.onExitComplete}>
      {props.open && <Dialog key="dialog" {...props} />}
    </AnimatePresence>
  );
}
