"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Testimonial } from "@/data/testimonials";

/** Figma node 738:3969 — 32px play control, black at 30% with a white triangle. */
function TestimonialPlayIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="16" fill="black" fillOpacity="0.3" />
      <path
        d="M14.8313 9.3465C13.1327 8.36806 11 9.57802 11 11.5208V19.4792C11 21.422 13.1327 22.6319 14.8313 21.6535L21.7367 17.6733C23.4211 16.7029 23.4211 14.2971 21.7367 13.3267L14.8313 9.3465Z"
        fill="white"
      />
    </svg>
  );
}

/** Same 32px circle as the play control. Photos keep these outward corners while open or closed. */
function TestimonialExpandIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="16" fill="black" fillOpacity="0.3" />
      <path
        d="M14 9.5H9.5V14M18 9.5h4.5V14M22.5 18v4.5H18M9.5 18v4.5H14"
        stroke="white"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Figma node 738:3979 — pause control, 32px slot with the 34px ring overflowing it. */
function TestimonialPauseIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="17" cy="17" r="16" fill="black" fillOpacity="0.3" />
      <circle cx="17" cy="17" r="16.5" stroke="white" strokeOpacity="0.3" />
      <path
        d="M29.5405 27.7231C31.571 25.3485 32.8856 22.4462 33.3313 19.3537C33.777 16.2613 33.3355 13.1059 32.0582 10.2545C30.7809 7.40317 28.7203 4.97307 26.116 3.24689C23.5118 1.52071 20.471 0.569416 17.3473 0.503655"
        stroke="white"
        strokeLinecap="round"
      />
      <path
        d="M13.2859 24C14.3073 24 15.143 23.1643 15.143 22.1429V12.8571C15.143 11.8357 14.3073 11 13.2859 11C12.2644 11 11.4287 11.8357 11.4287 12.8571V22.1429C11.4287 23.1643 12.2644 24 13.2859 24ZM18.8573 12.8571V22.1429C18.8573 23.1643 19.693 24 20.7144 24C21.7359 24 22.5716 23.1643 22.5716 22.1429V12.8571C22.5716 11.8357 21.7359 11 20.7144 11C19.693 11 18.8573 11.8357 18.8573 12.8571Z"
        fill="white"
      />
    </svg>
  );
}

function overlayText(item: Testimonial): { name: string; designation?: string } {
  const cleaned = item.alt.replace(/\s*[—–-]\s*video testimonial\s*$/i, "").trim();
  const comma = cleaned.indexOf(",");
  const name = comma === -1 ? cleaned : cleaned.slice(0, comma).trim() || cleaned;
  const fromAlt = comma === -1 ? undefined : cleaned.slice(comma + 1).trim() || undefined;
  const designation = item.designation?.trim() || fromAlt;
  return { name, designation };
}

/**
 * Photos show an expand control. Videos show the Figma play and pause
 * controls, and those start and stop the video. Opening a card hides the caption.
 */
export function TestimonialCard({ item }: { item: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const caption = overlayText(item);
  const hasVideo = Boolean(item.video);

  function onOpen() {
    if (!hasVideo) {
      setExpanded((open) => !open);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      if (video.ended) video.currentTime = 0;
      setExpanded(true);
      setPlaying(true);
      void video.play().catch(() => setPlaying(false));
      return;
    }

    video.pause();
    setPlaying(false);
    setExpanded(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-[320px] flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          onOpen();
        }}
        aria-pressed={expanded}
        className={[
          "relative w-full cursor-pointer overflow-hidden rounded-[12px] text-left",
          expanded ? "h-[388px]" : "h-[280px]",
        ].join(" ")}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            src={item.video}
            poster={item.image || undefined}
            playsInline
            preload="metadata"
            aria-label={item.alt}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              setPlaying(false);
              setExpanded(false);
            }}
          />
        ) : null}

        {!playing && item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            className="z-10 object-cover object-center"
            sizes="(min-width: 1024px) 291px, 100vw"
          />
        ) : null}

        <span className="pointer-events-none absolute top-3 right-3 z-20 size-8">
          {hasVideo ? (
            playing ? (
              <span className="absolute inset-[-3.13%]">
                <TestimonialPauseIcon />
              </span>
            ) : (
              <TestimonialPlayIcon />
            )
          ) : (
            <TestimonialExpandIcon />
          )}
        </span>

        {caption.name ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black from-35% via-black/95 to-transparent px-4 pt-16 pb-4">
            <p className="font-satoshi text-[16px] font-medium leading-[19px] whitespace-nowrap text-white">
              {caption.name}
            </p>
            {caption.designation ? (
              <p className="font-satoshi text-[12px] font-medium leading-[14px] whitespace-nowrap text-white">
                {caption.designation}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      {item.quote && !expanded ? (
        <div className="flex h-[96px] w-full flex-col gap-[10px] overflow-hidden rounded-[12px] border border-[#0000004D] p-[10px]">
          <p className="font-satoshi text-sm leading-relaxed text-black">{item.quote}</p>
        </div>
      ) : null}
    </div>
  );
}
