import dynamic from "next/dynamic";
import { NavBar } from "@/components/layout/NavBar";
import { Hero } from "@/components/sections/01-Hero";
import { LogoMarquee } from "@/components/sections/02-LogoMarquee";
import { FeaturedProjects } from "@/components/sections/03-FeaturedProjects";
import { Services } from "@/components/sections/04-Services";
import { ContactForm } from "@/components/sections/05-ContactForm";
import { ArticleCta } from "@/components/sections/07-ArticleCta";
import { PortfolioGrid } from "@/components/sections/08-PortfolioGrid";
import { PainPoints } from "@/components/sections/09-PainPoints";
import { ClientsGrid } from "@/components/sections/10-ClientsGrid";
import { AboutPoints } from "@/components/sections/11-AboutPoints";
import { CaseStudies } from "@/components/sections/12-CaseStudies";
import { BookStrategyCta } from "@/components/sections/BookStrategyCta";
import { Footer } from "@/components/sections/15-Footer";
import { getFaqItems, getFooter } from "@/cms/content";

// Code-split below-the-fold interactive components to optimize initial JS bundle size
const VideoEmbed = dynamic(
  () => import("@/components/sections/06-VideoEmbed").then((m) => m.VideoEmbed),
  { ssr: true },
);

const TestimonialVideos = dynamic(
  () =>
    import("@/components/sections/13-TestimonialVideos").then(
      (m) => m.TestimonialVideos,
    ),
  { ssr: true },
);

const FAQ = dynamic(
  () => import("@/components/sections/14-FAQ").then((m) => m.FAQ),
  { ssr: true },
);

const TalkAboutBrand = dynamic(
  () =>
    import("@/components/sections/16-TalkAboutBrand").then(
      (m) => m.TalkAboutBrand,
    ),
  { ssr: true },
);

/**
 * Homepage composition only (ignore Updated Homepage UI frames).
 */
export default async function Home() {
  const [faqItems, footer] = await Promise.all([getFaqItems(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white">
        <Hero />
        <LogoMarquee />
        <FeaturedProjects />
        <Services />
        <ContactForm />
        <PortfolioGrid />
        <VideoEmbed />
        <ArticleCta />
        <PainPoints />
        <ClientsGrid />
        <AboutPoints />
        <CaseStudies />
        <BookStrategyCta />
        <TestimonialVideos />
        <FAQ items={faqItems} />
        <TalkAboutBrand />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
