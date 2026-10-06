import {
  articleSections,
  introduction,
  tocItems,
  type ArticleSection,
  type TocItem,
} from "@/data/brandingAgencyPage";
import {
  EditorialHeading,
  EditorialParagraph,
  HighlightBox,
  PointerList,
} from "@/components/branding-agency/editorial";
import { StickyTableOfContents } from "@/components/branding-agency/StickyTableOfContents";

export function BrandingAgencyArticle({
  lead = introduction,
  preface = [],
  sections = articleSections,
  toc = tocItems,
  spacing = "logos",
}: {
  lead?: string;
  preface?: string[];
  sections?: ArticleSection[];
  toc?: TocItem[];
  /**
   * logos: gap down to the logo band (service and industry pages).
   * cta: gap down to the blue CTA (location page). Desktop padding is
   * transparent so the artwork can fade up through it.
   */
  spacing?: "logos" | "cta";
} = {}) {
  return (
    <section
      className={
        spacing === "cta"
          ? "bg-transparent px-5 pb-0 sm:px-8 lg:px-[60px] lg:pb-[150px]"
          : "bg-white px-5 pb-[120px] sm:px-8 lg:px-[60px] lg:pb-[200px]"
      }
    >
      <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[72px]">
        <StickyTableOfContents items={toc} />

        <div className="flex min-w-0 flex-1 flex-col gap-12 lg:max-w-[931px] lg:gap-16">
          <p className="max-w-[931px] font-figtree text-[22px] font-normal leading-[1.2] tracking-[-1px] text-[#05201F] sm:text-[28px] lg:text-[32px] lg:tracking-[-2.09px]">
            {lead}
          </p>
          {preface.length > 0 ? (
            <div className="flex flex-col gap-6">
              {preface.map((paragraph) => (
                <EditorialParagraph key={paragraph}>{paragraph}</EditorialParagraph>
              ))}
            </div>
          ) : null}

          {sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="flex scroll-mt-[100px] flex-col gap-4"
            >
              <EditorialHeading
                before={section.before}
                accent={section.accent}
                after={section.after}
              />
              {section.paragraphs.map((paragraph) => (
                <EditorialParagraph key={paragraph}>{paragraph}</EditorialParagraph>
              ))}
              {section.pointers ? <PointerList items={section.pointers} /> : null}
              {section.blocks?.map((block) => (
                <div key={block.title} className="flex flex-col gap-2">
                  <p className="font-satoshi text-[20px] font-medium leading-[1.3] tracking-[-0.5px] text-black lg:text-[24px]">
                    {block.title}
                  </p>
                  {block.paragraphs.map((paragraph) => (
                    <EditorialParagraph key={paragraph}>{paragraph}</EditorialParagraph>
                  ))}
                </div>
              ))}
              {section.highlight ? (
                <HighlightBox
                  title={section.highlight.title}
                  body={section.highlight.body}
                />
              ) : null}
              {section.closing?.map((paragraph) => (
                <EditorialParagraph key={paragraph}>{paragraph}</EditorialParagraph>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
