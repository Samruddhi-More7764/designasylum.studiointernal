"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InViewVideo } from "@/components/ui/InViewVideo";
import { isGifSrc, isVideoSrc } from "@/cms/media";

type CmsMediaFillProps = {
  image?: string | null;
  video?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

const DEFAULT_FALLBACK = "/assets/images/client-hub/case-study-hero.jpg";

/**
 * Renders a video with a still poster, or a still image. Never passes an
 * MP4 into next/image (that 400s with "isn't a valid image").
 */
export function CmsMediaFill({
  image,
  video,
  alt,
  sizes,
  priority = false,
}: CmsMediaFillProps) {
  const videoSrc =
    (video && typeof video === "string" && isVideoSrc(video) && video.trim() ? video.trim() : null) ||
    (image && typeof image === "string" && isVideoSrc(image) && image.trim() ? image.trim() : null);
  const poster =
    image && typeof image === "string" && !isVideoSrc(image) && image.trim()
      ? image.trim()
      : undefined;
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [poster, videoSrc]);

  if (videoSrc) {
    return (
      <InViewVideo
        src={videoSrc}
        poster={poster}
        label={alt}
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  const effectiveSrc = hasError ? DEFAULT_FALLBACK : (poster || null);
  if (!effectiveSrc || typeof effectiveSrc !== "string" || !effectiveSrc.trim()) return null;
  const cleanPoster = effectiveSrc.trim();
  if (!cleanPoster.startsWith("/")) {
    try {
      const parsed = new URL(cleanPoster);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    } catch {
      try {
        const parsed = new URL(encodeURI(cleanPoster));
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
      } catch {
        return null;
      }
    }
  }

  if (isGifSrc(cleanPoster)) {
    return (
      // next/image freezes an animated GIF on the first frame.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={cleanPoster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
        }}
      />
    );
  }

  return (
    <Image
      src={cleanPoster}
      alt={alt}
      fill
      priority={priority}
      className="object-cover"
      sizes={sizes}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}
