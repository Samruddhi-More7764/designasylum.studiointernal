import { sevenloopCaseStudyDetails } from "@/data/caseStudyPage";
import { CaseStudyQuoteIcon } from "@/components/ui/CaseStudyQuoteIcon";

/**
 * Case study — second section: pull-quote beside a "Details" fact table.
 * Figma: outer container 1350×315 at top 1209/left 60. Text column 599×291
 * (gap 45), table column 646×315 (gap 25, 24px side padding).
 *
 * Desktop (lg+): side-by-side. Mobile: quote → icon → details stack.
 */
export function CaseStudyDetails() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 sm:py-12 lg:px-[60px] lg:py-16">
      <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
        <div className="flex max-w-[599px] flex-col gap-5 sm:gap-6">
          <p className="font-figtree text-[24px] leading-[120%] font-normal tracking-[-1px] text-black sm:text-[32px] sm:tracking-[-2px] lg:text-[40px] lg:tracking-[-3px]">
            {sevenloopCaseStudyDetails.quote}
          </p>
          <CaseStudyQuoteIcon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]" />
        </div>

        <div className="flex w-full max-w-[646px] flex-col gap-5 px-0 sm:gap-6 sm:px-4 lg:px-6">
          <h2 className="font-satoshi text-[14px] font-medium leading-5 text-[#12110D]">
            {sevenloopCaseStudyDetails.tableHeading}
          </h2>

          <dl className="flex flex-col">
            {sevenloopCaseStudyDetails.rows.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-baseline justify-between gap-4 py-3 font-satoshi text-[13px] leading-5 sm:gap-6 sm:text-[14px] ${
                  i > 0 ? "border-t border-[#12110D]/10" : ""
                }`}
              >
                <dt className="shrink-0 font-medium text-[#12110D]/40 capitalize">
                  {row.label}
                </dt>
                <dd className="text-right font-medium text-[#12110D]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
