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
export function TestimonialCard({ item }: { item: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const caption = captionFromAlt(item.alt);
  const hasVideo = Boolean(item.video);

  function onOpen() {
    const next = !expanded;
    setExpanded(next);
    if (!hasVideo) return;
    if (next) {
      void videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        onClick={onOpen}
        aria-pressed={expanded}
        className={[
          "relative w-full overflow-hidden rounded-2xl text-left",
          expanded ? "h-[360px]" : "h-[240px]",
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
            className="origin-top scale-[1.28] object-cover object-top"
            sizes="(min-width: 1024px) 291px, 100vw"
          />
        ) : null}

        {hasVideo ? (
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white"
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </span>
        ) : null}

        {caption.name ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black from-35% via-black/95 to-transparent px-4 pt-16 pb-4">
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
      </button>

      {item.quote && !expanded ? (
        <p className="rounded-2xl border border-hairline bg-white px-5 py-4 text-center font-satoshi text-sm leading-relaxed text-muted lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-left">
          {item.quote}
        </p>
      ) : null}
    </div>
  );
}
