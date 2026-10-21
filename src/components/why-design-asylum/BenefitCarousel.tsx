"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { activeSnapIndex, scrollToSnap, ScrollDots } from "@/components/ui/ScrollDots";

export function BenefitCarousel({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  return (
    <div className="min-w-0">
      <ul
        ref={scroller}
        onScroll={() => {
          if (scroller.current) setActive(activeSnapIndex(scroller.current));
        }}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <li
            key={item.title}
            className="w-[280px] shrink-0 snap-start border-l border-black/30 px-4 lg:w-auto"
            style={{ gridColumn: index % 2 === 0 ? 1 : 2, gridRow: index + 1 }}
          >
            <article className="flex flex-col gap-[73px] py-2 lg:gap-16 lg:py-6">
              <Image
                src="/assets/images/why-design-asylum/benefit-icon.svg"
                alt=""
                width={64}
                height={64}
                className="size-12 lg:size-16"
              />
              <div className="flex flex-col gap-3">
                <h3 className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.5px] text-[#1f1f1f] lg:text-[32px]">
                  {item.title}
                </h3>
                <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.08px] text-[#1f1f1f] lg:text-[20px] lg:leading-[24px]">
                  {item.body}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <ScrollDots
        count={items.length}
        active={active}
        onSelect={(index) => {
          if (scroller.current) scrollToSnap(scroller.current, index);
        }}
        className="mt-4 lg:hidden"
      />
    </div>
  );
}
