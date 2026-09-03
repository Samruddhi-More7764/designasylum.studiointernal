import { NavBar } from "@/components/layout/NavBar";
import { ClientHubHero } from "@/components/clients/01-ClientHubHero";
import { ClientHubBody } from "@/components/clients/02-ClientHubBody";
import { ClientHubPartnership } from "@/components/clients/03-ClientHubPartnership";
import { ClientHubTransformation } from "@/components/clients/04-ClientHubTransformation";
import { ClientHubProjectTeam } from "@/components/clients/05-ClientHubProjectTeam";
import { ClientHubStartProject } from "@/components/clients/06-ClientHubStartProject";
import { Services } from "@/components/sections/04-Services";
import { Footer } from "@/components/sections/15-Footer";

/**
 * Client hub — Sevenloop | Design Asylum Client Work.
 * Sections are added one-by-one to match Figma.
 */
export default function SevenloopClientHubPage() {
  return (
    <>
      <NavBar />
      <main className="bg-white pt-28">
        <ClientHubHero />
        <ClientHubBody />
        <ClientHubPartnership />
        <ClientHubTransformation />
        <ClientHubProjectTeam />
        <Services variant="plain" />
        <ClientHubStartProject />
      </main>
      <Footer />
    </>
  );
}
