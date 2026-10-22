import Image from "next/image";
import { distributeLogosTriangle, getClientLogoLayouts } from "@/cms/content";
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
        unoptimized
        className="max-h-[60%] max-w-[75%] object-contain lg:max-h-[70%] lg:max-w-[80%]"
        sizes="(max-width: 1023px) 150px, 200px"
      />
    </div>
  );
}

function LogoRow({ logos }: { logos: ClientLogo[] }) {
  // Desktop only — each row centered within the 1130px container.
  return (
    <div className="flex justify-center gap-6">
      {logos.map((logo, i) => (
        <LogoCard key={`${logo.name}-${i}-${logo.image}`} logo={logo} />
      ))}
    </div>
  );
}

/**
 * Client logos — Frame 2095588032 (254:618).
 *
 * Supports dynamic logo counts with auto-centering in a triangle / pyramid layout:
 * - 1 logo: 1 centered card
 * - 2 logos: 1 row with 2 cards centered
 * - 3 logos: 1 card on top, 2 cards below (triangle)
 * - 4-9 logos: balanced centered rows
 */
export async function LogoMarquee({
  placement = "home",
  logos,
}: {
  /** Service and location pages use Figma gaps; homepage keeps its own pull and padding. */
  placement?: "home" | "service" | "location";
  /** When set, these logos replace the homepage list. */
  logos?: { row1: ClientLogo[]; row2: ClientLogo[] } | ClientLogo[];
} = {}) {
  let allLogos: ClientLogo[] = [];
  if (Array.isArray(logos)) {
    allLogos = logos;
  } else if (logos) {
    allLogos = [...(logos.row1 || []), ...(logos.row2 || [])];
  } else {
    const layouts = await getClientLogoLayouts();
    if (layouts.logos && layouts.logos.length > 0) {
      allLogos = layouts.logos;
    } else {
      allLogos = [...layouts.marqueeRow1, ...layouts.marqueeRow2];
    }
  }

  let marqueeRow1: ClientLogo[] = [];
  let marqueeRow2: ClientLogo[] = [];

  if (allLogos.length === 9) {
    marqueeRow1 = allLogos.slice(0, 4);
    marqueeRow2 = allLogos.slice(4);
  } else {
    const distributed = distributeLogosTriangle(allLogos);
    marqueeRow1 = distributed.row1;
    marqueeRow2 = distributed.row2;
  }
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
      {/* Mobile (<lg) */}
      <div className="lg:hidden">
        {allLogos.length === 1 && (
          <div className="mx-auto flex w-full max-w-[200px] justify-center">
            <LogoCard logo={allLogos[0]} />
          </div>
        )}
        {allLogos.length === 2 && (
          <div
            className={`mx-auto flex w-full justify-center gap-3 sm:gap-4 ${
              service ? "max-w-[292px]" : "max-w-[358px]"
            }`}
          >
            <div className="w-[calc(50%-6px)] max-w-[160px]">
              <LogoCard logo={allLogos[0]} />
            </div>
            <div className="w-[calc(50%-6px)] max-w-[160px]">
              <LogoCard logo={allLogos[1]} />
            </div>
          </div>
        )}
        {allLogos.length === 3 && (
          <div
            className={`mx-auto flex w-full flex-col items-center gap-3 sm:gap-4 ${
              service ? "max-w-[292px]" : "max-w-[358px]"
            }`}
          >
            <div className="w-[calc(50%-6px)] max-w-[160px]">
              <LogoCard logo={allLogos[0]} />
            </div>
            <div
              className="flex w-full justify-center gap-3 sm:gap-4"
            >
              <div className="w-[calc(50%-6px)] max-w-[160px]">
                <LogoCard logo={allLogos[1]} />
              </div>
              <div className="w-[calc(50%-6px)] max-w-[160px]">
                <LogoCard logo={allLogos[2]} />
              </div>
            </div>
          </div>
        )}
        {allLogos.length > 3 && (
          <div
            className={`mx-auto grid w-full grid-cols-2 ${
              service ? "max-w-[292px] gap-3" : "max-w-[358px] gap-3 sm:gap-4"
            }`}
          >
            {allLogos.map((logo, i) => (
              <LogoCard
                key={`m-${logo.name}-${i}-${logo.image}`}
                logo={logo}
                className={
                  i === allLogos.length - 1 && allLogos.length % 2 === 1
                    ? "col-span-2 mx-auto w-1/2"
                    : ""
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop (lg+) */}
      <div className="mx-auto hidden w-full max-w-[1130px] flex-col gap-6 lg:flex">
        {marqueeRow1.length > 0 && <LogoRow logos={marqueeRow1} />}
        {marqueeRow2.length > 0 && <LogoRow logos={marqueeRow2} />}
      </div>
    </section>
  );
}
