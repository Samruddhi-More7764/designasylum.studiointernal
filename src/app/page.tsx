import { NavBar } from "@/components/layout/NavBar";
import { Hero } from "@/components/sections/01-Hero";
import { LogoMarquee } from "@/components/sections/02-LogoMarquee";
import { FeaturedProjects } from "@/components/sections/03-FeaturedProjects";
import { Services } from "@/components/sections/04-Services";
import { ContactForm } from "@/components/sections/05-ContactForm";
import { VideoEmbed } from "@/components/sections/06-VideoEmbed";
import { ArticleCta } from "@/components/sections/07-ArticleCta";
import { PortfolioGrid } from "@/components/sections/08-PortfolioGrid";
import { PainPoints } from "@/components/sections/09-PainPoints";
import { ClientsGrid } from "@/components/sections/10-ClientsGrid";
import { AboutPoints } from "@/components/sections/11-AboutPoints";
import { CaseStudies } from "@/components/sections/12-CaseStudies";
import { BookStrategyCta } from "@/components/sections/BookStrategyCta";
import { TestimonialVideos } from "@/components/sections/13-TestimonialVideos";
import { FAQ } from "@/components/sections/14-FAQ";
import { TalkAboutBrand } from "@/components/sections/16-TalkAboutBrand";
import { Footer } from "@/components/sections/15-Footer";

/**
 * Homepage composition only (ignore Updated Homepage UI frames).
 */
export default function Home() {
  return (
    <>
      <NavBar />
      <main className="bg-white">
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
        <FAQ />
        <TalkAboutBrand />
      </main>
      <Footer />
    </>
  );
}
