import type { Metadata } from "next";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { PersonStack } from "@/components/team/PersonStack";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { getFooter } from "@/cms/content";
import { getTeamPerson, type PersonChip } from "@/cms/teamPerson";
import { teamPersonCta } from "@/data/teamPersonPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tanmaya Rao",
  description:
    "Tanmaya Rao is the Lead Brand Designer and Illustrator at Design Asylum.",
};

function Arrow() {
  return (
    <Image
      src="/assets/images/branding-agency/arrow-up-right-black.png"
      alt=""
      width={9}
      height={9}
      unoptimized
      aria-hidden="true"
      className={`h-[9px] w-[9px] ${ctaArrowClass}`}
    />
  );
}

function WhiteArrow() {
  return (
    <Image
      src="/assets/images/branding-agency/arrow-up-right-white.png"
      alt=""
      width={9}
      height={9}
      unoptimized
      aria-hidden="true"
      className={`h-[9px] w-[9px] ${ctaArrowClass}`}
    />
  );
}

function Heading({
  before,
  accent,
  after,
}: {
  before: string;
  accent: string;
  after: string;
}) {
  return (
    <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201f] lg:text-[44px] lg:leading-[62.596px]">
      {before ? <span>{before} </span> : null}
      <span className="font-playfair italic">{accent}</span>
      {after ? <span>{` ${after}`}</span> : null}
    </h2>
  );
}

function Chips({ items }: { items: PersonChip[] }) {
  return (
    <ul className="mt-8 flex flex-wrap items-center justify-center gap-[11px] lg:mt-16">
      {items.map((chip) => (
        <li
          key={chip.id}
          className="flex h-12 items-center gap-2 rounded-xl border border-black/30 px-3"
        >
          {chip.icon ? (
            <img src={chip.icon} alt="" className="size-6 rounded object-contain" />
          ) : (
            <span className="size-6 shrink-0 rounded bg-[#d9d9d9]" />
          )}
          <span className="font-figtree text-[16px] leading-none font-normal tracking-[-1.5071px] text-black lg:text-[20px]">
            {chip.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function TeamPersonPage() {
  const [page, footer] = await Promise.all([getTeamPerson(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section id="hero" className="scroll-mt-28 px-4 pt-6 pb-[120px] lg:px-[60px] lg:pt-16 lg:pb-[200px]">
          <div className="mx-auto flex w-full max-w-[1350px] flex-col items-center">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Team", href: "/team" },
              ]}
              current={page.breadcrumbCurrent}
            />

            <div className="mt-10 w-full lg:mt-16">
              <PersonStack images={page.photos} />
            </div>

            <div className="mt-10 flex flex-col items-center gap-1.5 text-center lg:mt-14 lg:gap-3">
              <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2.0865px] text-[#05201f] lg:text-[44px] lg:leading-[62.596px]">
                {page.name}
              </h1>
              <p className="font-satoshi text-[16px] leading-none font-normal tracking-[-0.08px] text-black/80 lg:text-[20px] lg:tracking-[-0.1px]">
                {page.role}
              </p>
            </div>

            <div className="mt-8 flex w-full max-w-[675px] flex-col gap-4 text-black lg:mt-10">
              {page.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className={
                    index === 0
                      ? "font-figtree text-[20px] leading-[1.2] font-medium tracking-[-0.5px] lg:text-[24px]"
                      : "font-satoshi text-[16px] leading-[1.5] font-normal tracking-[-0.5px] lg:text-[20px]"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-[120px] w-full lg:mt-[160px]">
              <Heading
                before={page.servicesBefore}
                accent={page.servicesAccent}
                after={page.servicesAfter}
              />
              <Chips items={page.services} />
            </div>

            <div className="mt-[120px] w-full lg:mt-[160px]">
              <Heading
                before={page.clientsBefore}
                accent={page.clientsAccent}
                after={page.clientsAfter}
              />
              <ul className="mx-auto mt-8 grid max-w-[358px] grid-cols-2 gap-4 lg:mt-16 lg:flex lg:max-w-[1130px] lg:flex-wrap lg:justify-center">
                {page.logos.map((logo, index) => (
                  <li
                    key={`${logo}-${index}`}
                    className="flex aspect-[10/7] h-auto w-full items-center justify-center rounded-xl border border-black/15 px-3 lg:aspect-auto lg:h-[140px] lg:w-[200px]"
                  >
                    <img src={logo} alt="" className="max-h-[70px] w-full object-contain lg:max-h-[101px]" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[120px] w-full lg:mt-[160px]">
              <Heading
                before={page.projectsBefore}
                accent={page.projectsAccent}
                after={page.projectsAfter}
              />
              <ul className="mt-8">
                {page.projects.map((project) => (
                  <li key={project.id} className="border-b border-black/30 py-8 lg:py-14">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-[60px]">
                      <img
                        src={project.image}
                        alt=""
                        className="aspect-[358/201] h-auto w-full object-cover lg:aspect-auto lg:h-[279px] lg:w-[496px] lg:shrink-0"
                      />
                      <div className="flex flex-1 flex-col gap-4 lg:h-[279px] lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                        <p className="font-figtree text-[24px] leading-none font-normal tracking-[-1.5px] text-black lg:text-[38px] lg:leading-[45px]">
                          {project.name}
                        </p>
                        <div className="flex max-w-[360px] flex-col items-start gap-4 lg:h-full lg:max-w-[330px] lg:justify-between lg:gap-8">
                          <p className="font-satoshi text-[16px] leading-[1.5] font-normal tracking-[-0.5px] text-black lg:text-[20px] lg:leading-[26px]">
                            {project.body}
                          </p>
                          <a
                            href={project.href || "#"}
                            className="group inline-flex h-11 w-[154px] items-center justify-center gap-2 rounded-pill border border-black font-satoshi text-[12px] leading-4 font-medium text-black uppercase lg:h-[50px] lg:text-[14px]"
                          >
                            <CtaHoverLabel>View website</CtaHoverLabel>
                            <Arrow />
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[120px] w-full max-w-[921px] lg:mt-[160px]">
              <Heading
                before={page.blogsBefore}
                accent={page.blogsAccent}
                after={page.blogsAfter}
              />
              <ul className="mt-8">
                {page.posts.map((post) => (
                  <li key={post.id} className="border-b border-black/10">
                    <a
                      href={post.href || "#"}
                      className="flex items-center justify-between gap-6 py-6"
                    >
                      <span className="font-figtree text-[18px] leading-8 font-normal tracking-[-1px] text-black lg:text-[24px]">
                        {post.title}
                      </span>
                      <img
                        src="/assets/images/team/arrow-right.svg"
                        alt=""
                        width={26}
                        height={10}
                        className="shrink-0"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[120px] w-full lg:mt-[160px]">
              <Heading
                before={page.solutionsBefore}
                accent={page.solutionsAccent}
                after={page.solutionsAfter}
              />
              <Chips items={page.solutions} />
            </div>

            <div className="mt-[120px] w-full lg:mt-[160px]">
              <Heading
                before={page.industriesBefore}
                accent={page.industriesAccent}
                after={page.industriesAfter}
              />
              <Chips items={page.industries} />
            </div>

            <div className="mt-[120px] flex w-full max-w-[1199px] flex-col items-start gap-8 text-left lg:mt-[160px] lg:items-center lg:text-center">
              <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:text-[60px] lg:leading-[72px] lg:tracking-[-3px]">
                {teamPersonCta.heading}
              </h2>
              <a
                href={teamPersonCta.href}
                className="group inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-black bg-black px-5 font-satoshi text-[12px] leading-4 font-medium text-white uppercase lg:h-[50px] lg:px-[17px] lg:text-[14px]"
              >
                <CtaHoverLabel>{teamPersonCta.button}</CtaHoverLabel>
                <WhiteArrow />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
