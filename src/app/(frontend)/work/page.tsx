import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { WorkGrid } from "@/components/work/WorkGrid";
import { getFooter } from "@/cms/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Work",
  description: "Worked with companies from a diverse set of industries.",
};

export default async function WorkPage() {
  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section className="bg-white px-4 pt-10 pb-[120px] lg:px-[60px] lg:pt-20 lg:pb-[200px]">
          <div className="mx-auto flex w-full max-w-[1350px] flex-col items-center gap-8 text-center lg:gap-20">
            <div className="flex flex-col items-center gap-6 lg:gap-8">
              <Breadcrumbs items={[{ label: "Home", href: "/" }]} current="Work" />
              <h1 className="max-w-[570px] font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:text-[44px] lg:leading-none lg:tracking-[-2.09px]">
                Worked with companies from a diverse set of industries
              </h1>
            </div>
            <div className="w-full text-left lg:text-center">
              <WorkGrid />
            </div>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
