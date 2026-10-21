import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { CareersApplicationForm } from "@/components/why-design-asylum/CareersApplicationForm";
import { BenefitCarousel } from "@/components/why-design-asylum/BenefitCarousel";
import { LifeOutside } from "@/components/why-design-asylum/LifeOutside";
import { getCareersPage } from "@/cms/careersPage";
import { getFooter } from "@/cms/content";

export const revalidate = 120;

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
              <SplitHeading
                before={page.titleBefore}
                accent={page.titleAccent}
                after={page.titleAfter}
                accentClassName="text-[32px] tracking-[-2.09px] lg:text-[56px]"
              />
            </h1>
            <p className="max-w-[842px] font-satoshi text-[12px] leading-[1.2] font-normal tracking-[-0.5px] text-black uppercase lg:text-[14px]">
              {page.intro}
            </p>
          </div>
          <div className="relative mx-auto mt-10 aspect-[389/220] w-full max-w-[1470px] overflow-hidden bg-black lg:mt-16 lg:aspect-auto lg:h-[831px]">
            {page.heroImage ? (
              <Image src={page.heroImage} alt="" fill sizes="1470px" className="object-cover" />
            ) : null}
          </div>
        </header>

        <section className="bg-white px-5 pt-16 sm:px-8 lg:px-[60px] lg:pt-[80px]">
          <div className="mx-auto grid w-full max-w-[1350px] items-start gap-10 lg:grid-cols-[358px_minmax(0,1fr)] lg:gap-x-[120px]">
            <div className="flex flex-col items-center gap-8 lg:sticky lg:top-28 lg:items-start lg:gap-16 lg:self-start">
              <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-left lg:text-[44px] lg:tracking-[-2.09px]">
                <SplitHeading
                  before={page.benefitsBefore}
                  accent={page.benefitsAccent}
                  after={page.benefitsAfter}
                  accentClassName="text-[32px] tracking-[-2.09px] lg:text-[44px]"
                />
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

            <BenefitCarousel items={page.benefits} />
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
            <SplitHeading
              before={page.teamBefore}
              accent={page.teamAccent}
              after={page.teamAfter}
              accentClassName="text-[32px] tracking-[-2.09px] lg:text-[44px]"
            />
          </h2>
          <div className="mx-auto mt-8 flex w-full max-w-[1350px] flex-col gap-6 lg:mt-16 lg:flex-row lg:gap-3">
            {page.quotes.map((person) => (
              <article
                key={person.name}
                className="flex min-h-[487px] flex-1 flex-col justify-between gap-8 rounded-xl bg-[#f3f3f3] p-6 lg:min-h-[450px] lg:flex-row lg:justify-start lg:gap-10"
              >
                <div className="flex flex-1 flex-col justify-between gap-8">
                  <div className="flex flex-col gap-8">
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
                    <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.08px] text-[#1f1f1f] lg:hidden">
                      {person.body}
                    </p>
                  </div>
                  <p className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2.09px] text-[#05201F]">
                    {person.quote}
                  </p>
                </div>
                <p className="hidden font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.08px] text-[#1f1f1f] lg:block lg:max-w-[203px]">
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
                  <SplitHeading
                    before={page.rolesBefore}
                    accent={page.rolesAccent}
                    after={page.rolesAfter}
                    accentClassName="text-[32px] font-normal tracking-[-2.09px] lg:text-[44px] lg:font-medium lg:tracking-[-2px]"
                  />
                </h2>
                <p className="font-satoshi text-[16px] leading-snug font-medium tracking-[-0.1px] text-white lg:w-full lg:text-[20.243px] lg:leading-[25.902px] lg:tracking-[-0.1012px]">
                  {page.rolesBody}
                </p>
              </div>
              <Link
                href="/open-roles"
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
              </Link>
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
