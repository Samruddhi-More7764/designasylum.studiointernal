import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { LogoMarquee } from "@/components/sections/02-LogoMarquee";
import { ServiceResourceHero } from "@/components/branding-agency/ServiceResourceHero";
import { BrandingAgencyArticle } from "@/components/branding-agency/BrandingAgencyArticle";
import { ResourceCta } from "@/components/branding-agency/ResourceCta";
import { ClientBrandingSection } from "@/components/branding-agency/ClientBrandingSection";
import { LocationCallout } from "@/components/branding-agency/LocationCallout";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { FAQ } from "@/components/sections/14-FAQ";
import { Accent } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import {
  AHMEDABAD_CTA_ID,
  ahmedabadBreadcrumbCurrent,
  ahmedabadBreadcrumbs,
  ahmedabadCta,
  ahmedabadFaqItems,
  ahmedabadHero,
  ahmedabadLead,
  ahmedabadProjectTabs,
  ahmedabadSections,
  ahmedabadToc,
} from "@/data/ahmedabadLocationPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Web Design & Branding Agency in Ahmedabad",
  description: ahmedabadHero.intro,
};

export default async function AhmedabadLocationPage() {
  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={ahmedabadHero.title}
          intro={ahmedabadHero.intro}
          crumbs={ahmedabadBreadcrumbs}
          current={ahmedabadBreadcrumbCurrent}
        />
        <ClientBrandingSection
          flushTop
          tabs={ahmedabadProjectTabs}
          heading={
            <>
              Design projects for <Accent>Ahmedabad</Accent> brands
            </>
          }
        />
        <LocationCallout />
        <LogoMarquee placement="location" />
        <BrandingAgencyArticle
          lead={ahmedabadLead}
          sections={ahmedabadSections}
          toc={ahmedabadToc}
          spacing="cta"
        />
        <ResourceCta
          id={AHMEDABAD_CTA_ID}
          variant="location"
          heading={
            <>
              Ready to <span className="font-playfair italic">transform </span>
              your Ahmedabad brand?
            </>
          }
          body={ahmedabadCta.body}
          buttonLabel={ahmedabadCta.button}
          buttonClassName="!h-11 !min-h-11 !w-[214px] lg:!h-14 lg:!min-h-14 lg:!w-[243px]"
        />
        <FAQ items={ahmedabadFaqItems} heading="FAQs" showCta={false} />
        <RelatedBlogs
          heading={
            <>
              <Accent>Related </Accent>
              blogs
            </>
          }
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
