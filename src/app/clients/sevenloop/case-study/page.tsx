import { NavBar } from "@/components/layout/NavBar";
import { CaseStudyHero } from "@/components/clients/07-CaseStudyHero";
import { CaseStudyDetails } from "@/components/clients/08-CaseStudyDetails";
import { CaseStudyGallery } from "@/components/clients/09-CaseStudyGallery";
import { CaseStudyViewAllClients } from "@/components/clients/10-CaseStudyViewAllClients";
import { ClientHubStartProject } from "@/components/clients/06-ClientHubStartProject";
import { CaseStudyFooter } from "@/components/clients/11-CaseStudyFooter";

/**
 * Case study — Sevenloop | Design Asylum Client Work.
 * Reached from the "View Case Study" CTA on the Sevenloop Client Hub page.
 */
export default function SevenloopCaseStudyPage() {
  return (
    <>
      <NavBar />
      <main className="bg-white pt-28">
        <CaseStudyHero />
        <CaseStudyDetails />
        <CaseStudyGallery />
        <CaseStudyViewAllClients />
        <ClientHubStartProject align="start" />
      </main>
      <CaseStudyFooter />
    </>
  );
}
