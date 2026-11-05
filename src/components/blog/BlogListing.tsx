"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { BlogCard } from "@/components/blog/BlogCard";
import { blogCategories, blogPosts } from "@/data/blogIndexPage";

export function BlogListing({
  headingBefore = "Looking for something ",
  headingAccent = "specific",
  headingAfter = "?",
  categories = blogCategories,
  posts = blogPosts,
}: {
  headingBefore?: string;
  headingAccent?: string;
  headingAfter?: string;
  categories?: readonly string[];
  posts?: typeof blogPosts;
} = {}) {
  const POSTS_PER_PAGE = 9;
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const visible =
    category === "All" ? posts : posts.filter((post) => post.category === category);

  const totalPages = Math.max(1, Math.ceil(visible.length / POSTS_PER_PAGE));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedPosts = visible.slice((activePage - 1) * POSTS_PER_PAGE, activePage * POSTS_PER_PAGE);

  const handleCategoryChange = (item: string) => {
    setCategory(item);
    setCurrentPage(1);
  };

  return (
    <section className="bg-white px-4 pt-[120px] pb-[120px] lg:px-[60px] lg:pt-[200px] lg:pb-[200px]">
      <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center">
        <h2 className="text-center font-figtree text-[32px] leading-none font-normal tracking-[-2px] text-black lg:text-[44px] lg:tracking-[-2.09px]">
          <SplitHeading before={headingBefore} accent={headingAccent} after={headingAfter} />
        </h2>

        <div
          role="tablist"
          aria-label="Blog categories"
          className="mt-8 flex items-center justify-center lg:mt-12"
        >
          {categories.map((item) => {
            const selected = item === category;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleCategoryChange(item)}
                className={`flex h-10 items-center justify-center border-b-2 px-1.5 font-satoshi text-[14px] leading-4 font-medium text-black uppercase lg:px-2.5 ${
                  selected ? "border-[#FE5A28]" : "border-transparent"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {paginatedPosts.length > 0 ? (
          <div className="mt-5 grid w-full grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
            {paginatedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center font-satoshi text-[16px] text-black/60">
            No posts in this category yet.
          </p>
        )}

        {visible.length > 0 ? (
          <div className="mt-14 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous page"
              disabled={activePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={`flex size-10 items-center justify-center rounded-lg bg-black/8 text-black transition-opacity ${
                activePage <= 1 ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-black/15"
              }`}
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <div className="relative">
              <select
                aria-label="Select page"
                value={activePage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="flex size-10 cursor-pointer appearance-none items-center justify-center rounded-lg border border-black bg-black text-center font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-white focus:outline-none"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <option key={pageNum} value={pageNum} className="bg-white text-black">
                    {pageNum}
                  </option>
                ))}
              </select>
            </div>
            <span className="font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-black/60 lowercase">
              of
            </span>
            <button
              type="button"
              aria-label={`Jump to page ${totalPages}`}
              onClick={() => setCurrentPage(totalPages)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-lg border border-black/30 bg-white font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-black transition-colors hover:border-black"
            >
              {totalPages}
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={activePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={`flex size-10 items-center justify-center rounded-lg bg-black/8 text-black transition-opacity ${
                activePage >= totalPages ? "cursor-not-allowed opacity-30" : "cursor-pointer hover:bg-black/15"
              }`}
            >
              <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
