import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { SplitHeading } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import { getWorkServicePageBySlug } from "@/cms/workServicePages";

export const revalidate = 120;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getWorkServicePageBySlug(slug);
  if (!page) {
    return {
      title: "Work Service",
      description: "Work and services at Design Asylum.",
    };
  }

  return {
    title: page.heroTitle || `${page.breadcrumbCurrent} — Design Asylum`,
    description: page.heroIntro || page.lead,
  };
}

export default async function WorkServiceDynamicPage({ params }: Props) {
  const { slug } = await params;
  const [page, footer] = await Promise.all([
    getWorkServicePageBySlug(slug),
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
              <SplitHeading before={page.relatedBefore} accent={page.relatedAccent} />
            </>
          }
          posts={page.relatedBlogs}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
