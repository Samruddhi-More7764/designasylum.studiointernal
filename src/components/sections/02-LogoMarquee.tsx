import Image from "next/image";
import { marqueeRow1, marqueeRow2, type ClientLogo } from "@/data/clients";

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
  // Desktop: 200×140. Mobile: fluid card in 2-col grid.
  const desktopW = logo.width * LOGO_SCALE;
  const desktopH = logo.height * LOGO_SCALE;
  const mobileW = logo.width * LOGO_SCALE_MOBILE;
  const mobileH = logo.height * LOGO_SCALE_MOBILE;

  return (
    <div
      className={`flex aspect-[10/7] w-full items-center justify-center overflow-hidden rounded-[12px] border border-[rgba(0,0,0,0.15)] bg-white lg:aspect-auto lg:h-[140px] lg:w-[200px] lg:shrink-0 ${className}`}
    >
      <Image
        src={logo.image}
        alt={logo.name}
        width={logo.width}
        height={logo.height}
        className="object-contain lg:hidden"
        style={{ width: mobileW, height: mobileH }}
      />
      <Image
        src={logo.image}
        alt=""
        aria-hidden="true"
        width={logo.width}
        height={logo.height}
        className="hidden object-contain lg:block"
        style={{ width: desktopW, height: desktopH }}
      />
    </div>
  );
}

function LogoRow({ logos }: { logos: ClientLogo[] }) {
  // Desktop only — each row centered within the 1130px container.
  return (
    <div className="hidden justify-center gap-6 lg:flex">
      {logos.map((logo, i) => (
        <LogoCard key={`${logo.name}-${i}`} logo={logo} />
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
export function LogoMarquee() {
  const mobileLogos = [...marqueeRow1, ...marqueeRow2];

  return (
    <section className="relative z-10 mt-0 bg-transparent px-5 pb-12 sm:px-6 sm:pb-16 lg:-mt-[calc(116/1470*100%)] lg:px-0 lg:pb-20">
      {/* Mobile 2-col grid — 9 cards; last card sits in the right column */}
      <div className="mx-auto grid w-full max-w-[360px] grid-cols-2 gap-3 sm:gap-4 lg:hidden">
        {mobileLogos.map((logo, i) => (
          <LogoCard
            key={`m-${logo.name}-${i}`}
            logo={logo}
            className={i === mobileLogos.length - 1 ? "col-start-2" : ""}
          />
        ))}
      </div>

      {/* Desktop rows — unchanged */}
      <div className="mx-auto hidden h-[304px] w-full max-w-[1130px] flex-col gap-6 lg:flex">
        <LogoRow logos={marqueeRow1} />
        <LogoRow logos={marqueeRow2} />
      </div>
    </section>
  );
}
