"use client";

import Image from "next/image";
import {
  SocialLinkedIn,
  SocialInstagram,
  SocialYouTube,
} from "@/components/ui/SocialIcons";
import { FitWordmark } from "@/components/ui/FitWordmark";
import { AiSummaryLinks } from "@/components/ui/AiSummaryLinks";
import { FOOTER_COLUMNS, AI_LINKS, footerLinkHref, type FooterColumn } from "@/data/footer";

/**
 * Full Homepage footer:
 * 1) Contact + AI pills
 * 2) Link columns + Follow Us
 * 3) Full-width Design_ Asylum wordmark + copyright bar
 *
 * Mobile: stacked contact, AI 2×2, links 2-col.
 * Desktop (lg+): original 2-col contact/AI + 8-col links.
 */
export function Footer({
  columns = FOOTER_COLUMNS,
  aiLinks = AI_LINKS,
}: {
  columns?: FooterColumn[];
  aiLinks?: string[];
}) {
  return (
    <footer data-nav="dark" className="relative overflow-hidden bg-black">
      <Image
        src="/assets/images/footer-gradient.png"
        alt=""
        fill
        aria-hidden="true"
        className="pointer-events-none object-cover object-top"
      />

      {/* Contact + AI */}
      <div className="relative mx-auto grid max-w-[1470px] grid-cols-1 gap-10 px-5 pt-12 pb-8 sm:px-6 sm:pt-14 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-12 lg:pt-14 lg:pb-24">
        <div className="flex flex-col">
          <a
            href="mailto:accounts@designasylum.in"
            className="block whitespace-nowrap font-figtree text-[clamp(26px,7.8vw,32px)] leading-[1.2] font-normal tracking-[-1.38px] text-[#1D1D1D] lg:text-[55px] lg:leading-[73px]"
          >
            accounts@designasylum.in
          </a>
          <a
            href="tel:+918547807934"
            className="block whitespace-nowrap font-figtree text-[clamp(26px,7.8vw,32px)] leading-[1.2] font-normal tracking-[-1.38px] text-[#111] lg:text-[55px] lg:leading-[73px]"
          >
            +91 8547807934
          </a>
        </div>

        <div className="flex flex-col items-start lg:items-end">
          <AiSummaryLinks links={aiLinks} />
        </div>
      </div>

      {/* Link columns */}
      <div className="relative mx-auto max-w-[1470px] px-5 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-8 lg:gap-x-6">
          {columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="font-satoshi text-[14px] leading-[15px] font-bold tracking-[-0.4px] text-black uppercase">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-[9px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href || footerLinkHref(link.label)}
                      className="font-satoshi text-[16px] leading-[21px] font-medium tracking-[-0.4px] text-black/70 capitalize transition-opacity hover:opacity-70"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <h3 className="font-satoshi text-[14px] leading-[15px] font-bold tracking-[-0.4px] text-black uppercase">
              Follow Us
            </h3>
            <div className="flex gap-4 text-[#1D1D1D]">
              <a href="#" aria-label="LinkedIn">
                <SocialLinkedIn className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram">
                <SocialInstagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="YouTube">
                <SocialYouTube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop wordmark: 1470 frame, left 33.4px. Mobile logo is 351.8×43.9, centered. */}
      <div className="relative mx-auto w-full max-w-[1470px] px-[19.1px] lg:px-[33.4px]">
        <FitWordmark text="Design_ Asylum" />
      </div>

      <div className="relative mx-auto max-w-[1470px] px-5 pb-8 sm:px-6 lg:px-[60px]">
        <div className="mt-8 flex flex-col gap-2 pt-4 font-figtree text-[11px] leading-[15px] font-semibold tracking-[0.8px] text-white uppercase lg:mt-10 lg:flex-row lg:items-center lg:justify-between lg:gap-3 lg:pt-6">
          <span className="flex w-full items-center justify-between gap-4 lg:contents">
            <span>&copy; Design Asylum 2026</span>
            <span className="whitespace-nowrap lg:order-last">
              Last updated 10 June 2026
            </span>
          </span>
          <span>Built in-house by Asylum Build</span>
        </div>
      </div>
    </footer>
  );
}
