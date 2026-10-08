"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Accent } from "@/components/ui/SectionHeading";
import Image from "next/image";
import { lifeOutside } from "@/data/whyDesignAsylumPage";

export function LifeOutside({
  titleBefore = lifeOutside.titleBefore,
  titleAccent = lifeOutside.titleAccent,
  titleAfter = lifeOutside.titleAfter,
  dek = lifeOutside.dek,
  slides = [] as string[],
}: {
  titleBefore?: string;
  titleAccent?: string;
  titleAfter?: string;
  dek?: string;
  slides?: string[];
} = {}) {
  const scroller = useRef<HTMLUListElement>(null);

  function scrollByCard(direction: number) {
    const node = scroller.current;
    const card = node?.querySelector("li");
    if (!node || !card) return;
    const gap = 16;
    node.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-white px-5 pt-16 sm:px-8 lg:px-[60px] lg:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1350px] flex-col items-center gap-3 text-center lg:gap-8">
        <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-[44px] lg:leading-none lg:tracking-[-2.09px]">
          {titleBefore}
          <Accent className="text-[32px] tracking-[-2.09px] lg:text-[44px]">{titleAccent}</Accent>
          {titleAfter}
        </h2>
        <p className="max-w-[578px] font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.1px] text-black/80 lg:text-[20px]">
          {dek}
        </p>
      </div>

      <ul
        ref={scroller}
        className="mx-auto mt-8 flex w-full max-w-[1350px] snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-12 lg:justify-center lg:gap-4 lg:overflow-x-auto [&::-webkit-scrollbar]:hidden"
      >
        {(slides.length ? slides : Array.from({ length: lifeOutside.slides }, () => "")).map(
          (src, index) => (
            <li
              key={src || index}
              className="relative aspect-[326/335] w-[min(326px,82vw)] shrink-0 snap-start overflow-hidden rounded-[11px] bg-[#d9d9d9] lg:aspect-auto lg:h-[377px] lg:w-[366px] lg:rounded-xl"
            >
              {src ? (
                <Image src={src} alt="" fill sizes="366px" className="object-cover" />
              ) : null}
            </li>
          ),
        )}
      </ul>

      <div className="mt-6 hidden items-center justify-center gap-3 lg:flex">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          className="flex size-10 items-center justify-center rounded-lg bg-black/8 text-black"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          className="flex size-10 items-center justify-center rounded-lg bg-black/8 text-black"
        >
          <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
