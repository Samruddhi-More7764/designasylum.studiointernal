"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { sevenloopTransformation } from "@/data/clientHub";

/**
 * Mobile-only (<lg) before/after drag compare.
 * Uses the same assets as the desktop Transformation panels.
 */
export function ClientHubMobileCompare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex h-[38px] items-center justify-center rounded-[64px] border-[1.5px] border-black/10 bg-[#F8F8F8] px-[14px] py-2 font-figtree text-[12px] font-medium leading-[10px] tracking-[0.8px] text-[#4B4B4B] uppercase">
          Before
        </span>
        <span className="inline-flex h-[38px] items-center justify-center rounded-[64px] border-[1.5px] border-black/10 bg-[#F8F8F8] px-[14px] py-2 font-figtree text-[12px] font-medium leading-[10px] tracking-[0.8px] text-[#4B4B4B] uppercase">
          After
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[350/420] w-full touch-none select-none overflow-hidden rounded-xl bg-[#464242]"
        onPointerDown={onPointerDown}
        role="slider"
        aria-label="Compare before and after"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setPosition((p) => Math.max(0, p - 2));
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setPosition((p) => Math.min(100, p + 2));
          }
        }}
      >
        {/* After (full base) */}
        <div className="absolute inset-0">
          <Image
            src={sevenloopTransformation.after.src}
            alt={sevenloopTransformation.after.alt}
            fill
            className="object-cover object-top"
            sizes="100vw"
            draggable={false}
          />
        </div>

        {/* Before (clipped from the left) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={sevenloopTransformation.before.src}
            alt={sevenloopTransformation.before.alt}
            fill
            className="object-cover object-top"
            sizes="100vw"
            draggable={false}
          />
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white shadow-md">
            <span className="font-figtree text-[10px] leading-none text-[#4B4B4B]">
              ‹ ›
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
