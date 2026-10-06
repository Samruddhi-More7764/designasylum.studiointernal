import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { Accent } from "@/components/ui/SectionHeading";
import { contactOffices } from "@/data/contactPage";
import { OfficeClock } from "@/components/contact/OfficeClock";

export function ContactOffices() {
  return (
    <header className="bg-white px-4 pt-10 lg:pt-20">
      <div className="mx-auto flex w-full max-w-[1136px] flex-col items-center gap-4 text-center">
        <Breadcrumbs items={[{ label: "Home", href: "/" }]} current="Contact us" />
        <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize lg:text-[56px]">
          Get in <Accent className="text-[32px] tracking-[-2.09px] lg:text-[56px]">Touch</Accent>!
        </h1>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[964px] flex-col items-center gap-8 lg:mt-8 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
        {contactOffices.map((office) => (
          <article key={office.city} className="flex w-full max-w-[470px] flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={office.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 470px, 100vw"
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0 bg-gradient-to-b from-transparent from-50% to-black"
                aria-hidden="true"
              />
              {office.tint ? (
                <div className="absolute inset-0 bg-[#003766]/20" aria-hidden="true" />
              ) : null}
              <OfficeClock timeZone={office.timeZone} />
              <p className="absolute bottom-4 left-4 font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.15px] text-white lg:text-[28px] lg:tracking-[-1.51px]">
                {office.city}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-2 gap-y-2.5">
              {office.links.map((link) => (
                <a
                  key={link.href + link.label}
                  href={link.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-black px-4 py-2.5 font-satoshi text-[12px] leading-4 font-medium text-black lg:px-[17px] lg:py-[17px] lg:text-[14px]"
                >
                  <CtaHoverLabel>{link.label}</CtaHoverLabel>
                  <ArrowUpRight className={`size-3 ${ctaArrowClass}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </header>
  );
}
