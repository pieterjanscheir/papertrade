"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useToasts } from "@/lib/ui/toasts";

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex flex-col items-center gap-2 p-4 md:items-end md:p-6">
      {toasts.map((t) => {
        const dot = t.tone === "gain" ? "bg-gain" : t.tone === "loss" ? "bg-loss" : "bg-accent";
        const content = (
          <>
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${dot}`} />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{t.title}</span>
              {t.body && <span className="block text-sm text-muted">{t.body}</span>}
            </span>
          </>
        );
        return (
          <div
            key={t.id}
            className="animate-sheet pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface-2/95 p-4 shadow-2xl backdrop-blur"
          >
            {t.href ? (
              <Link href={t.href} onClick={() => dismiss(t.id)} className="flex min-w-0 flex-1 gap-3">
                {content}
              </Link>
            ) : (
              <div className="flex min-w-0 flex-1 gap-3">{content}</div>
            )}
            <button onClick={() => dismiss(t.id)} className="text-muted hover:text-fg" aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
