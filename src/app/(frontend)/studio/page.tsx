import type { Metadata } from "next";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { FitIllustration } from "@/components/studio/StudioFit";
import { StudioPortrait } from "@/components/studio/StudioPortrait";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { getFooter } from "@/cms/content";
import { getStudioPage } from "@/cms/studioPage";
import { studioOffer } from "@/data/studioPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  description: "We make B2B websites that communicate your value proposition in the most compelling way.",
};

function Arrow({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={9}
      height={9}
      unoptimized
      aria-hidden="true"
      className={`h-[9px] w-[9px] ${ctaArrowClass}`}
    />
  );
}

export default async function StudioPage() {
  const [page, footer] = await Promise.all([getStudioPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section className="bg-white">
          <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center gap-4 px-4 pt-10 pb-8 text-center lg:px-8 lg:pt-20">
            <Breadcrumbs items={[{ label: "Home", href: "/" }]} current={page.breadcrumbCurrent} />
            <h1 className="max-w-[1042px] font-figtree text-[32px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[44px]">
              {page.headingBefore}
              <span className="font-playfair italic">{` ${page.headingAccent}`}</span>
              {page.headingAfter}
            </h1>
          </div>
          <img src={page.heroImage} alt="" className="h-[220px] w-full object-cover sm:h-[420px] lg:h-[831px]" />
        </section>

        <section className="px-4 py-16 lg:px-8 lg:py-[120px]">
          <div className="mx-auto grid w-full max-w-[1406px] grid-cols-1 gap-4 lg:grid-cols-2">
            <StudioPortrait src={page.portrait} isVideo={page.portraitIsVideo} />
            <div className="relative flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-[#f2f2f3] px-6 py-16 text-center lg:h-[832px] lg:px-10">
              <div className="flex max-w-[518px] flex-wrap justify-center gap-3">
                {page.chips.map((chip) => (
                  <span
                    key={`${chip.label}-${chip.value}`}
                    className="rounded-xl border border-black/30 px-3 font-figtree text-[16px] leading-[40px] tracking-[-0.8px] text-black/70 lg:text-[20px] lg:leading-[45px] lg:tracking-[-1.5px]"
                  >
                    {chip.label}
                    {chip.value ? <span className="text-black">{`  ${chip.value}`}</span> : null}
                  </span>
                ))}
              </div>
              <p className="mt-8 max-w-[489px] font-figtree text-[28px] leading-[1.2] font-normal tracking-[-1px] text-black lg:text-[38px] lg:leading-[45px] lg:tracking-[-1.5px]">
                {page.quote}
              </p>
              <div className="mt-10 flex flex-col items-center gap-1 lg:absolute lg:bottom-12">
                <p className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.5px] text-black">
                  {page.quoteName}
                </p>
                <p className="flex items-center gap-2 font-satoshi text-[20px] leading-[1.2] text-black/80">
                  <img src="/assets/images/studio/masify.svg" alt="" className="size-6" />
                  {page.quoteRole}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-8 lg:px-[60px]">
          <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-1px] text-[#05201f] lg:text-[44px] lg:leading-[63px] lg:tracking-[-2px]">
            {page.projectsBefore}
            <span className="font-playfair italic">{page.projectsAccent}</span>
          </h2>
          <ul className="mt-8">
            {page.projects.map((project) => (
              <li key={project.id} className="border-b border-black/30 py-10 lg:py-14">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[60px]">
                  <img
                    src={project.image}
                    alt=""
                    className="h-[220px] w-full object-cover lg:h-[279px] lg:w-[496px] lg:shrink-0"
                  />
                  <div className="flex flex-1 flex-col gap-6 lg:h-[279px] lg:flex-row lg:items-start lg:justify-between">
                    <p className="font-figtree text-[32px] leading-none font-normal tracking-[-1.5px] text-black lg:text-[38px] lg:leading-[45px]">
                      {project.name}
                    </p>
                    <div className="flex max-w-[330px] flex-col items-start gap-8 lg:h-full lg:justify-between">
                      <p className="font-satoshi text-[18px] leading-[26px] font-normal tracking-[-0.5px] text-black lg:text-[20px]">
                        {project.body}
                      </p>
                      <a
                        href={project.href || "#"}
                        className="group inline-flex items-center gap-2 rounded-pill border border-black px-[17px] py-[17px] font-satoshi text-[14px] leading-4 font-medium text-black uppercase"
                      >
                        <CtaHoverLabel>View website</CtaHoverLabel>
                        <Arrow src="/assets/images/branding-agency/arrow-up-right-black.png" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="px-4 py-16 lg:px-8 lg:py-[120px]">
          <div className="mx-auto flex w-full max-w-[1346px] flex-col gap-16 lg:gap-[120px]">
            {[
              {
                before: page.fitBefore,
                accent: page.fitAccent,
                after: page.fitAfter,
                cards: page.fitCards,
                tone: "right" as const,
              },
              {
                before: page.missBefore,
                accent: page.missAccent,
                after: page.missAfter,
                cards: page.missCards,
                tone: "miss" as const,
              },
            ].map((group) => (
              <div key={group.tone} className="flex flex-col items-center gap-10 lg:gap-16">
                <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-1px] text-[#05201f] lg:text-[44px] lg:leading-[63px] lg:tracking-[-2px]">
                  {group.before}
                  <span className="font-playfair italic">{group.accent}</span>
                  {group.after}
                </h2>
                <ul className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
                  {group.cards.map((caption, index) => (
                    <li
                      key={caption}
                      className="flex min-h-[420px] flex-col justify-between rounded-[32px] border border-black/30 bg-white p-4 lg:h-[447px]"
                    >
                      <FitIllustration index={index} tone={group.tone} />
                      <p className="px-1 pt-4 font-satoshi text-[18px] leading-[26px] tracking-[-0.5px] text-black lg:text-[20px]">
                        {caption}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 lg:px-8 lg:pb-[160px]">
          <div className="mx-auto flex w-full max-w-[881px] flex-col items-center gap-10 text-center lg:gap-16">
            <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-1px] text-[#05201f] lg:text-[44px] lg:leading-[63px] lg:tracking-[-2px]">
              {page.teamBefore}
              <span className="font-playfair italic">{page.teamAccent}</span>
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-3">
              {page.people.map((person) => (
                <li
                  key={person.name}
                  className="flex items-center gap-2 rounded-xl border border-black/30 px-3 py-1"
                >
                  <img src={person.image} alt="" className="size-6 rounded object-cover" />
                  <span className="font-figtree text-[18px] leading-[40px] tracking-[-0.8px] text-black lg:text-[20px] lg:leading-[45px] lg:tracking-[-1.5px]">
                    {person.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 pt-4 pb-[120px] text-center lg:pb-[160px]">
          <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:text-[60px] lg:leading-[72px] lg:tracking-[-3px]">
            {studioOffer.heading}
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-pill border border-black px-[17px] py-[17px] font-satoshi text-[14px] leading-4 font-medium text-black uppercase"
            >
              <CtaHoverLabel>{studioOffer.offer}</CtaHoverLabel>
              <Arrow src="/assets/images/branding-agency/arrow-up-right-black.png" />
            </a>
            <a
              href={studioOffer.introHref}
              className="group inline-flex items-center gap-2 rounded-pill border border-white bg-black px-[17px] py-[17px] font-satoshi text-[14px] leading-4 font-medium text-white uppercase"
            >
              <CtaHoverLabel>{studioOffer.intro}</CtaHoverLabel>
              <Arrow src="/assets/images/branding-agency/arrow-up-right-white.png" />
            </a>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
