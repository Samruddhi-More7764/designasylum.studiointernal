import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";

const ABOUT_POINTS = [
  {
    number: "01",
    text: "A strategy-led studio with real depth in deeptech, fintech and enterprise SaaS. Known for a structured process that helps technical companies pin down positioning, identity and digital experience.",
  },
  {
    number: "02",
    text: "A proven track record of helping startups raise on the back of sharper brand positioning, not just a prettier logo.",
  },
  {
    number: "03",
    text: "Brand strategy and identity for B2B teams that need clarity fast. We work as a consultant, not a vendor, finding the underlying problem, not just filling the brief.",
  },
] as const;

/**
 * About points — Frame 2095588402 / Homepage.
 *
 * Desktop (lg+): baked photo (text in image) + absolutely positioned CTA — LOCKED.
 * Mobile (<lg): Figma mobile crop (image 8) + live 01/02/03 stack + CTA +
 * desktop asterisk crop (about-points-asterisk.png from about-points.png).
 */
export function AboutPoints() {
  return (
    <section className="relative w-full overflow-hidden lg:aspect-[1470/913]">
      {/* Mobile background — Figma image 8 (390×658 crop) */}
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <Image
          src="/assets/images/about-points-mobile.png"
          alt=""
          fill
          priority={false}
          sizes="100vw"
          className="object-cover object-[40%_36%]"
        />
      </div>

      {/* Desktop background — original baked asset + crop — unchanged */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="/assets/images/about-points.png"
          alt=""
          fill
          sizes="(min-width: 1470px) 1470px, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Mobile asterisk — crop of the same glyph baked into desktop about-points.png */}
      <Image
        src="/assets/images/about-points-asterisk.png"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        className="pointer-events-none absolute top-[28px] right-[28px] z-30 h-8 w-8 select-none lg:hidden"
      />

      {/* Mobile live copy */}
      <div className="relative z-10 flex min-h-[658px] flex-col px-5 pb-14 pt-20 sm:min-h-[720px] sm:px-6 sm:pb-16 sm:pt-24 lg:hidden">
        <ol className="flex max-w-[300px] flex-col gap-10">
          {ABOUT_POINTS.map((point) => (
            <li key={point.number} className="flex flex-col gap-2.5">
              <span className="font-figtree text-[28px] font-medium leading-none tracking-[-0.5px] text-white">
                {point.number}
              </span>
              <p className="font-satoshi text-[13px] font-normal leading-[1.45] tracking-[-0.2px] text-white">
                {point.text}
              </p>
            </li>
          ))}
        </ol>

        <PillButton
          variant="invert"
          href="#contact"
          className="mt-12 h-12 w-full max-w-[318px] self-start !border-white !bg-white !text-black"
        >
          Book a brand strategy session
        </PillButton>
      </div>

      {/* Desktop CTA — Figma % position inside 1470×913 — unchanged */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <PillButton
          variant="light"
          href="#contact"
          className="pointer-events-auto absolute top-[calc(803/913*100%)] left-[calc(1068/1470*100%)] h-[calc(50/913*100%)] w-[calc(318.19/1470*100%)] min-w-[220px] !border-black !bg-white !text-black"
        >
          Book a brand strategy session
        </PillButton>
      </div>

      <div className="sr-only">
        <h2>About Design Asylum</h2>
        <ol>
          {ABOUT_POINTS.map((point) => (
            <li key={point.number}>{point.text}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
