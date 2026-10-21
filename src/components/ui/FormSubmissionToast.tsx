"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export interface FormSubmissionToastProps {
  show: boolean;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export function FormSubmissionToast({
  show,
  message = "Submitted successfully",
  onClose,
  duration = 5000,
}: FormSubmissionToastProps) {
  const [closing, setClosing] = useState(false);
  const [prevShow, setPrevShow] = useState(show);

  if (show !== prevShow) {
    setPrevShow(show);
    if (show) {
      setClosing(false);
    }
  }

  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  const isVisible = !closing;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex h-12 w-[344px] max-w-[calc(100vw-32px)] items-center justify-between rounded-lg border border-[#0F9F44]/25 bg-[#e6f1e9] px-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F9F44]">
          <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" aria-hidden="true" />
        </div>
        <span className="truncate font-satoshi text-[15px] font-medium text-black">
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          setClosing(true);
          setTimeout(onClose, 300);
        }}
        aria-label="Close notification"
        className="shrink-0 p-1 text-black/60 transition-colors hover:text-black cursor-pointer"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
