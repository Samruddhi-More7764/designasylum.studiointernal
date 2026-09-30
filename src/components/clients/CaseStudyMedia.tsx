import { CmsMediaFill } from "@/components/ui/CmsMediaFill";
import { isVideoSrc } from "@/cms/media";
import type { CaseStudyMediaFrame } from "@/data/caseStudyPage";

/** One photo, GIF, or video filling its cell. */
export function CaseStudyMedia({
  src,
  alt,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  if (!src) return null;
  const video = isVideoSrc(src);
  return (
    <CmsMediaFill
      image={video ? null : src}
      video={video ? src : null}
      alt={alt}
      sizes={sizes}
      priority={priority && !video}
    />
  );
}

const cell =
  "relative w-full overflow-hidden rounded-[13.98px] bg-neutral-100";

/**
 * Desktop frame is 1316×740, shifted up 19px and left 2px.
 * Complete fills that frame. Two columns are 648×702 with 16px between them.
 */
export function CaseStudyMediaFrame({
  frame,
  priority = false,
}: {
  frame: CaseStudyMediaFrame;
  priority?: boolean;
}) {
  const shell = "w-full lg:-mt-[19px] lg:-ml-[2px] lg:w-[1316px]";

  if (frame.layout === "split") {
    return (
      <div className={shell}>
        <div className="flex w-full flex-col gap-4 lg:h-[740px] lg:flex-row lg:items-center lg:justify-center lg:gap-[16px]">
          {[frame.left, frame.right].map((side, index) => (
            <div
              key={index}
              className={`${cell} aspect-[648/702] lg:h-[702px] lg:w-[648px] lg:shrink-0`}
            >
              {side ? (
                <CaseStudyMedia
                  src={side.src}
                  alt={side.alt}
                  sizes="(min-width: 1024px) 648px, 100vw"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={shell}>
      <div className={`${cell} aspect-[1316/740] lg:h-[740px]`}>
        <CaseStudyMedia
          src={frame.image.src}
          alt={frame.image.alt}
          priority={priority}
          sizes="(min-width: 1024px) 1316px, 100vw"
        />
      </div>
    </div>
  );
}
