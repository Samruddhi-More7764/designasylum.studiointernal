"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Accent } from "@/components/ui/SectionHeading";
import { BlogCard } from "@/components/blog/BlogCard";
import {
  blogCategories,
  blogPosts,
  type BlogCategory,
} from "@/data/blogIndexPage";

export function BlogListing() {
  const [category, setCategory] = useState<BlogCategory>("All");
  const posts =
    category === "All"
      ? blogPosts
      : blogPosts.filter((post) => post.category === category);

  return (
    <section className="bg-white px-4 pt-[120px] pb-[120px] lg:px-[60px] lg:pt-[200px] lg:pb-[200px]">
      <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center">
        <h2 className="text-center font-figtree text-[32px] leading-none font-normal tracking-[-2px] text-black lg:text-[44px] lg:tracking-[-2.09px]">
          Looking for something <Accent>specific</Accent>?
        </h2>

        <div
          role="tablist"
          aria-label="Blog categories"
          className="mt-8 flex items-center justify-center lg:mt-12"
        >
          {blogCategories.map((item) => {
            const selected = item === category;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCategory(item)}
                className={`flex h-10 items-center justify-center border-b-2 px-1.5 font-satoshi text-[14px] leading-4 font-medium text-black uppercase lg:px-2.5 ${
                  selected ? "border-[#FE5A28]" : "border-transparent"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {posts.length > 0 ? (
          <div className="mt-5 grid w-full grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center font-satoshi text-[16px] text-black/60">
            No posts in this category yet.
          </p>
        )}

        <div className="mt-14 hidden items-center gap-4 lg:flex">
          <button
            type="button"
            aria-label="Previous page"
            className="flex size-10 items-center justify-center rounded-lg bg-black/8 text-black"
          >
            <ChevronLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <span className="flex size-10 items-center justify-center rounded-lg border border-black bg-black font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-white">
            1
          </span>
          <span className="font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-black/60 lowercase">
            of
          </span>
          <span className="flex size-10 items-center justify-center rounded-lg border border-black/30 bg-white font-satoshi text-[14px] leading-4 font-medium tracking-[-0.26px] text-black">
            5
          </span>
          <button
            type="button"
            aria-label="Next page"
            className="flex size-10 items-center justify-center rounded-lg bg-black/8 text-black"
          >
            <ChevronRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
