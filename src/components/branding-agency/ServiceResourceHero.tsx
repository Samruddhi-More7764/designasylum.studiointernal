import Image from "next/image";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { ResourceButton } from "@/components/branding-agency/ResourceButton";

const defaultTitle = "Branding agency in Pune";
const defaultIntro =
  "A branding agency should answer one question first: what do you want a buyer, an investor, or a hire to believe about you before they meet you. Most agencies skip the question and go straight to logo exploration. Design Asylum starts where every B2B brand actually has to start — with diagnosis, positioning, and the words on the page — and only then builds the identity.";

export function ServiceResourceHero({
  title = defaultTitle,
  intro = defaultIntro,
  crumbs,
  current,
  imageSrc = "/assets/images/branding-agency/hero-media.png",
  primaryLabel = "Book a strategy call",
  secondaryLabel = "See our work",
}: {
  title?: string;
  intro?: string;
  crumbs?: readonly { label: string; href: string }[];
  current?: string;
  imageSrc?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
} = {}) {
  return (
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center px-5 pb-8 pt-2 sm:px-8 sm:pb-10 lg:px-[60px]">
        <Breadcrumbs items={crumbs} current={current} />

        <h1 className="mt-6 max-w-[1038px] text-center font-figtree text-[32px] font-normal leading-[1.2] tracking-[-0.5px] text-black capitalize sm:text-[44px] lg:mt-8 lg:text-[56px] lg:leading-[79.2px]">
          {title}
        </h1>

        <p className="mt-4 max-w-[842px] text-center font-satoshi text-[12px] font-normal leading-[140%] tracking-[-0.5px] text-black uppercase sm:text-[13px] sm:leading-[120%] lg:mt-5 lg:text-[14px]">
          {intro}
        </p>

        <div className="mt-6 flex w-full max-w-[320px] flex-col items-stretch gap-[11px] sm:mt-8 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <ResourceButton
            href="/#talk"
            className="sm:w-[210px]"
          >
            {primaryLabel}
          </ResourceButton>
          <ResourceButton
            href="/"
            tone="outline"
            className="sm:w-[156px]"
          >
            {secondaryLabel}
          </ResourceButton>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1470px] px-4 pb-12 sm:px-8 sm:pb-16 lg:px-[60px] lg:pb-20">
        <div className="relative mx-auto aspect-[358/201] w-full max-w-[1150px] overflow-hidden rounded-[8.63px] lg:aspect-[1150/647]">
          <Image
            src={imageSrc}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 1150px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
