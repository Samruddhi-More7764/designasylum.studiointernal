import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { FAQ } from "@/components/sections/14-FAQ";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { ArticleAuthor, ArticleTopics, BlogArticle } from "@/components/blog/BlogArticle";
import { getFooter } from "@/cms/content";
import { sevenloopFaqItems } from "@/data/sevenloopArticle";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sevenloop Rebrand & Webflow Site: A 5-Month Case Study",
  description:
    "How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.",
};

export default async function SevenloopArticlePage() {
  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <BlogArticle />
        <FAQ items={sevenloopFaqItems} heading="FAQs" showCta={false} />
        <ArticleAuthor />
        <ArticleTopics />
        <RelatedBlogs />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
