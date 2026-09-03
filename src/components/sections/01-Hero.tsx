import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";

/**
 * Hero — Group 1707480280 (254:98) inside Homepage Frame 2095588027.
 *
 * Desktop (lg+): absolute %-positioned composition — unchanged.
 * Mobile (<lg): stacked/absolute composition matching Homepagemobile @ 390px.
 */
export function Hero() {
  return (
    <section className="relative z-0 h-[720px] w-full overflow-visible bg-white sm:h-[780px] lg:aspect-[1470/1225] lg:h-auto lg:min-h-0">
      {/* Rectangle 1 — hero photograph, rotated 180° */}
      <div
        className="absolute inset-x-0 top-0 h-[58%] rotate-180 overflow-hidden lg:top-[calc(-160/1225*100%)] lg:aspect-[1470/831] lg:h-auto"
        aria-hidden="true"
      >
        <Image
          src="/assets/images/hero.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_35%] lg:object-center"
        />
      </div>

      {/*
        Rectangle 6 — fade overlays (Figma exports), not CSS gradients.
        Mobile: 390×636 Figma crop at native aspect (no vertical stretch).
        Previous h-[135%] + object-cover stretched the asset so the white
        band landed below the logo cards and left cyan at the Hero edge.
        Natural height keeps blue→cyan through the quote and near-white
        before LogoMarquee. Desktop (lg+): unchanged.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[40%] aspect-[390/636] w-full lg:hidden"
        aria-hidden="true"
      >
        <Image
          src="/assets/images/hero-fade-overlay-mobile.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-fill"
        />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-[calc(429/1225*100%)] hidden h-[calc(636/1225*100%)] lg:block"
        aria-hidden="true"
      >
        <Image
          src="/assets/images/hero-fade-overlay.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-fill"
        />
      </div>

      <h1 className="relative z-10 max-w-[20ch] px-5 pt-28 font-figtree text-[32px] font-medium leading-[1.05] tracking-[-1.5px] text-white sm:px-6 sm:text-3xl sm:tracking-[-2px] lg:absolute lg:top-[15.35%] lg:left-[4.08%] lg:w-[592px] lg:max-w-[40.27%] lg:px-0 lg:pt-0 lg:text-hero lg:leading-none">
        Strategic rebranding &amp; digital build for{" "}
        <Accent className="text-white">brands with nerve</Accent>
      </h1>

      <div className="absolute top-[48%] right-5 z-10 flex w-[min(100%-2.5rem,240px)] flex-col items-end gap-5 text-right sm:right-6 lg:top-[32.73%] lg:left-[73.47%] lg:right-auto lg:w-[19.73%] lg:items-start lg:gap-6 lg:text-left">
        <p className="font-satoshi text-[15px] font-normal leading-relaxed text-white/78 sm:text-body lg:leading-none">
          Branding is about the story, confidence, and clarity that makes your
          audience say &ldquo;yes&rdquo;, your team eager to join, and investors
          ready to invest.
        </p>

        <PillButton variant="light" size="sm">
          Get started
        </PillButton>
      </div>

      <p className="absolute bottom-[7%] left-1/2 z-10 w-[min(100%-2.5rem,242px)] -translate-x-1/2 text-center font-figtree text-[16px] font-normal leading-[37.71px] tracking-[-1px] text-white lg:top-[calc(673/1225*100%)] lg:bottom-auto lg:w-auto lg:whitespace-nowrap lg:text-quote lg:font-medium">
        &ldquo;And that&apos;s when the room went quiet.&rdquo;
      </p>
    </section>
  );
}
