"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, Search } from "lucide-react";
import { Accent } from "@/components/ui/SectionHeading";
import {
  faqCategories,
  faqEntries,
  type FaqCategory,
} from "@/data/faqPage";

type FilterId = "all" | FaqCategory;

export function FaqExplorer() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [openId, setOpenId] = useState<string | null>(faqEntries[0]?.id ?? null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqEntries.filter((entry) => {
      if (filter !== "all" && entry.category !== filter) return false;
      if (!needle) return true;
      return `${entry.question} ${entry.answer ?? ""}`.toLowerCase().includes(needle);
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const tally: Record<FilterId, number> = {
      all: faqEntries.length,
      about: 0,
      branding: 0,
      website: 0,
      marketing: 0,
    };
    for (const entry of faqEntries) tally[entry.category] += 1;
    return tally;
  }, []);

  return (
    <div className="bg-white px-4 pt-10 pb-[120px] lg:px-10 lg:pt-20 lg:pb-[200px]">
      <h1 className="mx-auto max-w-[1136px] text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize lg:text-[56px]">
        Frequently <Accent className="text-[32px] tracking-[-2.09px] lg:text-[56px]">Asked</Accent> questions!
      </h1>

      <div className="mx-auto mt-8 grid w-full max-w-[1280px] grid-cols-1 gap-8 lg:mt-10 lg:grid-cols-[229px_minmax(0,1008px)] lg:justify-center lg:gap-x-12">
        <nav
          aria-label="FAQ categories"
          className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0 lg:overflow-visible lg:pt-[88px]"
        >
          {faqCategories.map((category) => {
            const active = filter === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                className={`h-8 shrink-0 rounded-xl px-4 text-left font-satoshi text-[13px] leading-4 font-medium tracking-[-0.2px] text-black uppercase lg:h-10 lg:text-[14px] ${
                  active ? "border-l-2 border-[#FE5A28] bg-[#FE5A28]/10" : ""
                }`}
              >
                {category.label} ({counts[category.id]})
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          <form
            className="flex h-12 w-full items-center justify-between rounded-xl border border-black/30 pr-2 pl-3 focus-within:border-black lg:mx-auto lg:h-14 lg:max-w-[677px] lg:pr-2"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="flex min-w-0 flex-1 items-center gap-[7px]">
              <Search className="size-6 shrink-0 text-black" strokeWidth={1.5} aria-hidden="true" />
              <span className="sr-only">Search questions</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                className="w-full bg-transparent font-figtree text-[18px] leading-[1.2] font-normal tracking-[-0.5px] text-black outline-none placeholder:text-black/50 lg:text-[20px]"
              />
            </label>
            <button
              type="submit"
              aria-label="Search"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/20 text-white transition-colors hover:bg-[#FE5A28] focus-visible:bg-[#FE5A28] active:bg-[#FE5A28] lg:size-[39px]"
            >
              <ArrowRight className="size-4 lg:size-5" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-8 lg:mt-16">
            {visible.length === 0 ? (
              <p className="font-satoshi text-[16px] text-black/70">No matching questions.</p>
            ) : (
              visible.map((entry) => {
                const open = openId === entry.id && Boolean(entry.answer);
                return (
                  <article key={entry.id} className="border-b border-black/10 py-6">
                    <button
                      type="button"
                      className="flex w-full items-start justify-between gap-6 text-left"
                      aria-expanded={entry.answer ? open : undefined}
                      onClick={() => {
                        if (!entry.answer) return;
                        setOpenId(open ? null : entry.id);
                      }}
                    >
                      <span className="font-figtree text-[20px] leading-6 font-normal tracking-[-0.5px] text-black lg:text-[24px] lg:leading-8 lg:tracking-[-1px]">
                        {entry.question}
                      </span>
                      <ChevronDown
                        className={`mt-1 size-5 shrink-0 text-black transition-transform lg:size-6 ${open ? "rotate-180" : ""}`}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </button>
                    {open && entry.answer ? (
                      <div className="mt-3 flex max-w-[997px] flex-col items-start gap-3">
                        <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.5px] text-[#374151] lg:text-[20px]">
                          {entry.answer}
                        </p>
                        {entry.detailSlug ? (
                          <Link
                            href={`/faq/${entry.detailSlug}`}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-black px-[17px] font-satoshi text-[13px] leading-4 font-medium tracking-[-0.26px] text-black uppercase"
                          >
                            Read full answer
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </Link>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
