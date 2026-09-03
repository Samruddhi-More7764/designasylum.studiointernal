"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { faqItems } from "@/data/faq";

/**
 * FAQ — Group 1707480273 / Homepage.png region.
 *
 * First item expanded by default. Items without answer copy stay collapsed
 * (no invented answers).
 *
 * Mobile: single column (intro + CTA above accordion).
 * Desktop (lg+): 2-col intro | accordion.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px]">
      <div className="mx-auto grid max-w-[1332px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <SectionHeading className="text-[32px] font-medium tracking-[-0.8px] text-ink sm:text-[40px] lg:text-[48px] lg:tracking-[-1px]">
            Common <Accent>questions</Accent>
          </SectionHeading>
          <p className="max-w-[280px] font-satoshi text-[15px] leading-relaxed text-muted sm:text-base">
            This is different we get that, you may have questions, here are
            some answers.
          </p>
          <PillButton variant="dark" size="lg" className="w-full max-w-[318px]">
            Book a brand strategy session
          </PillButton>
        </div>

        <div className="flex flex-col">
          {faqItems.map((item, i) => {
            const isOpen = openIndex === i && Boolean(item.answer);
            const canToggle = Boolean(item.answer);

            return (
              <div key={item.question} className="border-b border-hairline">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                  disabled={!canToggle}
                  onClick={() => {
                    if (!canToggle) return;
                    setOpenIndex(isOpen ? -1 : i);
                  }}
                >
                  <span className="font-figtree text-[15px] font-medium text-black sm:text-base">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-black transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    {item.answer ? (
                      <p className="pb-5 font-satoshi text-sm leading-relaxed text-muted">
                        {item.answer}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
