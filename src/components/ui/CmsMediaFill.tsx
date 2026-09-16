import Image from "next/image";
import { InViewVideo } from "@/components/ui/InViewVideo";
import { isVideoSrc } from "@/cms/media";

type CmsMediaFillProps = {
  image?: string | null;
  video?: string | null;
  alt: string;
  sizes: string;
};

/**
 * Renders a video with a still poster, or a still image. Never passes an
 * MP4 into next/image (that 400s with "isn't a valid image").
 */
export function CmsMediaFill({ image, video, alt, sizes }: CmsMediaFillProps) {
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

  return (
    <Image src={poster} alt={alt} fill className="object-cover" sizes={sizes} />
  );
}
