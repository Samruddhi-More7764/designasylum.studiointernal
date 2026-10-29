"use client";

import { useEffect, useRef, useState } from "react";

type InViewVideoProps = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  autoFit?: boolean;
};

/**
 * Muted looping video that only buffers and plays when scrolled near or into view.
 */
export function InViewVideo({
  src,
  poster,
  label,
  className = "",
  autoFit = false,
}: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (video.paused) void video.play().catch(() => {});
        } else if (entry.intersectionRatio === 0) {
          video.pause();
        }
      },
      { rootMargin: "250px", threshold: [0, 0.01, 0.25] },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden bg-transparent ${className}`}>
      <video
        ref={videoRef}
        className={
          autoFit
            ? "block h-auto w-full [transform:translateZ(0)] [backface-visibility:hidden] [isolation:isolate]"
            : "absolute inset-0 h-full w-full object-cover [transform:translateZ(0)] [backface-visibility:hidden] [isolation:isolate]"
        }
        src={inView ? src : undefined}
        poster={poster && !poster.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? poster : undefined}
        muted
        playsInline
        loop
        preload={autoFit ? "metadata" : "none"}
        aria-label={label}
      />
    </div>
  );
}
