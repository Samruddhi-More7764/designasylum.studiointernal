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
import { Accent } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import { getManufacturingIndustry } from "@/cms/manufacturingIndustry";
import {
  manufacturingBreadcrumbs,
  RIGHT_TO_WIN_ID,
} from "@/data/manufacturingIndustryPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Design Agency for Manufacturing Firms",
  description:
    "A design agency for manufacturing firms builds branding and websites that highlight industrial expertise, driving online visibility and client engagement.",
};

export default async function ManufacturingIndustryPage() {
  const [page, footer] = await Promise.all([
    getManufacturingIndustry(),
    getFooter(),
  ]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={page.heroTitle}
          intro={page.heroIntro}
          crumbs={manufacturingBreadcrumbs}
          current={page.breadcrumbCurrent}
          imageSrc={page.heroImage}
        />
        <BrandingAgencyArticle
          lead={page.lead}
          preface={page.preface}
          sections={page.sections}
          toc={[
            ...page.sections.map((section) => ({
              id: section.id,
              label: section.tocLabel,
            })),
            { id: RIGHT_TO_WIN_ID, label: "Design your right to win" },
          ]}
        />
        {page.logos ? (
          <LogoMarquee placement="service" logos={page.logos} />
        ) : (
          <LogoMarquee placement="service" />
        )}
        <ResourceCta id={RIGHT_TO_WIN_ID} />
        <ClientBrandingSection
          headingBefore={page.clientsBefore}
          headingAccent={page.clientsAccent}
          headingAfter={page.clientsAfter}
          tabs={page.clientTabs}
          projects={page.projects}
        />
        <FAQ items={page.faqs} heading="FAQs" showCta={false} />
        <BrandingExperts
          heading={{
            before: page.expertsBefore,
            accent: page.expertsAccent,
            subheading: page.expertsSubheading,
          }}
          members={page.experts}
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
        <IndustryPager />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
