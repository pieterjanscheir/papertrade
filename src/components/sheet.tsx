"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

/** Bottom sheet on mobile, centered dialog on desktop. Built on native <dialog>. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  /** Wider dialog on desktop (e.g. for reading). */
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // showModal() moves focus to the first button; prefer a field marked data-autofocus.
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className={`m-0 mt-auto w-full max-w-none bg-transparent p-0 text-fg sm:m-auto ${wide ? "sm:max-w-2xl" : "sm:max-w-md"}`}
    >
      {open && (
        <div className="animate-sheet max-h-[92dvh] overflow-y-auto rounded-t-3xl border border-line bg-surface px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-3xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" />
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="text-lg font-semibold">{title}</div>
            <button onClick={onClose} className="grid size-8 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
