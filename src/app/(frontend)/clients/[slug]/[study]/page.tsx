import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { CaseStudyHero } from "@/components/clients/07-CaseStudyHero";
import { CaseStudyDetails } from "@/components/clients/08-CaseStudyDetails";
import { CaseStudyGallery } from "@/components/clients/09-CaseStudyGallery";
import { CaseStudyViewAllClients } from "@/components/clients/10-CaseStudyViewAllClients";
import { ClientHubStartProject } from "@/components/clients/06-ClientHubStartProject";
import { Footer } from "@/components/sections/15-Footer";
import { getCaseStudyPage, getFooter } from "@/cms/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string; study: string }> };

export default async function CaseStudyRoutePage({ params }: Props) {
  const { slug, study } = await params;
  const page = await getCaseStudyPage(slug, study);
  if (!page) notFound();

  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <CaseStudyHero clientSlug={slug} studySlug={study} />
        <CaseStudyDetails clientSlug={slug} studySlug={study} />
        <CaseStudyGallery clientSlug={slug} studySlug={study} />
        <CaseStudyViewAllClients clientSlug={slug} studySlug={study} />
        <ClientHubStartProject align="start" />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
