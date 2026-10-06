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
  items = fallbackFaqItems,
  heading,
  showCta = true,
}: {
  items?: FaqItem[];
  heading?: ReactNode;
  showCta?: boolean;
}) {
  const firstOpen = items.findIndex((item) => Boolean(item.answer?.trim()));

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px]">
      <div className="mx-auto grid max-w-[1332px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,655px)_1fr] lg:gap-16">
        <div className="flex flex-col items-start gap-4 lg:gap-6">
          <SectionHeading className="max-w-[720px] text-[32px] font-medium leading-[1.15] tracking-[-0.8px] text-ink sm:text-[36px] lg:h-[44px] lg:w-[655px] lg:text-[40px] lg:leading-[44px] lg:whitespace-nowrap">
            {heading ?? (
              <>
                Common <Accent>questions</Accent>
              </>
            )}
          </SectionHeading>
          <p className="max-w-[420px] font-satoshi text-[15px] leading-[26px] text-muted lg:h-[52px] lg:w-[420px]">
            This is different we get that, you may have questions, here are
            some answers.
          </p>
          {showCta ? (
            <PillButton
              variant="dark"
              size="sm"
              href="/#talk"
              className="h-[44px] w-full max-w-[327px] !px-[19.84px]"
            >
              Book a brand strategy session
            </PillButton>
          ) : null}
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => {
            const answer = item.answer?.trim();

            if (!answer) {
              return (
                <div
                  key={`${item.question}-${i}`}
                  className="flex items-center justify-between gap-6 border-b border-hairline py-5"
                >
                  <span className="font-figtree text-[15px] font-medium text-black sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-black/40"
                    aria-hidden="true"
                  />
                </div>
              );
            }

            return (
              <details
                key={`${item.question}-${i}`}
                open={i === firstOpen}
                className="group border-b border-hairline"
              >
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="font-figtree text-[15px] font-medium text-black sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-black transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 font-satoshi text-sm leading-relaxed text-muted">
                  {answer}
                </p>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
