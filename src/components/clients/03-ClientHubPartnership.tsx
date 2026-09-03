import { Accent } from "@/components/ui/SectionHeading";
import { PartnershipIcon } from "@/components/ui/PartnershipIcon";
import { sevenloopPartnership } from "@/data/clientHub";

/**
 * Client hub — section after Case Study: black story card (eyebrow +
 * heading + decorative vector) beside the long-form partnership copy.
 * Not part of the sticky scroller's nav list — Figma treats this as a
 * standalone two-column block, not another on-page-nav destination.
 *
 * Desktop (lg+): side-by-side. Mobile: stacked card then paragraphs.
 */
export function ClientHubPartnership() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-start gap-10 sm:gap-12 lg:flex-row lg:gap-16">
        <div
          className="relative w-full max-w-[703px] shrink-0 overflow-hidden rounded-[10px] bg-black"
          style={{ aspectRatio: "703 / 712.72" }}
        >
          <PartnershipIcon
            className="absolute text-[#1D1D1D]"
            style={{
              width: "74.46%",
              height: "60.06%",
              top: "39.41%",
              left: "0.22%",
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-2 p-5 pt-8 sm:p-7 sm:pt-[39px]">
            <span className="font-satoshi text-[12px] font-normal leading-[19.6px] tracking-[-0.5px] text-white uppercase sm:text-[14px]">
              {sevenloopPartnership.label}
            </span>
            <h3 className="max-w-[500px] font-figtree text-[28px] leading-none font-normal tracking-[-1px] text-white sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]">
              {sevenloopPartnership.heading}{" "}
              <Accent>{sevenloopPartnership.headingAccent}</Accent>
            </h3>
          </div>
        </div>

        <div className="flex w-full min-w-0 max-w-[700px] flex-1 flex-col gap-5 sm:min-w-[300px] sm:gap-6">
          {sevenloopPartnership.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="font-satoshi text-[15px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
