import Image from "next/image";
import { getCaseStudyPage } from "@/cms/content";

/**
 * Case study — full-bleed gallery: 4 stacked images, each 1350×759 with
 * 13.98px radius. Mirrors the hero image container's sizing/positioning.
 *
 * Desktop (lg+): unchanged stacked frames.
 * Mobile: same stacked structure — gutters/spacing only.
 * No carousel, scroll, or swipe behavior.
 */
export async function CaseStudyGallery() {
  const { gallery } = await getCaseStudyPage();
  return (
    <section className="bg-white">
      {gallery.map((image, i) => (
        <div
          key={image.src}
          className={`mx-auto w-full max-w-[1470px] px-5 sm:px-8 lg:px-[60px] ${
            i === gallery.length - 1
              ? "pb-10 sm:pb-12 lg:pb-16"
              : "pb-6 sm:pb-8 lg:pb-10"
          }`}
        >
          <div className="relative aspect-[1350/759] w-full overflow-hidden rounded-[13.98px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1350px, 100vw"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
