import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { faqItems as fallbackFaqItems, type FaqItem } from "@/data/faq";

/**
 * FAQ — Group 1707480273 / Homepage.png region.
 *
 * Questions with an answer expand on click. Items without answer copy stay
 * closed (no invented answers). First answered item starts open.
 *
 * Mobile: single column (intro + CTA above accordion).
 * Desktop (lg+): 2-col intro | accordion.
 */
export function FAQ({
  items,
  heading,
  showCta = true,
}: {
  items?: FaqItem[];
  heading?: ReactNode;
  showCta?: boolean;
}) {
  const sourceItems = items ?? fallbackFaqItems;
  const resolvedItems = sourceItems.filter((item) => Boolean(item?.question?.trim()));
  if (!resolvedItems || resolvedItems.length === 0) return null;

  const firstOpen = resolvedItems.findIndex((item) => Boolean(item.answer?.trim()));

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px]">
      <div className="mx-auto grid max-w-[1332px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-16 xl:gap-20">
        <div className="flex flex-col items-start gap-4 lg:gap-6">
          <SectionHeading className="max-w-[720px] font-figtree text-[32px] font-medium leading-[1.15] tracking-[-0.8px] text-ink break-words sm:text-[36px] lg:text-[40px]">
            {heading ?? (
              <>
                Common <Accent>questions</Accent>
              </>
            )}
          </SectionHeading>
          <p className="max-w-[420px] font-satoshi text-[15px] leading-[26px] text-muted">
            This is different we get that, you may have questions, here are
            some answers.
          </p>
          {showCta ? (
            <PillButton
              variant="dark"
              size="sm"
              href="/contact"
              className="h-[44px] w-full max-w-[327px] !px-[19.84px]"
            >
              Book a brand strategy session
            </PillButton>
          ) : null}
        </div>

        <div className="flex flex-col">
          {resolvedItems.map((item, i) => {
            const question = item.question.trim();
            const answer = item.answer?.trim();

            if (!answer) {
              return (
                <div
                  key={`${question}-${i}`}
                  className="flex items-start justify-between gap-4 border-b border-hairline py-5 text-left sm:gap-6"
                >
                  <span className="cursor-default font-figtree text-[15px] font-medium leading-[1.4] text-black break-words select-text sm:text-base lg:text-[18px]">
                    {question}
                  </span>
                </div>
              );
            }

            return (
              <details
                key={`${question}-${i}`}
                open={i === firstOpen}
                className="group border-b border-hairline"
              >
                <summary className="flex w-full cursor-pointer list-none items-start justify-between gap-4 py-5 text-left transition-colors hover:text-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 sm:gap-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-figtree text-[15px] font-medium leading-[1.4] text-black break-words sm:text-base lg:text-[18px]">
                    {question}
                  </span>
                  <ChevronDown
                    className="mt-1 h-4 w-4 shrink-0 text-black transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pb-5 font-satoshi text-sm leading-relaxed text-muted break-words whitespace-pre-line sm:text-base">
                  {answer}
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
