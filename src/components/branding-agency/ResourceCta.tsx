import type { ReactNode } from "react";
import Image from "next/image";
import { ResourceButton } from "@/components/branding-agency/ResourceButton";

/**
 * Homepage contact artwork, without the form.
 * The two PNGs crossfade where they overlap (the lower file fades in as
 * the upper file fades out). Cropping each one on its own leaves a hard
 * line, so they stay stacked the way the homepage does.
 * Desktop shows that stack through the logo gap as well, so the white above
 * the logos eases into blue the same way the blue eases out to white below.
 * Copy stays at the Figma coordinates (y 404 desktop, y 367 mobile).
 */
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

const defaultHeading = (
  <>
    Design your{" "}
    <span className="font-playfair font-medium italic">right to win.</span>
  </>
);

const defaultBody =
  "From strategy and design to development and marketing, we're ready when you are.";

export function ResourceCta({
  id,
  variant = "service",
  heading = defaultHeading,
  body = defaultBody,
  buttonLabel = "Book a strategy call with Design Asylum",
  buttonClassName = "!h-11 !min-h-11 !w-[327px] lg:!h-14 lg:!min-h-14 lg:!w-[384px]",
}: {
  id?: string;
  /** service keeps its band placement. location centers the copy in the blue section. */
  variant?: "service" | "location";
  heading?: ReactNode;
  body?: string;
  buttonLabel?: string;
  buttonClassName?: string;
} = {}) {
  const location = variant === "location";

  return (
    <section
      id={id}
      data-nav="dark"
      className={`relative isolate bg-white${id ? " scroll-mt-[100px]" : ""}`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden lg:-top-[150px]"
        aria-hidden="true"
      >
        <div className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 aspect-[1470/1374] lg:inset-x-0 lg:h-auto lg:w-full lg:translate-x-0">
          <CtaArtwork />
        </div>
        {/* Dissolves the top of the artwork into the white above the logos.
            The bottom of the artwork already fades to white on its own. */}
        <div
          className="absolute inset-x-0 top-0 h-[300px] lg:h-[380px]"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.94) 22%, rgba(255,255,255,0.62) 50%, rgba(255,255,255,0.22) 78%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto aspect-[390/1030] w-full max-w-[1470px] lg:aspect-[1470/1029]">

        <div
          className={
            location
              ? "absolute top-1/2 left-1/2 z-10 flex w-[min(360px,calc(100%-1.5rem))] -translate-x-1/2 -translate-y-[calc(50%+1.5rem)] flex-col items-center gap-10 text-center lg:w-[545px] lg:gap-[39px]"
              : "absolute top-[calc(50.44%-86px)] left-1/2 z-10 flex w-[min(360px,calc(100%-1.5rem))] -translate-x-1/2 flex-col items-center gap-10 text-center lg:top-[calc(33.82%-109px)] lg:w-[545px] lg:gap-[39px]"
          }
        >
          <div className="flex w-full flex-col items-center gap-3 lg:gap-6">
            <h2 className="font-figtree text-[32px] leading-[1.15] font-medium text-white lg:text-[44px] lg:leading-[44px]">
              {heading}
            </h2>
            <p className="font-satoshi text-[16px] leading-snug font-medium tracking-[-0.5px] text-white lg:text-[20.24px] lg:leading-[26px]">
              {body}
            </p>
          </div>

          <ResourceButton href="/#talk" size="lg" className={buttonClassName}>
            {buttonLabel}
          </ResourceButton>
        </div>
      </div>
    </section>
  );
}
