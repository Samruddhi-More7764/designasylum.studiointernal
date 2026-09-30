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
    (video && isVideoSrc(video) ? video : null) ||
    (image && isVideoSrc(image) ? image : null);
  const poster = image && !isVideoSrc(image) ? image : undefined;

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

  if (!poster) return null;

  if (isGifSrc(poster)) {
    return (
      // next/image freezes an animated GIF on the first frame.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={poster}
      alt={alt}
      fill
      priority={priority}
      className="object-cover"
      sizes={sizes}
    />
  );
}
