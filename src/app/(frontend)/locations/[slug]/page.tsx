import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { LogoMarquee } from "@/components/sections/02-LogoMarquee";
import { ServiceResourceHero } from "@/components/branding-agency/ServiceResourceHero";
import { BrandingAgencyArticle } from "@/components/branding-agency/BrandingAgencyArticle";
import { ClientBrandingSection } from "@/components/branding-agency/ClientBrandingSection";
import { LocationCallout } from "@/components/branding-agency/LocationCallout";
import { RelatedBlogs } from "@/components/branding-agency/RelatedBlogs";
import { FAQ } from "@/components/sections/14-FAQ";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import { getLocationPageBySlug, getAllLocationSlugs } from "@/cms/locationPages";

export const revalidate = 120;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLocationPageBySlug(slug);
  if (!page) {
    return {
      title: "Location",
      description: "Location branding and design services at Design Asylum.",
    };
  }

  return {
    title: page.heroTitle,
    description: page.heroIntro || page.lead,
  };
}

export default async function DynamicLocationPage({ params }: Props) {
  const { slug } = await params;
  const [page, footer] = await Promise.all([
    getLocationPageBySlug(slug),
    getFooter(),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ServiceResourceHero
          title={page.heroTitle}
          intro={page.heroIntro}
          crumbs={[{ label: "Locations", href: "/locations/ahmedabad" }]}
          current={page.breadcrumbCurrent}
          imageSrc={page.heroImage}
          showActions={false}
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
          toc={page.sections.map((section) => ({
            id: section.id,
            label: section.tocLabel,
          }))}
        />
        {page.faqs && page.faqs.length > 0 ? (
          <FAQ items={page.faqs} heading="FAQs" showCta={false} />
        ) : null}
        <RelatedBlogs
          heading={
            <>
              <SplitHeading before={page.relatedBefore} accent={page.relatedAccent} after={page.relatedAfter} />
            </>
          }
          posts={page.relatedBlogs}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}

