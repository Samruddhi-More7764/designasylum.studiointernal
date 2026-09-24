import { CmsMediaFill } from "@/components/ui/CmsMediaFill";
import { isVideoSrc } from "@/cms/media";

/** Hero and gallery frame. A video file plays; a photo stays a still. */
export function CaseStudyMedia({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const video = isVideoSrc(src);
  return (
    <CmsMediaFill
      image={video ? null : src}
      video={video ? src : null}
      alt={alt}
      sizes="(min-width: 1024px) 1350px, 100vw"
      priority={priority && !video}
    />
  );
}
