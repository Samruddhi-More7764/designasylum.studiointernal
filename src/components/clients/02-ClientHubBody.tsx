import Image from "next/image";
import { Accent } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";
import { ClientHubScroller } from "@/components/clients/ClientHubScroller";
import {
  sevenloopAbout,
  sevenloopLogoDesign,
  sevenloopWebsiteDesign,
  sevenloopProjectBrochure,
  sevenloopBrandVideo,
  sevenloopBehindTheScenes,
  sevenloopCaseStudy,
} from "@/data/clientHub";

function HubHeading({
  italic,
  rest,
  italicPosition = "first",
}: {
  italic: string;
  rest: string;
  /** Figma varies which word gets the Playfair italic treatment. */
  italicPosition?: "first" | "last";
}) {
  // Desktop: Playfair italic 44 / -2.09 / 62.6. Mobile: scaled type.
  return (
    <h2 className="font-figtree text-[28px] font-normal leading-[1.2] tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
      {italicPosition === "first" ? (
        <>
          <Accent>{italic}</Accent> {rest}
        </>
      ) : (
        <>
          {rest} <Accent>{italic}</Accent>
        </>
      )}
    </h2>
  );
}

/**
 * Client hub — section 2: sticky on-page scroller + content blocks.
 * Positions from Figma: scroller x=60, content x=476 (gap ≈120).
 *
 * Desktop (lg+): unchanged. Mobile: gutters, type, Logo/BTS stack.
 */
export function ClientHubBody() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1438px] items-start gap-10 lg:gap-[120px]">
        <aside className="sticky top-28 hidden shrink-0 lg:block">
          <ClientHubScroller />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-12 sm:gap-14 lg:max-w-[933px] lg:gap-16">
          {/* About Client — 933 × 239, gap 16 */}
          <div id="about-client" className="flex scroll-mt-32 flex-col gap-4">
            <HubHeading
              italic={sevenloopAbout.italic}
              rest={sevenloopAbout.rest}
            />
            <p className="max-w-[929px] font-satoshi text-[15px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]">
              {sevenloopAbout.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
              <PillButton
                variant="dark"
                size="sm"
                href={sevenloopAbout.websiteHref}
                className="min-w-[154px] border-black"
              >
                Visit Website
              </PillButton>
              {Array.from({ length: 4 }).map((_, i) => (
                <PillButton
                  key={i}
                  variant="outline"
                  size="sm"
                  href={sevenloopAbout.websiteHref}
                  className="min-w-[154px] border-black"
                >
                  Visit Website
                </PillButton>
              ))}
            </div>
          </div>

          {/* Logo Design — desktop 3-col; mobile stacked full-width */}
          <div id="logo-design" className="flex scroll-mt-32 flex-col gap-5 lg:gap-6">
            <HubHeading
              italic={sevenloopLogoDesign.italic}
              rest={sevenloopLogoDesign.rest}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {sevenloopLogoDesign.images.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[300/195] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 300px, 100vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Website Design & Development */}
          <div
            id="website-design"
            className="flex scroll-mt-32 flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={sevenloopWebsiteDesign.italic}
              rest={sevenloopWebsiteDesign.rest}
            />
            <div className="relative aspect-[932/515] w-full overflow-hidden rounded-xl">
              <Image
                src={sevenloopWebsiteDesign.image.src}
                alt={sevenloopWebsiteDesign.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 932px, 100vw"
              />
            </div>
          </div>

          {/* Project Brochure — keep 2-col on mobile */}
          <div
            id="project-brochure"
            className="flex scroll-mt-32 flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={sevenloopProjectBrochure.italic}
              rest={sevenloopProjectBrochure.rest}
              italicPosition="last"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {sevenloopProjectBrochure.images.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-[458/515] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 458px, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Brand Video */}
          <div id="brand-video" className="flex scroll-mt-32 flex-col gap-5 lg:gap-6">
            <HubHeading
              italic={sevenloopBrandVideo.italic}
              rest={sevenloopBrandVideo.rest}
            />
            <div className="relative aspect-[932/515] w-full overflow-hidden rounded-xl">
              <Image
                src={sevenloopBrandVideo.image.src}
                alt={sevenloopBrandVideo.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 932px, 100vw"
              />
            </div>
          </div>

          {/* Behind the Scenes — desktop 3-col; mobile stacked */}
          <div
            id="behind-the-scenes"
            className="flex scroll-mt-32 flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={sevenloopBehindTheScenes.italic}
              rest={sevenloopBehindTheScenes.rest}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {sevenloopBehindTheScenes.images.map((image, i) => (
                <div
                  key={`${image.src}-${i}`}
                  className="relative aspect-[299/358] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 299px, 100vw"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Case Study — heading + subheading + CTA */}
          <div id="case-study" className="flex scroll-mt-32 flex-col gap-4">
            <HubHeading
              italic={sevenloopCaseStudy.italic}
              rest={sevenloopCaseStudy.rest}
              italicPosition="last"
            />
            <p className="max-w-[610px] font-satoshi text-[15px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]">
              {sevenloopCaseStudy.subheading}
            </p>
            <div className="pt-2">
              <PillButton
                variant="dark"
                size="sm"
                href={sevenloopCaseStudy.href}
                className="min-w-[177px] border-black"
              >
                View Case Study
              </PillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
