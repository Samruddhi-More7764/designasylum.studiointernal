import Image from "next/image";
import { ResourceButton } from "@/components/branding-agency/ResourceButton";
import { Accent } from "@/components/ui/SectionHeading";
import {
  brandingExperts,
  brandingExpertsHeading,
} from "@/data/brandingAgencyPage";

export function BrandingExperts({
  heading = brandingExpertsHeading,
  members = brandingExperts,
}: {
  heading?: typeof brandingExpertsHeading;
  members?: ReadonlyArray<(typeof brandingExperts)[number] & { href?: string }>;
} = {}) {
  return (
    <section className="overflow-x-clip bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1038px] flex-col items-center gap-8 lg:gap-10">
        <div className="flex max-w-[640px] flex-col items-center gap-3 text-center">
          <h2 className="font-figtree text-[28px] font-normal leading-[1.2] tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]">
            {heading.before}
            <Accent>{heading.accent}</Accent>
          </h2>
          <p className="font-satoshi text-[15px] leading-snug tracking-[-0.5px] text-black/78 sm:text-[18px] lg:text-[20px]">
            {heading.subheading}
          </p>
        </div>

        <div className="flex w-full flex-col gap-8 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
          {members.map((member) => (
            <article
              key={member.key}
              className="flex w-full flex-col gap-4"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#e7e7e7]">
                <Image
                  src={member.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 330px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <h3 className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1px] text-black sm:text-[28px] lg:text-[32px]">
                  {member.name}
                </h3>
                <p className="font-figtree text-[16px] leading-[1.2] tracking-[-0.5px] text-black/70 sm:text-[18px] lg:text-[20px]">
                  {member.role}
                </p>
              </div>
              <ResourceButton href={member.href || "/"} tone="outline" className="!w-[143px]">
                Read More
              </ResourceButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
