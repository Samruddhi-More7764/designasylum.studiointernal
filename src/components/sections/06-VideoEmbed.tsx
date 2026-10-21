"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Full-width video — Homepage / Rectangle 3 (1470 × 831).
 *
 * Defers loading the 30MB video stream until scrolled within 250px of the section.
 * Plays muted while the section is on screen; pauses when it leaves.
 *
 * Source: public/assets/videos/main.mp4 (Channel One film).
 * Poster: public/assets/images/video-poster.png.
 */
export function VideoEmbed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    video.muted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          if (video.paused) {
            void video.play().catch(() => {});
          }
        } else if (entry.intersectionRatio === 0) {
          video.pause();
        }
      },
      { rootMargin: "250px", threshold: [0, 0.01, 0.25] },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="dark"
      className="relative aspect-[1470/831] w-full overflow-hidden bg-black"
    >
      {!shouldLoad ? (
        <Image
          src="/assets/images/video-poster.png"
          alt=""
          fill
          sizes="(max-width: 1470px) 100vw, 1470px"
          className="object-cover"
        />
      ) : null}

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={shouldLoad ? "/assets/videos/main.mp4" : undefined}
        poster="/assets/images/video-poster.png"
        muted
        playsInline
        loop
        preload="none"
        aria-label="Channel One film"
      />
    </section>
  );
}
