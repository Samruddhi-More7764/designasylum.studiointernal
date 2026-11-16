import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { JobBoard } from "@/components/open-roles/JobBoard";
import { getFooter } from "@/cms/content";
import { getOpenRolesPage } from "@/cms/openRolesPage";
import { buildMetadata } from "@/cms/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getOpenRolesPage();
  return buildMetadata({
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImage: page.ogImage,
    noIndex: page.noIndex,
    fallbackTitle: "Open Roles | Careers at Design Asylum",
    fallbackDescription:
      "Find your place at Design Asylum. Browse open roles across design, development, and the studio.",
  });
}

export default async function OpenRolesPage() {
  const [page, footer] = await Promise.all([getOpenRolesPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section className="bg-white px-4 pt-10 pb-24 lg:px-[60px] lg:pt-20 lg:pb-[120px]">
          <h1 className="mx-auto mb-8 max-w-[1136px] text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:mb-16 lg:text-[56px] lg:tracking-[-0.5px]">
            <SplitHeading
              before={page.titleBefore}
              accent={page.titleAccent}
              after={page.titleAfter}
              accentClassName="text-[32px] tracking-[-2.09px] lg:text-[56px]"
            />
          </h1>
          <JobBoard categories={page.categories} roles={page.roles} />
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
