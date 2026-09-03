"use client";

import { useEffect, useRef } from "react";

/**
 * Full-width video — Homepage / Rectangle 3 (1470 × 831).
 *
 * Plays muted while the section is on screen; pauses only when it fully
 * leaves. Does NOT rewind on re-entry (avoids cutting playback short when
 * IntersectionObserver flickers during scroll).
 *
 * Source: public/assets/videos/main.mp4 (Channel One film).
 * Poster: public/assets/images/video-poster.png.
 */
export function VideoEmbed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.muted = true;
    void video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.paused) {
            void video.play().catch(() => {});
          }
        } else if (entry.intersectionRatio === 0) {
          video.pause();
        }
      },
      { threshold: [0, 0.01, 0.25] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative aspect-[1470/831] w-full bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/videos/main.mp4"
        poster="/assets/images/video-poster.png"
        muted
        autoPlay
        playsInline
        loop
        preload="auto"
        aria-label="Channel One film"
      />
    </section>
  );
}
