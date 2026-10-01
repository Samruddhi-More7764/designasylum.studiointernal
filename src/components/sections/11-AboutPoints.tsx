import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";

const ABOUT_POINTS = [
  {
    number: "01",
    text: "A strategy-led studio with real depth in deeptech, fintech and enterprise SaaS. Known for a structured process that helps technical companies pin down positioning, identity and digital experience.",
    top: 60,
    left: 60,
    width: 342,
    height: 131,
  },
  {
    number: "02",
    text: "A proven track record of helping startups raise on the back of sharper brand positioning, not just a prettier logo.",
    top: 352,
    left: 564,
    width: 342,
    height: 113,
  },
  {
    number: "03",
    text: "Brand strategy and identity for B2B teams that need clarity fast. We work as a consultant, not a vendor, finding the underlying problem, not just filling the brief.",
    top: 626,
    left: 1068,
    width: 342,
    height: 153,
  },
] as const;

/** Visible frame the pointer positions are measured against. */
const FRAME_W = 1470;
const FRAME_H = 913;

/**
 * About points. The photograph is only the still. 01 / 02 / 03 are HTML
 * on top of it, positioned from the 1470×913 frame.
 */
export function AboutPoints() {
  return (
    <section
      data-nav="dark"
      className="relative w-full overflow-hidden lg:aspect-[1470/913]"
    >
      <div className="absolute inset-0 lg:hidden" aria-hidden="true">
        <Image
          src="/assets/images/about-points-photo.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
      </div>

      <div
        className="absolute hidden lg:block"
        style={{
          left: `${(-106 / FRAME_W) * 100}%`,
          top: `${(-171 / FRAME_H) * 100}%`,
          width: `${(1646 / FRAME_W) * 100}%`,
          height: `${(1123 / FRAME_H) * 100}%`,
        }}
        aria-hidden="true"
      >
        <Image
          src="/assets/images/about-points-photo.png"
          alt=""
          fill
          sizes="(min-width: 1470px) 1646px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="relative z-10 flex min-h-[658px] flex-col px-5 pb-14 pt-20 sm:min-h-[720px] sm:px-6 sm:pb-16 sm:pt-24 lg:hidden">
        <ol className="flex max-w-[300px] flex-col gap-10">
          {ABOUT_POINTS.map((point) => (
            <li key={point.number} className="flex flex-col gap-[7px]">
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
          href="/#talk"
          className="mt-12 h-12 w-full max-w-[318px] self-start !border-white !bg-white !text-black"
        >
          Book a brand strategy session
        </PillButton>
      </div>

      <ol className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        {ABOUT_POINTS.map((point) => (
          <li
            key={point.number}
            className="absolute flex flex-col gap-[7px]"
            style={{
              top: `${(point.top / FRAME_H) * 100}%`,
              left: `${(point.left / FRAME_W) * 100}%`,
              width: `${(point.width / FRAME_W) * 100}%`,
              height: `${(point.height / FRAME_H) * 100}%`,
            }}
          >
            <span className="font-figtree text-[28px] font-medium leading-none tracking-[-0.5px] text-white">
              {point.number}
            </span>
            <p className="font-satoshi text-[15px] font-normal leading-[1.35] tracking-[-0.2px] text-white">
              {point.text}
            </p>
          </li>
        ))}
      </ol>

      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <PillButton
          variant="light"
          href="/#talk"
          className="pointer-events-auto absolute top-[calc(803/913*100%)] left-[calc(1068/1470*100%)] h-[calc(50/913*100%)] w-[calc(318.19/1470*100%)] min-w-[220px] !border-black !bg-white !text-black"
        >
          Book a brand strategy session
        </PillButton>
      </div>
    </section>
  );
}
