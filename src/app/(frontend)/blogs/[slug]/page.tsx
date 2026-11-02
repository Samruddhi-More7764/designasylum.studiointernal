import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { FAQ } from "@/components/sections/14-FAQ";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { ArticleAuthor, ArticleTopics, BlogArticle } from "@/components/blog/BlogArticle";
import { getBlogPostBySlug } from "@/cms/blogArticle";
import { getFooter } from "@/cms/content";
import { SplitHeading } from "@/components/ui/SectionHeading";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getBlogPostBySlug(slug);
  if (!page) return { title: "Blog" };
  const fullTitle = `${page.titleBefore}${page.titleAccent ? ` ${page.titleAccent}` : ""}${page.titleMiddle}${page.titleLine}`.trim();
  return {
    title: fullTitle || "Blog",
    description: page.intro || undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, footer] = await Promise.all([getBlogPostBySlug(slug), getFooter()]);

  if (!page) {
    notFound();
  }

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
              <SplitHeading before={page.relatedBefore} accent={page.relatedAccent} />
            </>
          }
          posts={page.relatedBlogs}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}

