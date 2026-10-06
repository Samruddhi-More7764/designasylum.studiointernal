import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { getClientsIndex } from "@/cms/clientsIndex";
import { getFooter } from "@/cms/content";
import { clientCards, clientsCta } from "@/data/clientsIndexPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Clients",
  description: "Worked with companies from a diverse set of industries.",
};

export default async function ClientsPage() {
  const [page, footer] = await Promise.all([getClientsIndex(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <section className="bg-white px-4 pt-6 pb-[120px] lg:px-[60px] lg:pt-16 lg:pb-[160px]">
          <div className="mx-auto flex w-full max-w-[1022px] flex-col items-center">
            <Breadcrumbs items={[{ label: "Home", href: "/" }]} current={page.breadcrumbCurrent} />
            <h1 className="mt-8 max-w-[348px] text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:mt-8 lg:max-w-[570px] lg:text-[44px] lg:leading-none lg:tracking-[-2.0865px]">
              {page.heading}
            </h1>

            <ul className="mt-8 grid w-full grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-3 lg:gap-x-4 lg:gap-y-12">
              {page.cards.map((card) => (
                <li key={card.id}>
                  <a href={card.href || "#"} className="group block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-[13px] lg:rounded-xl">
                      <img
                        src={card.image}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                      {card.image === clientCards[0].image ? (
                        <div className="pointer-events-none absolute inset-[40.91%_12.68%_40.91%_12.42%] flex items-center">
                          <img
                            src="/assets/images/clients/logo-left.svg"
                            alt=""
                            className="h-full w-[51.1%] object-contain"
                          />
                          <img
                            src="/assets/images/clients/logo-right.svg"
                            alt=""
                            className="h-full w-[48.9%] object-contain"
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-4 flex flex-col gap-1 text-black">
                      <p className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.5071px]">
                        {card.name}
                      </p>
                      <p className="font-satoshi text-[20px] leading-[26px] font-normal tracking-[-0.1px]">
                        {card.service}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-[120px] flex flex-col items-center gap-3 text-center lg:mt-[240px] lg:gap-8">
              <h2 className="max-w-[268px] font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black lg:max-w-none lg:text-[60px] lg:leading-[72px] lg:tracking-[-3px]">
                {clientsCta.heading}
              </h2>
              <a
                href={clientsCta.href}
                className="group inline-flex h-11 w-[164px] items-center justify-center gap-2 rounded-pill border border-black bg-black px-5 font-satoshi text-[12px] leading-4 font-medium text-white uppercase lg:h-[50px] lg:w-auto lg:px-[17px] lg:text-[14px]"
              >
                <CtaHoverLabel>{clientsCta.button}</CtaHoverLabel>
                <img
                  src="/assets/images/branding-agency/arrow-up-right-white.png"
                  alt=""
                  width={10}
                  height={13}
                  className={`h-[13px] w-[10px] ${ctaArrowClass}`}
                />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
