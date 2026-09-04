import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceStackIcon } from "@/components/ui/ServiceIcons";
import { services, type Service } from "@/data/services";

function ServiceIcon({ service }: { service: Service }) {
  // Figma: most services use the 3-stack isometric square.
  // Website development uses the Carbon development mark (57×57 export).
  if (service.icon === "grid") {
    return (
      <Image
        src="/assets/images/service-development.png"
        alt=""
        width={57}
        height={57}
        aria-hidden="true"
        className="h-[57px] w-[56px] shrink-0 object-contain lg:h-[57px] lg:w-[57px]"
      />
    );
  }

  return (
    <ServiceStackIcon className="size-9 shrink-0 text-black sm:size-11 lg:size-[56px]" />
  );
}

function ServiceCard({ service }: { service: Service }) {
  // Desktop: 294×300. Mobile: fluid card in 2-col grid.
  return (
    <div className="flex h-auto min-h-[180px] w-full max-w-[294px] flex-col justify-between gap-6 rounded-lg border border-black/10 bg-[#D5D5D533] p-4 sm:min-h-[220px] sm:p-5 lg:h-[300px] lg:gap-0 lg:p-[24.5px]">
      <ServiceIcon service={service} />
      <div className="flex flex-col gap-1">
        <h3 className="font-figtree text-[22px] font-normal leading-[1.2] tracking-[-0.8px] text-black sm:text-[28px] lg:text-[36px] lg:leading-[45.21px] lg:tracking-[-1.51px]">
          {service.name}
        </h3>
        <p className="font-satoshi text-[12px] font-normal leading-[1.4] tracking-[-0.5px] text-black sm:text-sm lg:text-base lg:leading-[21.9px]">
          {service.tags.join(" \u00b7 ")}
        </p>
      </div>
    </div>
  );
}

/**
 * Services — Homepage: centered heading (153×63) + subheading (493×40 @ 78%)
 * + 3×2 card grid (930×624, gap 24, cards 294×300).
 *
 * `variant`:
 * - "default" (Homepage) — solid white like Client Hub on desktop; mobile
 *   keeps white→transparent fade so ContactForm can blend underneath.
 * - "plain" (Client Hub) — clean solid white background, no overlays.
 */
export function Services({
  variant = "default",
}: {
  variant?: "default" | "plain";
}) {
  return (
    <section
      className={`relative z-10 overflow-hidden px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px] ${
        variant === "plain"
          ? "bg-white"
          : "bg-white max-lg:bg-gradient-to-b max-lg:from-white max-lg:from-55% max-lg:via-white/90 max-lg:via-75% max-lg:to-transparent"
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-[930px] flex-col items-center gap-8 lg:gap-12">
        <div className="flex flex-col items-center gap-[10px] px-1 text-center">
          <SectionHeading className="text-[32px] font-normal leading-[1.2] tracking-[-1.5px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
            Services
          </SectionHeading>
          <p className="w-full max-w-[493px] font-satoshi text-[15px] font-medium leading-snug tracking-[-0.5px] text-black/78 sm:text-[18px] lg:h-10 lg:text-[20px] lg:leading-none">
            Brand-first, end to end strategy through launch, built to be
            impossible to ignore.
          </p>
        </div>

        {/* Mobile: 2×3. Desktop: 930×624 3×2 */}
        <div className="grid w-full grid-cols-2 justify-items-center gap-3 sm:gap-4 lg:h-[624px] lg:w-[930px] lg:grid-cols-3 lg:justify-items-start lg:gap-6">
          {services.map((service) => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
