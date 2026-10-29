import type { Metadata } from "next";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { getFooter } from "@/cms/content";
import { getTeamPage, type TeamMember } from "@/cms/teamPage";
import { teamCta } from "@/data/teamPage";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Team",
  description:
    "Strategists, designers, writers, developers and motion artists — in the same room, on the same problem.",
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

function PersonCard({ member }: { member: TeamMember }) {
  return (
    <article>
      <a href={member.href || "#"} className="group flex w-full flex-col gap-3 lg:gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-[13px] lg:rounded-xl">
          <Image
            src={member.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-3 lg:gap-4">
          <div className="flex flex-col gap-1 font-figtree leading-[1.2] font-normal tracking-[-1.5071px]">
            <p className="text-[24px] text-black lg:text-[32px]">{member.name}</p>
            <p className="text-[16px] text-black/70 lg:text-[20px]">{member.role}</p>
          </div>
          <span className="inline-flex h-11 w-[143px] items-center justify-center gap-2 rounded-pill border border-black px-[17px] font-satoshi text-[12px] leading-4 font-medium text-black uppercase lg:h-[50px] lg:text-[14px]">
            <CtaHoverLabel>Read more</CtaHoverLabel>
            <Arrow src="/assets/images/branding-agency/arrow-up-right-black.png" />
          </span>
        </div>
      </a>
    </article>
  );
}

export default async function TeamPage() {
  const [page, footer] = await Promise.all([getTeamPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section className="bg-white px-4 pt-6 pb-[120px] lg:px-[60px] lg:pt-16 lg:pb-[200px]">
          <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center">
            <Breadcrumbs items={[{ label: "Home", href: "/" }]} current={page.breadcrumbCurrent} />
            <div className="mt-8 flex max-w-[338px] flex-col items-center gap-2 text-center lg:mt-16 lg:max-w-[808px] lg:gap-5">
              <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:text-[44px] lg:leading-none lg:tracking-[-2.0865px]">
                {page.heading}
              </h1>
              <p className="font-satoshi text-[12px] leading-[1.2] font-normal tracking-[-0.5px] text-black uppercase lg:text-[14px]">
                {page.intro}
              </p>
            </div>

            <div className="mt-[32px] flex w-full flex-col items-center gap-8 lg:mt-[90px] lg:gap-20">
              <h2 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2.0865px] text-[#05201f] lg:text-[44px] lg:leading-[62.596px]">
                {page.leadershipHeading}
              </h2>
              <ul className="flex w-full flex-col gap-8 lg:flex-row lg:flex-wrap lg:justify-center lg:gap-x-6 lg:gap-y-8">
                {page.leadership.map((member) => (
                  <li
                    key={member.id}
                    className="w-full lg:w-[calc((100%-3rem)/3)] lg:shrink-0"
                  >
                    <PersonCard member={member} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[120px] flex w-full flex-col items-center gap-8 lg:mt-[200px] lg:gap-20">
              <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2.0865px] text-[#05201f] lg:text-[44px] lg:leading-[62.596px]">
                <SplitHeading accent={page.teamAccent} after={page.teamAfter} />
              </h2>
              <ul className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-8">
                {page.members.map((member) => (
                  <li key={member.id}>
                    <PersonCard member={member} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-[120px] flex flex-col items-center gap-10 text-center lg:mt-[200px] lg:gap-8">
              <h2 className="max-w-[312px] font-figtree text-[32px] leading-[1.2] font-medium tracking-[-2px] text-black lg:max-w-none lg:text-[60px] lg:leading-[72px] lg:font-normal lg:tracking-[-3px]">
                {teamCta.heading}
              </h2>
              <a
                href={teamCta.href}
                className="group inline-flex h-11 w-[164px] items-center justify-center gap-2 rounded-pill border border-black bg-black px-5 font-satoshi text-[12px] leading-4 font-medium text-white uppercase lg:h-[50px] lg:w-auto lg:px-[17px] lg:text-[14px]"
              >
                <CtaHoverLabel>{teamCta.button}</CtaHoverLabel>
                <Arrow src="/assets/images/branding-agency/arrow-up-right-white.png" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
