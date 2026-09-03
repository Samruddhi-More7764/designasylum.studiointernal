import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";
import { sevenloopProjectTeam } from "@/data/clientHub";

/**
 * Client hub — Project Team: heading + subheading, then a 3-column grid of
 * team member cards (photo, name, role, Read More CTA). Figma reuses the
 * same photo/name/role/button across all 6 cards.
 *
 * Preserves existing 1 → sm:2 → lg:3 grid. Mobile: gutters + type scale.
 */
export function ClientHubProjectTeam() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center gap-6 sm:gap-8">
        <div className="flex max-w-[512px] flex-col items-center gap-3 text-center">
          <h2 className="font-figtree text-[28px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
            {sevenloopProjectTeam.heading}
          </h2>
          <p className="font-satoshi text-[15px] leading-snug font-normal tracking-[-0.5px] text-black/78 sm:text-[18px] lg:text-[20px] lg:leading-none">
            {sevenloopProjectTeam.subheading}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {sevenloopProjectTeam.members.map((member, i) => (
            <div
              key={i}
              className="mx-auto flex w-full max-w-[330px] flex-col gap-4 sm:max-w-none lg:max-w-[330px]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <Image
                  src={member.photo.src}
                  alt={member.photo.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-figtree text-[24px] leading-[120%] font-normal tracking-[-1px] text-black sm:text-[28px] lg:text-[32px] lg:tracking-[-1.51px]">
                  {member.name}
                </h3>
                <p className="font-figtree text-[16px] leading-[120%] font-normal tracking-[-1px] text-black/70 sm:text-[18px] lg:text-[20px] lg:tracking-[-1.51px]">
                  {member.role}
                </p>
              </div>
              <PillButton
                variant="outline"
                size="sm"
                className="min-w-[143px] self-start border-black"
              >
                Read More
              </PillButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
