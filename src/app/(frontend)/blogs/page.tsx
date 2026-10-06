import type { Metadata } from "next";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogListing } from "@/components/blog/BlogListing";
import { Accent } from "@/components/ui/SectionHeading";
import { getBlogIndex } from "@/cms/blogIndex";
import { getFooter } from "@/cms/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Things worth thinking about.",
  description:
    "Ideas, opinions, lessons and the occasional rabbit hole from the people behind Design Asylum.",
};

export default async function BlogIndexPage() {
  const [page, footer] = await Promise.all([getBlogIndex(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <header className="bg-white px-4 pt-10 lg:px-4 lg:pt-20">
          <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center gap-2 text-center lg:gap-4">
            <Breadcrumbs items={[{ label: "Home", href: "/" }]} current={page.breadcrumbCurrent} />
            <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black capitalize lg:text-[56px] lg:tracking-[-0.5px]">
              {page.titleBefore}
              <Accent className="text-[32px] tracking-[-2.09px] normal-case lg:text-[56px]">
                {page.titleAccent}
              </Accent>
              {page.titleAfter}
            </h1>
            <p className="max-w-[484px] font-satoshi text-[12px] leading-[1.2] font-normal tracking-[-0.5px] text-black uppercase lg:text-[14px]">
              {page.intro}
            </p>
          </div>
          <div className="relative mx-auto mt-8 h-[201px] w-full max-w-[1438px] overflow-hidden rounded-[4px] bg-black lg:mt-8 lg:h-[421px] lg:rounded-[8.6px]">
            {page.heroImage ? (
              <Image
                src={page.heroImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 1438px, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>
        </header>

        <section className="bg-white px-4 pt-[120px]">
          <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center gap-8 lg:gap-16">
            <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
              {page.featuredBefore}
              <Accent>{page.featuredAccent}</Accent>
              {page.featuredAfter}
            </h2>
            <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
              {page.featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>

        <BlogListing
          headingBefore={page.listingBefore}
          headingAccent={page.listingAccent}
          headingAfter={page.listingAfter}
          categories={page.categories}
          posts={page.posts}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
