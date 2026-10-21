import Image from "next/image";
import { getClientLogoLayouts } from "@/cms/content";
import type { ClientLogo } from "@/data/clients";

// The raw dimensions in data/clients.ts (192×49 / 191×51 / 193×82 / 176×101)
// are each logo's Figma *node* bounding box, not its intended on-screen size
// inside the card — rendering them 1:1 leaves almost no whitespace (the
// widest logo fills ~96% of the 200px card width). Scaling every logo down
// by the same factor shrinks them uniformly while preserving each one's
// original aspect ratio, so relative proportions between logos stay intact.
const LOGO_SCALE = 0.62;
const LOGO_SCALE_MOBILE = 0.42;

function LogoCard({
  logo,
  className = "",
}: {
  logo: ClientLogo;
  className?: string;
}) {
  const desktopW = Math.round(logo.width * LOGO_SCALE);
  const desktopH = Math.round(logo.height * LOGO_SCALE);

  return (
    <div
      className={`flex aspect-[10/7] w-full items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(0,0,0,0.15)] bg-white lg:aspect-auto lg:h-[140px] lg:w-[200px] lg:shrink-0 ${className}`}
    >
      <Image
        src={logo.image}
        alt={logo.name}
        width={desktopW}
        height={desktopH}
        className="max-h-[60%] max-w-[75%] object-contain lg:max-h-[70%] lg:max-w-[80%]"
        sizes="(max-width: 1023px) 150px, 200px"
      />
    </div>
  );
}

function LogoRow({ logos }: { logos: ClientLogo[] }) {
  // Desktop only — each row centered within the 1130px container.
  return (
    <div className="hidden justify-center gap-6 lg:flex">
      {logos.map((logo, i) => (
        <LogoCard key={`${logo.name}-${i}-${logo.image}`} logo={logo} />
      ))}
    </div>
  );
}

/**
 * Client logos — Frame 2095588032 (254:618).
 *
 * Desktop (lg+): 1130×304, gap 24, two static rows (4 + 5).
 * Mobile (<lg): 2-column grid matching Homepagemobile reference.
 */
export async function LogoMarquee({
  placement = "home",
  logos,
}: {
  /** Service and location pages use Figma gaps; homepage keeps its own pull and padding. */
  placement?: "home" | "service" | "location";
  /** When set, these logos replace the homepage list. Used by the branding strategy page. */
  logos?: { row1: ClientLogo[]; row2: ClientLogo[] };
} = {}) {
  const { marqueeRow1, marqueeRow2 } = logos
    ? { marqueeRow1: logos.row1, marqueeRow2: logos.row2 }
    : await getClientLogoLayouts();
  const mobileLogos = [...marqueeRow1, ...marqueeRow2];
  const service = placement === "service";
  const location = placement === "location";

  return (
    <section
      className={
        location
          ? "relative z-10 bg-white px-4 py-[120px] lg:px-0 lg:py-[200px]"
          : service
            ? "relative z-10 bg-white px-4 pb-0 lg:bg-transparent lg:px-0 lg:pb-[150px]"
            : "relative z-10 mt-0 bg-transparent px-5 pb-12 sm:px-6 sm:pb-16 lg:-mt-[calc(116/1470*100%)] lg:px-0 lg:pb-20"
      }
    >
      <div
        className={`mx-auto grid w-full grid-cols-2 lg:hidden ${
          service ? "max-w-[292px] gap-3" : "max-w-[358px] gap-3 sm:gap-4"
        }`}
      >
        {mobileLogos.map((logo, i) => (
          <LogoCard
            key={`m-${logo.name}-${i}-${logo.image}`}
            logo={logo}
            className={i === mobileLogos.length - 1 ? "col-start-2" : ""}
          />
        ))}
      </div>

      <div className="mx-auto hidden h-[304px] w-full max-w-[1130px] flex-col gap-6 lg:flex">
        <LogoRow logos={marqueeRow1} />
        <LogoRow logos={marqueeRow2} />
      </div>
    </section>
  );
}
