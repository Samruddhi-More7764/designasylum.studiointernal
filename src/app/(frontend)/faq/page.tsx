import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { FaqExplorer } from "@/components/faq/FaqExplorer";
import { getFaqPage } from "@/cms/faqPage";
import { getFooter } from "@/cms/content";
import { buildMetadata } from "@/cms/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getFaqPage();
  return buildMetadata({
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImage: page.ogImage,
    noIndex: page.noIndex,
    fallbackTitle: "Frequently Asked Questions | Design Asylum",
    fallbackDescription:
      "Answers on branding, websites, and marketing from Design Asylum.",
  });
}

export default async function FaqPage() {
  const [page, footer] = await Promise.all([getFaqPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <FaqExplorer
          titleBefore={page.titleBefore}
          titleAccent={page.titleAccent}
          titleAfter={page.titleAfter}
          categories={page.categories}
          entries={page.entries}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
