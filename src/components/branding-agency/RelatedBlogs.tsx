import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Accent } from "@/components/ui/SectionHeading";
import { relatedBlogs, relatedBlogsHeading } from "@/data/brandingAgencyPage";

export function RelatedBlogs({
  heading,
  posts = relatedBlogs,
}: {
  heading?: ReactNode;
  posts?: typeof relatedBlogs;
} = {}) {
  return (
    <section className="overflow-x-clip bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center gap-8 lg:gap-10">
        <h2 className="text-center font-figtree text-[28px] font-normal leading-[1.2] tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]">
          {heading ?? (
            <>
              {relatedBlogsHeading.before}
              <Accent>{relatedBlogsHeading.accent}</Accent>
            </>
          )}
        </h2>

        <div className="flex w-full flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {posts.map((post) => (
            <article key={post.key} className="w-full">
              <Link href={post.href} className="group flex flex-col gap-4">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#eef2f8]">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 330px, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-satoshi text-[12px] font-medium uppercase leading-4 tracking-[0.04em] text-black/55">
                    {post.date} · {post.readTime}
                  </p>
                  <h3 className="font-figtree text-[20px] leading-[1.25] font-medium tracking-[-0.4px] text-black sm:text-[22px]">
                    {post.title}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
