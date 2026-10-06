"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { tocItems, type TocItem } from "@/data/brandingAgencyPage";

const STICKY_OFFSET = 100;

export function StickyTableOfContents({ items = tocItems }: { items?: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const idKey = items.map((item) => item.id).join("|");

  useEffect(() => {
    const ids = idKey.split("|").filter(Boolean);
    let frame = 0;

    function update() {
      const line = STICKY_OFFSET + 24;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top <= line) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    }

    function onScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [idKey]);

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    setActive(id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    detailsRef.current?.removeAttribute("open");
  }

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === active),
  );
  const maxIndex = Math.max(items.length - 1, 1);

  return (
    <>
      <details
        ref={detailsRef}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 lg:hidden"
      >
        <summary className="cursor-pointer list-none font-satoshi text-[14px] font-medium uppercase leading-4 tracking-[-0.5px] text-[#1F3128] [&::-webkit-details-marker]:hidden">
          On this page
        </summary>
        <ul className="mt-4 flex flex-col gap-3">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => scrollToSection(event, item.id)}
                  className={[
                    "block font-satoshi text-[15px] font-medium leading-[1.2]",
                    isActive ? "text-[#1F3128]" : "text-[#1F3128]/60",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </details>

      <nav
        aria-label="Table of contents"
        className="sticky top-[100px] z-10 hidden max-h-[calc(100dvh-120px)] w-[296px] shrink-0 gap-[23.73px] self-start overflow-y-auto lg:flex"
      >
        <div
          className="relative w-1 shrink-0 self-stretch overflow-hidden rounded-[76.56px] bg-[#1F312833]"
          aria-hidden="true"
        >
          <div
            className="absolute left-0 h-16 w-1 rounded-[76.56px] bg-[#1F3128] transition-[top] duration-300"
            style={{
              top: `calc(${activeIndex} * (100% - 64px) / ${maxIndex})`,
            }}
          />
        </div>

        <ul className="flex min-w-0 flex-1 flex-col gap-[23.73px]">
          {items.map((item) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => scrollToSection(event, item.id)}
                  className={[
                    "block font-satoshi text-[16px] font-medium leading-[1.2] transition-colors",
                    isActive ? "text-[#1F3128]" : "text-[#1F3128]/60",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
