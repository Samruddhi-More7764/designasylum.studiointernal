import { notFound, redirect } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { ClientHubHero } from "@/components/clients/01-ClientHubHero";
import { ClientHubBody } from "@/components/clients/02-ClientHubBody";
import { ClientHubPartnership } from "@/components/clients/03-ClientHubPartnership";
import { ClientHubTransformation } from "@/components/clients/04-ClientHubTransformation";
import { ClientHubProjectTeam } from "@/components/clients/05-ClientHubProjectTeam";
import { ClientHubStartProject } from "@/components/clients/06-ClientHubStartProject";
import { Services } from "@/components/sections/04-Services";
import { Footer } from "@/components/sections/15-Footer";
import { getClientBySlug, getFooter } from "@/cms/content";
import { caseStudyPath } from "@/cms/urls";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ClientPage({ params }: Props) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  if (client.projectType === "direct") {
    if (!client.featuredStudySlug) notFound();
    redirect(caseStudyPath(slug, client.featuredStudySlug));
  }

  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main className="bg-white pt-28">
        <ClientHubHero name={client.name} slug={client.slug} />
        <ClientHubBody clientSlug={slug} />
        <ClientHubPartnership clientSlug={slug} />
        <ClientHubTransformation clientSlug={slug} />
        <ClientHubProjectTeam clientSlug={slug} />
        <Services variant="plain" />
        <ClientHubStartProject />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
