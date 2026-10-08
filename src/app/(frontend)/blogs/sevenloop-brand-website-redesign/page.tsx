import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { FAQ } from "@/components/sections/14-FAQ";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { ArticleAuthor, ArticleTopics, BlogArticle } from "@/components/blog/BlogArticle";
import { getBlogArticle } from "@/cms/blogArticle";
import { getFooter } from "@/cms/content";
import { Accent } from "@/components/ui/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sevenloop Rebrand & Webflow Site: A 5-Month Case Study",
  description:
    "How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.",
};

export default async function SevenloopArticlePage() {
  const [page, footer] = await Promise.all([getBlogArticle(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <BlogArticle
          breadcrumbCurrent={page.breadcrumbCurrent}
          titleBefore={page.titleBefore}
          titleAccent={page.titleAccent}
          titleMiddle={page.titleMiddle}
          titleLine={page.titleLine}
          intro={page.intro}
          heroImage={page.heroImage}
          bylineName={page.bylineName}
          bylineDate={page.bylineDate}
          bylineAvatar={page.bylineAvatar}
          lead={page.lead}
          sections={page.sections}
        />
        <FAQ items={page.faqs} heading="FAQs" showCta={false} />
        <ArticleAuthor
          image={page.authorImage}
          name={page.authorName}
          role={page.authorRole}
          bio={page.authorBio}
          href={page.authorHref}
        />
        <ArticleTopics
          before={page.topicsBefore}
          accent={page.topicsAccent}
          after={page.topicsAfter}
          topics={page.topics}
        />
        <RelatedBlogs
          heading={
            <>
              {page.relatedBefore}
              <Accent>{page.relatedAccent}</Accent>
            </>
          }
          posts={page.relatedBlogs}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
