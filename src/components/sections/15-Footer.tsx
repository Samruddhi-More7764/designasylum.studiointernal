"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  SocialLinkedIn,
  SocialInstagram,
  SocialYouTube,
} from "@/components/ui/SocialIcons";
import { FitWordmark } from "@/components/ui/FitWordmark";
import { FOOTER_COLUMNS, AI_LINKS } from "@/data/footer";

/**
 * Full Homepage footer:
 * 1) Contact + AI pills
 * 2) Link columns + Follow Us
 * 3) Full-width Design_ Asylum wordmark + copyright bar
 *
 * Mobile: stacked contact, AI 2×2, links 2-col.
 * Desktop (lg+): original 2-col contact/AI + 8-col links.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black">
      <Image
        src="/assets/images/footer-gradient.png"
        alt=""
        fill
        aria-hidden="true"
        className="pointer-events-none object-cover object-top"
      />

      {/* Contact + AI */}
      <div className="relative mx-auto grid max-w-[1470px] grid-cols-1 gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:px-[60px]">
        <div className="flex flex-col gap-1">
          <a
            href="mailto:accounts@designasylum.in"
            className="break-all font-figtree text-[22px] font-medium tracking-[-0.5px] text-[#1D1D1D] sm:text-[28px] lg:break-normal lg:text-[36px]"
          >
            accounts@designasylum.in
          </a>
          <a
            href="tel:+918547807934"
            className="font-figtree text-[22px] font-medium tracking-[-0.5px] text-[#1D1D1D] sm:text-[28px] lg:text-[36px]"
          >
            +91 8547807934
          </a>
        </div>

        <div className="flex flex-col items-start gap-5 lg:items-end">
          <p className="font-figtree text-[11px] font-medium uppercase tracking-[0.14em] text-[#1D1D1D]">
            Ask AI for a summary of Design Asylum
          </p>

          <div className="grid w-full max-w-[360px] grid-cols-2 gap-3 lg:max-w-none">
            {AI_LINKS.map((name) => (
              <a
                key={name}
                href="#"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-[#1D1D1D]/30 bg-transparent px-3 font-figtree text-[11px] font-medium uppercase tracking-[0.06em] text-[#1D1D1D] sm:px-5 sm:text-[12px]"
              >
                {name}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Link columns + wordmark */}
      <div className="relative mx-auto max-w-[1470px] px-5 pt-8 pb-8 sm:px-6 sm:pt-10 lg:px-[60px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-8 lg:gap-8">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-figtree text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1D1D1D]">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-satoshi text-[13px] text-[#1D1D1D]/70 transition-opacity hover:opacity-70"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="font-figtree text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1D1D1D]">
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

        <FitWordmark text="Design_ Asylum" />

        <div className="mt-8 flex flex-col gap-2 pt-4 font-figtree text-[10px] uppercase tracking-wider text-white sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-6">
          <span>&copy; Design Asylum 2026</span>
          <span className="sm:order-last">Last updated 10 June 2026</span>
          <span>Built in-house by Asylum Build</span>
        </div>
      </div>
    </footer>
  );
}
