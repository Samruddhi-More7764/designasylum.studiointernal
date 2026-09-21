import Image from "next/image";
import Link from "next/link";
import { Accent } from "@/components/ui/SectionHeading";
import { PillButton } from "@/components/ui/PillButton";
import { CmsMediaFill } from "@/components/ui/CmsMediaFill";
import { ClientHubScroller } from "@/components/clients/ClientHubScroller";
import { getClientHub } from "@/cms/content";

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
 * Media tile for a hub section. When the section has a case study picked in
 * the CMS the tile becomes a link; otherwise it stays a plain visual.
 */
function StudyTile({
  href,
  label,
  className,
  children,
}: {
  href: string | null;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Link
      href={href}
      aria-label={`View case study: ${label}`}
      className={`${className} group cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05201F]`}
    >
      {children}
    </Link>
  );
}

/**
 * Client hub — section 2: sticky on-page scroller + content blocks.
 * Positions from Figma: scroller x=60, content x=476 (gap ≈120).
 *
 * Desktop (lg+): left rail sticky below the fixed navbar while the 7 Body
 * sections scroll. Hidden below lg. Partnership and later sections are
 * outside this sticky containing block (Figma).
 */
export async function ClientHubBody({ clientSlug = "sevenloop" }: { clientSlug?: string }) {
  const {
    navItems,
    about,
    logoDesign,
    websiteDesign,
    projectBrochure,
    brandVideo,
    behindTheScenes,
    caseStudy,
  } = await getClientHub(clientSlug);
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1438px] items-start gap-10 lg:gap-[120px]">
        <aside className="sticky top-[100px] hidden shrink-0 self-start lg:block">
          <ClientHubScroller items={navItems} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-12 sm:gap-14 lg:max-w-[933px] lg:gap-16">
          {/* About Client — 933 × 239, gap 16 */}
          <div id="about-client" className="flex scroll-mt-[100px] flex-col gap-4">
            <HubHeading
              italic={about.italic}
              rest={about.rest}
            />
            <p className="max-w-[929px] font-satoshi text-[15px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]">
              {about.body}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 sm:gap-4">
              <PillButton
                variant="dark"
                size="sm"
                href={about.websiteHref}
                className="min-w-[154px] border-black"
              >
                Visit Website
              </PillButton>
              {Array.from({ length: 4 }).map((_, i) => (
                <PillButton
                  key={i}
                  variant="outline"
                  size="sm"
                  href={about.websiteHref}
                  className="min-w-[154px] border-black"
                >
                  Visit Website
                </PillButton>
              ))}
            </div>
          </div>

          {/* Logo Design — desktop 3-col; mobile stacked full-width */}
          <div id="logo-design" className="flex scroll-mt-[100px] flex-col gap-5 lg:gap-6">
            <HubHeading
              italic={logoDesign.italic}
              rest={logoDesign.rest}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {logoDesign.images.map((image) => (
                <StudyTile
                  key={image.src}
                  href={logoDesign.href}
                  label={`${logoDesign.italic} ${logoDesign.rest}`}
                  className="relative aspect-[300/195] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 300px, 100vw"
                  />
                </StudyTile>
              ))}
            </div>
          </div>

          {/* Website Design & Development */}
          <div
            id="website-design"
            className="flex scroll-mt-[100px] flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={websiteDesign.italic}
              rest={websiteDesign.rest}
            />
            <StudyTile
              href={websiteDesign.href}
              label={`${websiteDesign.italic} ${websiteDesign.rest}`}
              className="relative aspect-[932/515] w-full overflow-hidden rounded-xl"
            >
              <Image
                src={websiteDesign.image.src}
                alt={websiteDesign.image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 932px, 100vw"
              />
            </StudyTile>
          </div>

          {/* Project Brochure — keep 2-col on mobile */}
          <div
            id="project-brochure"
            className="flex scroll-mt-[100px] flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={projectBrochure.italic}
              rest={projectBrochure.rest}
              italicPosition="last"
            />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {projectBrochure.images.map((image) => (
                <StudyTile
                  key={image.src}
                  href={projectBrochure.href}
                  label={`${projectBrochure.rest} ${projectBrochure.italic}`}
                  className="relative aspect-[458/515] w-full overflow-hidden rounded-xl"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 458px, 50vw"
                  />
                </StudyTile>
              ))}
            </div>
          </div>

          {/* Brand Video */}
          <div id="brand-video" className="flex scroll-mt-[100px] flex-col gap-5 lg:gap-6">
            <HubHeading
              italic={brandVideo.italic}
              rest={brandVideo.rest}
            />
            <StudyTile
              href={brandVideo.href}
              label={`${brandVideo.italic} ${brandVideo.rest}`}
              className="relative aspect-[932/515] w-full overflow-hidden rounded-xl"
            >
              <CmsMediaFill
                image={brandVideo.image.src}
                video={brandVideo.videoSrc}
                alt={brandVideo.image.alt}
                sizes="(min-width: 1024px) 932px, 100vw"
              />
            </StudyTile>
          </div>

          {/* Behind the Scenes — desktop 3-col; mobile stacked */}
          <div
            id="behind-the-scenes"
            className="flex scroll-mt-[100px] flex-col gap-5 lg:gap-6"
          >
            <HubHeading
              italic={behindTheScenes.italic}
              rest={behindTheScenes.rest}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {behindTheScenes.images.map((image, i) => (
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
          <div id="case-study" className="flex scroll-mt-[100px] flex-col gap-4">
            <HubHeading
              italic={caseStudy.italic}
              rest={caseStudy.rest}
              italicPosition="last"
            />
            <p className="max-w-[610px] font-satoshi text-[15px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]">
              {caseStudy.subheading}
            </p>
            <div className="pt-2">
              <PillButton
                variant="dark"
                size="sm"
                href={caseStudy.href}
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
