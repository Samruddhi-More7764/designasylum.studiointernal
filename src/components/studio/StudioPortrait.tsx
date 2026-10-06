"use client";

import { useRef, useState } from "react";

export function StudioPortrait({ src, isVideo }: { src: string; isVideo: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl lg:h-[832px]">
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 size-full object-cover"
          playsInline
          controls={playing}
          onEnded={() => setPlaying(false)}
        />
      ) : (
        <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
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
          <img src="/assets/images/studio/play.svg" alt="" className="size-24" />
        </button>
      ) : null}
      {!isVideo ? <img src="/assets/images/studio/play.svg" alt="" className="relative size-24" /> : null}
    </div>
  );
}
