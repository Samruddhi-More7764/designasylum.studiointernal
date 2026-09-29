"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";

function captionFromAlt(alt: string): { name: string; role?: string } {
  const cleaned = alt.replace(/\s*[—–-]\s*video testimonial\s*$/i, "").trim();
  const splitAt = cleaned.indexOf(",");
  if (splitAt === -1) return { name: cleaned };
  const name = cleaned.slice(0, splitAt).trim();
  const role = cleaned.slice(splitAt + 1).trim();
  if (!name) return { name: cleaned };
  return { name, role: role || undefined };
}

/**
 * Still posters ship with a painted name and play icon. Scale-and-clip
 * those corners, then draw the name as HTML. A real play control is added
 * only when the card has a video, and it starts on click.
 */
export function TestimonialCard({
  item,
  featured = false,
}: {
  item: Testimonial;
  featured?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const caption = captionFromAlt(item.alt);
  const hasVideo = Boolean(item.video);
  const expanded = hasVideo && playing;

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      return;
    }
    video.pause();
  }

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col gap-2">
      <div
        className={[
          "relative w-full overflow-hidden rounded-2xl",
          expanded || featured ? "h-[388px]" : "h-[384px]",
        ].join(" ")}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover ${playing ? "z-0" : "invisible"}`}
            src={item.video}
            playsInline
            preload="metadata"
            aria-label={item.alt}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        ) : null}

        {!playing && item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            className="scale-[1.22] object-cover"
            sizes="320px"
          />
        ) : null}

        {hasVideo ? (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause testimonial" : "Play testimonial"}
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white"
          >
            {playing ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        ) : null}

        {!expanded && caption.name ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/85 to-transparent px-4 pt-16 pb-3.5">
            <p className="font-satoshi text-[13px] font-medium leading-tight text-white">
              {caption.name}
            </p>
            {caption.role ? (
              <p className="mt-0.5 font-satoshi text-[11px] leading-tight text-white/90">
                {caption.role}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {item.quote ? (
        <p className="rounded-2xl border border-hairline bg-white px-5 py-4 text-center font-satoshi text-sm leading-relaxed text-muted lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-left">
          {item.quote}
        </p>
      ) : null}
    </div>
  );
}
