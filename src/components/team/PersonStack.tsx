"use client";

import { useEffect, useRef, useState } from "react";

const SLOTS = [
  { rotate: -4.45, x: 8, y: 12, z: 30, tone: "#d9d9d9" },
  { rotate: -0.62, x: 36, y: 10, z: 20, tone: "#bdbdbd" },
  { rotate: 2.67, x: 4, y: 3, z: 10, tone: "#919090" },
] as const;

/**
 * Three photos stacked like a short deck. Arrows, swipe, and a slow
 * automatic pass all move the front card aside and bring the next one up.
 * An empty slot stays the grey placeholder from the design.
 */
export function PersonStack({ images }: { images: Array<string | null> }) {
  const slides = [0, 1, 2].map((index) => images[index] || null);
  const [front, setFront] = useState(0);
  const [leaving, setLeaving] = useState<"next" | "prev" | null>(null);
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);
  const reduced = useRef(false);

  function show(direction: "next" | "prev") {
    if (leaving) return;
    if (reduced.current) {
      setFront((current) => (current + (direction === "next" ? 1 : 2)) % 3);
      return;
    }
    setLeaving(direction);
    window.setTimeout(() => {
      setFront((current) => (current + (direction === "next" ? 1 : 2)) % 3);
      setLeaving(null);
      setDrag(0);
    }, 420);
  }

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;
    const timer = window.setInterval(() => show("next"), 3400);
    return () => window.clearInterval(timer);
  }, [front, leaving]);

  return (
    <div className="relative mx-auto flex w-full max-w-[1190px] items-center justify-center">
      <button
        type="button"
        aria-label="Previous photo"
        onClick={() => show("prev")}
        className="absolute left-0 z-40 hidden size-10 items-center justify-center rounded-lg bg-black/8 lg:flex"
      >
        <img src="/assets/images/team/chevron-left.svg" alt="" width={16} height={16} />
      </button>
      <div
        className="relative h-[420px] w-[320px] touch-pan-y lg:h-[462px] lg:w-[360px]"
        onPointerDown={(event) => {
          startX.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (startX.current == null || leaving) return;
          setDrag(event.clientX - startX.current);
        }}
        onPointerUp={(event) => {
          if (startX.current == null) return;
          const delta = event.clientX - startX.current;
          startX.current = null;
          if (delta <= -48) show("next");
          else if (delta >= 48) show("prev");
          else setDrag(0);
        }}
        onPointerCancel={() => {
          startX.current = null;
          setDrag(0);
        }}
      >
        {slides.map((src, index) => {
          const slot = (index - front + 3) % 3;
          const pose = SLOTS[slot];
          const isFront = slot === 0;
          let transform = `translate(${pose.x}px, ${pose.y}px) rotate(${pose.rotate}deg)`;
          if (isFront && leaving === "next") transform = "translate(-130%, 12px) rotate(-16deg)";
          else if (isFront && leaving === "prev") transform = "translate(130%, 12px) rotate(16deg)";
          else if (isFront && drag) transform = `translate(${pose.x + drag}px, ${pose.y}px) rotate(${pose.rotate + drag / 24}deg)`;

          return (
            <div
              key={index}
              className="absolute top-0 left-0 h-[386px] w-[280px] overflow-hidden rounded-[20px] transition-transform duration-500 ease-out lg:h-[439px] lg:w-[319px]"
              style={{
                zIndex: pose.z,
                backgroundColor: pose.tone,
                transform,
              }}
            >
              {src ? <img src={src} alt="" className="size-full object-cover" /> : null}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Next photo"
        onClick={() => show("next")}
        className="absolute right-0 z-40 hidden size-10 items-center justify-center rounded-lg bg-black/8 lg:flex"
      >
        <img
          src="/assets/images/team/chevron-left.svg"
          alt=""
          width={16}
          height={16}
          className="-scale-x-100"
        />
      </button>
    </div>
  );
}
