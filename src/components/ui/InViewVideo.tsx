"use client";

import { useEffect, useRef } from "react";

type InViewVideoProps = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
};

/**
 * Muted looping video that plays while on screen and pauses when it
 * fully leaves — same behaviour as the homepage film.
 */
export function InViewVideo({ src, poster, label, className = "" }: InViewVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    video.muted = true;
    void video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.paused) void video.play().catch(() => {});
        } else if (entry.intersectionRatio === 0) {
          video.pause();
        }
      },
      { threshold: [0, 0.01, 0.25] },
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster && !poster.match(/\.(mp4|webm|mov|m4v)(\?|$)/i) ? poster : undefined}
        muted
        autoPlay
        playsInline
        loop
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}
