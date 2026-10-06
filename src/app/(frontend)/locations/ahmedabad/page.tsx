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
import { getAhmedabadLocation } from "@/cms/ahmedabadLocation";
import {
  AHMEDABAD_CTA_ID,
  ahmedabadBreadcrumbs,
  ahmedabadCta,
} from "@/data/ahmedabadLocationPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Web Design & Branding Agency in Ahmedabad",
  description:
    "Ahmedabad’s economy has three layers — a deep manufacturing base, a fast-growing B2B and product-tech base, and the GIFT City fintech build-out. Each one needs a different kind of brand, but they share a buyer who has been around for a while and is hard to impress.",
};

export default async function AhmedabadLocationPage() {
  const [page, footer] = await Promise.all([getAhmedabadLocation(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={page.heroTitle}
          intro={page.heroIntro}
          crumbs={ahmedabadBreadcrumbs}
          current={page.breadcrumbCurrent}
          imageSrc={page.heroImage}
        />
        <ClientBrandingSection
          flushTop
          headingBefore={page.clientsBefore}
          headingAccent={page.clientsAccent}
          headingAfter={page.clientsAfter}
          tabs={page.clientTabs}
          projects={page.projects}
        />
        <LocationCallout
          before={page.calloutBefore}
          accent={page.calloutAccent}
          after={page.calloutAfter}
          body={page.calloutBody}
        />
        {page.logos ? (
          <LogoMarquee placement="location" logos={page.logos} />
        ) : (
          <LogoMarquee placement="location" />
        )}
        <BrandingAgencyArticle
          lead={page.lead}
          sections={page.sections}
          toc={[
            ...page.sections.map((section) => ({
              id: section.id,
              label: section.tocLabel,
            })),
            {
              id: AHMEDABAD_CTA_ID,
              label: "Ready to transform your Ahmedabad brand?",
            },
          ]}
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
        <FAQ items={page.faqs} heading="FAQs" showCta={false} />
        <RelatedBlogs
          heading={
            <>
              {page.relatedBefore}
              <Accent>{page.relatedAccent}</Accent>
              {page.relatedAfter}
            </>
          }
          posts={page.relatedBlogs}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
