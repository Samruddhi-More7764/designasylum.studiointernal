import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { LogoMarquee } from "@/components/sections/02-LogoMarquee";
import { ServiceResourceHero } from "@/components/branding-agency/ServiceResourceHero";
import { BrandingAgencyArticle } from "@/components/branding-agency/BrandingAgencyArticle";
import { ResourceCta } from "@/components/branding-agency/ResourceCta";
import { ClientBrandingSection } from "@/components/branding-agency/ClientBrandingSection";
import { BrandingExperts } from "@/components/branding-agency/BrandingExperts";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { IndustryPager } from "@/components/branding-agency/IndustryPager";
import { FAQ } from "@/components/sections/14-FAQ";
import { getFooter } from "@/cms/content";
import {
  manufacturingBreadcrumbCurrent,
  manufacturingBreadcrumbs,
  manufacturingFaqItems,
  manufacturingHero,
  manufacturingLead,
  manufacturingPreface,
  manufacturingSections,
  manufacturingToc,
  RIGHT_TO_WIN_ID,
} from "@/data/manufacturingIndustryPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Agency for Manufacturing Firms",
  description: manufacturingHero.intro,
};

export default async function ManufacturingIndustryPage() {
  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={manufacturingHero.title}
          intro={manufacturingHero.intro}
          crumbs={manufacturingBreadcrumbs}
          current={manufacturingBreadcrumbCurrent}
        />
        <BrandingAgencyArticle
          lead={manufacturingLead}
          preface={manufacturingPreface}
          sections={manufacturingSections}
          toc={manufacturingToc}
        />
        <LogoMarquee placement="service" />
        <ResourceCta id={RIGHT_TO_WIN_ID} />
        <ClientBrandingSection />
        <FAQ items={manufacturingFaqItems} heading="FAQs" showCta={false} />
        <BrandingExperts />
        <RelatedBlogs />
        <IndustryPager />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
