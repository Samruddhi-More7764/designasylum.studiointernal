import type { Metadata } from "next";
import Image from "next/image";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { Accent } from "@/components/ui/SectionHeading";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { CareersApplicationForm } from "@/components/why-design-asylum/CareersApplicationForm";
import { LifeOutside } from "@/components/why-design-asylum/LifeOutside";
import { getCareersPage } from "@/cms/careersPage";
import { getFooter } from "@/cms/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Why Design Asylum",
  description:
    "Work alongside strategists, designers and developers on ambitious brands, complex problems and work that changes how companies are seen.",
};

/** Stops from careers frame 1454:128390. Both desktop radial layers share them. */
const CAREERS_RADIAL_STOPS =
  "rgb(255,255,255) 25.895%, rgb(200,230,251) 35.166%, rgb(145,205,248) 44.438%, rgb(91,180,244) 53.709%, rgb(63,168,242) 58.345%, rgb(36,155,240) 62.981%, rgb(22,127,238) 76.442%, rgb(8,99,237) 89.904%, rgba(52,129,244,0) 100%";

function CtaArtwork() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 aspect-[1470/839]">
        <Image
          src="/assets/images/contact-form-bg-top.png"
          alt=""
          fill
          sizes="1470px"
          className="object-cover object-top"
        />
      </div>
      <div className="absolute inset-x-0 top-[calc(604/1374*100%)] aspect-[1470/770]">
        <Image
          src="/assets/images/contact-form-bg-bottom.png"
          alt=""
          fill
          sizes="1470px"
          className="object-cover object-top"
        />
      </div>
    </>
  );
}

export default async function WhyDesignAsylumPage() {
  const [page, footer] = await Promise.all([getCareersPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <header className="bg-white px-4 pt-10 lg:pt-20">
          <div className="mx-auto flex w-full max-w-[1136px] flex-col items-center gap-4 text-center">
            <Breadcrumbs items={[{ label: "Home", href: "/" }]} current={page.breadcrumbCurrent} />
            <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:text-[56px] lg:tracking-[-0.5px]">
              {page.titleBefore}
              <Accent className="text-[32px] tracking-[-2.09px] lg:text-[56px]">{page.titleAccent}</Accent>
              {page.titleAfter}
            </h1>
            <p className="max-w-[842px] font-satoshi text-[12px] leading-[1.2] font-normal tracking-[-0.5px] text-black uppercase lg:text-[14px]">
              {page.intro}
            </p>
          </div>
          <div className="relative mx-auto mt-10 h-[220px] w-full max-w-[1470px] overflow-hidden bg-black lg:mt-16 lg:h-[831px]">
            {page.heroImage ? (
              <Image src={page.heroImage} alt="" fill sizes="1470px" className="object-cover" />
            ) : null}
          </div>
        </header>

        <section className="bg-white px-5 pt-16 sm:px-8 lg:px-[60px] lg:pt-[80px]">
          <div className="mx-auto grid w-full max-w-[1350px] items-start gap-10 lg:grid-cols-[358px_minmax(0,1fr)] lg:gap-x-[120px]">
            <div className="flex flex-col items-center gap-8 lg:items-start lg:gap-16">
              <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-left lg:text-[44px] lg:tracking-[-2.09px]">
                {page.benefitsBefore}
                <Accent className="text-[32px] tracking-[-2.09px] lg:text-[44px]">{page.benefitsAccent}</Accent>
                {page.benefitsAfter}
              </h2>
              <div className="relative hidden h-[398px] w-[358px] overflow-hidden lg:block">
                <Image
                  src={page.studioImage}
                  alt=""
                  fill
                  sizes="358px"
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
              {page.benefits.map((item, index) => (
                <li
                  key={item.title}
                  className="w-[280px] shrink-0 snap-start border-l border-black/30 px-4 lg:w-auto"
                  style={{ gridColumn: index % 2 === 0 ? 1 : 2, gridRow: index + 1 }}
                >
                  <article className="flex flex-col gap-[73px] py-2 lg:gap-16 lg:py-6">
                    <img
                      src="/assets/images/why-design-asylum/benefit-icon.svg"
                      alt=""
                      width={64}
                      height={64}
                      className="size-12 lg:size-16"
                    />
                    <div className="flex flex-col gap-3">
                      <h3 className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.5px] text-[#1f1f1f] lg:text-[32px]">
                        {item.title}
                      </h3>
                      <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.08px] text-[#1f1f1f] lg:text-[20px] lg:leading-[24px]">
                        {item.body}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LifeOutside
          titleBefore={page.lifeBefore}
          titleAccent={page.lifeAccent}
          titleAfter={page.lifeAfter}
          dek={page.lifeDek}
          slides={page.lifeSlides}
        />

        <section className="bg-white px-5 pt-16 sm:px-8 lg:px-[60px] lg:pt-[120px]">
          <h2 className="mx-auto max-w-[610px] text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-[44px] lg:tracking-[-2.09px]">
            {page.teamBefore}
            <Accent className="text-[32px] tracking-[-2.09px] lg:text-[44px]">{page.teamAccent}</Accent>
            {page.teamAfter}
          </h2>
          <div className="mx-auto mt-8 flex w-full max-w-[1350px] flex-col gap-6 lg:mt-16 lg:flex-row lg:gap-3">
            {page.quotes.map((person) => (
              <article
                key={person.name}
                className="flex flex-1 flex-col gap-8 rounded-xl bg-[#f3f3f3] p-6 lg:min-h-[450px] lg:flex-row lg:gap-10"
              >
                <div className="flex flex-1 flex-col justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="relative size-[76px] shrink-0 overflow-hidden rounded-xl bg-[#d9d9d9]">
                      {person.image ? (
                        <Image src={person.image} alt="" fill sizes="76px" className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-figtree text-[20px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize">
                        {person.name}
                      </p>
                      <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize">
                        {person.role}
                      </p>
                    </div>
                  </div>
                  <p className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] lg:text-[32px] lg:tracking-[-2.09px]">
                    {person.quote}
                  </p>
                </div>
                <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.08px] text-[#1f1f1f] lg:max-w-[203px]">
                  {person.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section data-nav="dark" className="relative isolate mt-16 bg-white lg:mt-[120px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden="true">
            <div className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 aspect-[1470/1374]">
              <CtaArtwork />
            </div>
            <div
              className="absolute inset-x-0 top-0 h-[180px]"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.72) 42%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
            <div
              className="absolute inset-x-0 top-0"
              style={{
                height: "71.137%",
                background: `radial-gradient(ellipse 175.707% 95.654% at 50% 2.399%, ${CAREERS_RADIAL_STOPS})`,
              }}
            />
            <div
              className="absolute inset-x-0"
              style={{
                top: "48.299%",
                height: "51.701%",
                background: `radial-gradient(ellipse 175.707% 95.654% at 50% 97.6%, ${CAREERS_RADIAL_STOPS})`,
              }}
            />
          </div>
          <div className="relative z-10 mx-auto aspect-[390/885] w-full max-w-[1470px] lg:aspect-[1470/1029]">
            <div className="absolute top-[25%] left-1/2 flex w-[min(360px,calc(100%-2rem))] -translate-x-1/2 flex-col items-center gap-6 text-center lg:top-[calc(404/1029*100%)] lg:w-[545px] lg:translate-y-0 lg:gap-[39px]">
              <div className="flex w-full flex-col items-center gap-4 lg:w-[822px] lg:gap-6">
                <h2 className="font-figtree text-[32px] leading-[1.2] font-medium tracking-[-2px] text-white lg:h-[44px] lg:min-h-0 lg:text-[44px] lg:leading-[44px] lg:tracking-[-2px] lg:whitespace-nowrap">
                  {page.rolesBefore}
                  <Accent className="text-[32px] font-normal tracking-[-2.09px] lg:text-[44px] lg:font-medium lg:tracking-[-2px]">
                    {page.rolesAccent}
                  </Accent>
                  {page.rolesAfter}
                </h2>
                <p className="font-satoshi text-[16px] leading-snug font-medium tracking-[-0.1px] text-white lg:w-full lg:text-[20.243px] lg:leading-[25.902px] lg:tracking-[-0.1012px]">
                  {page.rolesBody}
                </p>
              </div>
              <a
                href="#apply"
                className="group inline-flex h-14 w-[189px] items-center justify-center gap-2 rounded-pill border border-black bg-black px-5 font-satoshi text-[14px] font-medium leading-4 tracking-[-0.5px] text-white uppercase"
              >
                <CtaHoverLabel>{page.rolesButton}</CtaHoverLabel>
                <Image
                  src="/assets/images/branding-agency/arrow-up-right-white.png"
                  alt=""
                  width={9}
                  height={9}
                  unoptimized
                  aria-hidden="true"
                  className={`h-[9px] w-[9px] ${ctaArrowClass}`}
                />
              </a>
            </div>
          </div>
        </section>

        <CareersApplicationForm
          titleBefore={page.formBefore}
          titleAccent={page.formAccent}
          titleAfter={page.formAfter}
          dek={page.formDek}
          interests={page.interests}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
