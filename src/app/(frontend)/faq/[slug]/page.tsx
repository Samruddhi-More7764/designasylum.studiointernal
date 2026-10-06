import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { StickyTableOfContents } from "@/components/branding-agency/StickyTableOfContents";
import { getFooter } from "@/cms/content";
import { faqDetails } from "@/data/faqDetailPage";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = faqDetails[slug];
  if (!detail) return { title: "FAQ" };
  return {
    title: detail.question,
    description: detail.lead,
  };
}

export default async function FaqDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = faqDetails[slug];
  if (!detail) notFound();

  const footer = await getFooter();
  const toc = detail.sections.map((section) => ({ id: section.id, label: section.title }));

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <header className="bg-white px-4 pt-10 lg:pt-20">
          <div className="mx-auto flex w-full max-w-[1136px] flex-col items-center gap-4 text-center">
            <Breadcrumbs
              items={[{ label: "FAQs", href: "/faq" }]}
              current="Sevenloop Brand Website Redesign"
            />
            <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize lg:text-[56px]">
              {detail.question}
            </h1>
          </div>
        </header>

        <section className="bg-white px-5 pt-10 pb-[120px] sm:px-8 lg:px-[60px] lg:pt-16 lg:pb-[200px]">
          <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[120px]">
            <div className="sticky top-[100px] hidden self-start lg:block">
              <StickyTableOfContents items={toc} />
            </div>
            <article className="flex min-w-0 flex-1 flex-col gap-16 lg:max-w-[929px] lg:gap-20">
              <p className="font-figtree text-[22px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] lg:text-[32px] lg:tracking-[-2.09px]">
                {detail.lead}
              </p>
              {detail.sections.map((section) => (
                <section key={section.id} id={section.id} className="flex scroll-mt-[100px] flex-col gap-6">
                  <h2 className="font-figtree text-[28px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] lg:text-[44px] lg:tracking-[-2.09px]">
                    {section.title}
                  </h2>
                  <p className="font-satoshi text-[16px] leading-[1.45] font-normal tracking-[-0.5px] text-black lg:text-[20px] lg:leading-[25.9px]">
                    {section.body}
                  </p>
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
