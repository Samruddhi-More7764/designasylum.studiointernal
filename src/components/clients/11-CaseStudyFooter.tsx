import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  ContactSendIcon,
  ContactSparkleIcon,
  ContactPhoneIcon,
} from "@/components/ui/ContactIcons";
import {
  SocialLinkedIn,
  SocialInstagram,
  SocialYouTube,
} from "@/components/ui/SocialIcons";
import { FitWordmark } from "@/components/ui/FitWordmark";
import { FOOTER_COLUMNS, AI_LINKS } from "@/data/footer";

// Case Study footer reuses every homepage/Client-Hub column except "Sales"
// — that contact info moves into the top phone/email/address block instead.
const CASE_STUDY_COLUMNS = FOOTER_COLUMNS.filter((col) => col.title !== "Sales");

/**
 * Case study — footer: same gradient background, wordmark and copyright
 * bar as the Homepage/Client-Hub footer, but with a different top
 * arrangement per Figma:
 * 1) Phone + email + address stacked on the left, with 3 contact icons
 *    beneath them (send/sparkle/phone-handset) instead of WhatsApp/Schedule
 *    buttons.
 * 2) Social icons sit directly above "Ask AI for a summary of Design
 *    Asylum" (not in their own column further down).
 * 3) The 6 remaining link columns (Sales dropped — folded into #1) laid
 *    out over a 610×500 grid.
 *
 * Desktop (lg+): unchanged Case Study-specific structure.
 * Mobile: typography/gutters; keep 2-col links; preserve Case content.
 */
export function CaseStudyFooter() {
  return (
    <footer className="relative overflow-hidden bg-black">
      <Image
        src="/assets/images/footer-gradient.png"
        alt=""
        fill
        aria-hidden="true"
        className="pointer-events-none object-cover object-top"
      />

      {/* Contact block + link columns */}
      <div className="relative mx-auto flex w-full max-w-[1470px] flex-col gap-10 px-5 pt-12 pb-8 sm:gap-12 sm:px-6 sm:pt-16 lg:flex-row lg:justify-between lg:px-[60px]">
        {/* Phone / email / address + contact icons + socials + Ask AI */}
        <div className="flex max-w-[360px] flex-col gap-6 sm:gap-8">
          <div className="flex flex-col gap-1">
            <a
              href="tel:+918547807934"
              className="font-figtree text-[22px] font-medium tracking-[-0.5px] text-[#111111] sm:text-[28px] lg:text-[32.55px]"
            >
              +91 85478 07934
            </a>
            <a
              href="mailto:hello@designasylum.in"
              className="break-all font-satoshi text-[22px] font-medium tracking-[-0.5px] text-[#1D1D1D] sm:text-[28px] lg:break-normal lg:text-[32.55px]"
            >
              hello@designasylum.in
            </a>
            <p className="font-satoshi text-[22px] font-medium tracking-[-0.5px] text-[#1D1D1D] sm:text-[28px] lg:text-[32.55px]">
              Pune, India
            </p>
          </div>

          <div className="flex items-center gap-6 text-[#1D1D1D]">
            <ContactSendIcon className="h-7 w-7" />
            <ContactSparkleIcon className="h-[39px] w-[39px]" />
            <ContactPhoneIcon className="h-10 w-5" />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-6 text-[#1D1D1D]">
              <a href="#" aria-label="LinkedIn">
                <SocialLinkedIn className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Instagram">
                <SocialInstagram className="h-6 w-6" />
              </a>
              <a href="#" aria-label="YouTube">
                <SocialYouTube className="h-6 w-6" />
              </a>
            </div>

            <p className="font-figtree text-[11px] font-medium uppercase tracking-[0.14em] text-[#1D1D1D]">
              Ask AI for a summary of Design Asylum
            </p>

            <div className="grid w-full max-w-[360px] grid-cols-2 gap-3">
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

        {/* 6 link columns (Sales dropped) — Figma: 610×500 grid, gap 60 */}
        <div className="grid w-full max-w-[610px] grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-[60px] sm:gap-y-10">
          {CASE_STUDY_COLUMNS.map((col) => (
            <div
              key={col.title}
              className="flex w-auto flex-col gap-3 sm:w-[150px]"
            >
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
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1470px] px-5 pb-8 sm:px-6 lg:px-[60px]">
        <FitWordmark text="Design_ Asylum" />

        <div className="mt-8 flex flex-col gap-2 pt-4 font-figtree text-[10px] uppercase tracking-wider text-white sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-6">
          <span>&copy; Design Asylum 2026</span>
          <span>Built in-house by Asylum Build</span>
          <span>Last updated 10 June 2026</span>
        </div>
      </div>
    </footer>
  );
}
