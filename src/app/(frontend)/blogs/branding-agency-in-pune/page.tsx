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
import { FAQ } from "@/components/sections/14-FAQ";
import { Accent } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import { getBrandingStrategy } from "@/cms/brandingStrategy";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Branding agency in Pune",
  description:
    "How to choose a B2B branding agency. Diagnosis, positioning, and identity — from Design Asylum in Pune.",
};

export default async function BrandingAgencyPage() {
  const [page, footer] = await Promise.all([getBrandingStrategy(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={page.heroTitle}
          intro={page.heroIntro}
          current={page.breadcrumbCurrent}
          imageSrc={page.heroImage}
        />
        <BrandingAgencyArticle
          lead={page.lead}
          sections={page.sections}
          toc={page.sections.map((section) => ({
            id: section.id,
            label: section.tocLabel,
          }))}
        />
        <LogoMarquee
          placement="service"
          logos={{ row1: page.logoRow1, row2: page.logoRow2 }}
        />
        <ResourceCta />
        <ClientBrandingSection
          headingBefore={page.clientsBefore}
          headingAccent={page.clientsAccent}
          headingAfter={page.clientsAfter}
          tabs={page.clientTabs}
          projects={page.projects}
        />
        <FAQ items={page.faqs} heading="FAQs" />
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
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
