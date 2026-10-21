"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function StudioPortrait({ src, isVideo }: { src: string; isVideo: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative flex aspect-[358/428] w-full items-center justify-center overflow-hidden rounded-3xl lg:aspect-auto lg:h-[832px]">
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 size-full object-cover"
          playsInline
          preload="none"
          controls={playing}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <Image src={src} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      )}
      {isVideo && !playing ? (
        <button
          type="button"
          aria-label="Play testimonial"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            void video.play();
            setPlaying(true);
          }}
          className="relative"
        >
          <Image src="/assets/images/studio/play.svg" alt="" width={96} height={96} className="size-24" />
        </button>
      ) : null}
      {!isVideo ? <Image src="/assets/images/studio/play.svg" alt="" width={96} height={96} className="relative size-24" /> : null}
    </div>
  );
}
