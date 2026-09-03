import Image from "next/image";
import { sevenloopTransformation } from "@/data/clientHub";
import { ClientHubMobileCompare } from "@/components/clients/ClientHubMobileCompare";

function ComparePill({ label }: { label: string }) {
  return (
    <span className="inline-flex h-[38px] items-center justify-center rounded-[64px] border-[1.5px] border-black/10 bg-[#F8F8F8] px-[14px] py-2 font-figtree text-[12px] font-medium leading-[10px] tracking-[0.8px] text-[#4B4B4B] uppercase">
      {label}
    </span>
  );
}

/**
 * Client hub — Transformation: heading + subtext, then a before/after pair
 * of screenshot crops (old site vs. Webflow rebuild), each in a fixed
 * #464242 frame with a rounded pill label in its top corner.
 *
 * Desktop (lg+): existing dual-panel markup — untouched.
 * Mobile (<lg): separate drag-compare UI; desktop markup is hidden.
 */
export function ClientHubTransformation() {
  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:px-[60px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1438px] flex-col items-center gap-6 sm:gap-8">
        <div className="flex max-w-[466px] flex-col items-center gap-3 text-center">
          <h2 className="font-figtree text-[28px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]">
            {sevenloopTransformation.heading}
          </h2>
          <p className="font-satoshi text-[15px] leading-snug font-normal tracking-[-0.5px] text-black/78 sm:text-[18px] lg:text-[20px] lg:leading-none">
            {sevenloopTransformation.subtext}
          </p>
        </div>

        {/* Mobile-only compare slider */}
        <div className="w-full lg:hidden">
          <ClientHubMobileCompare />
        </div>

        {/* Desktop dual panels — exact prior markup, lg+ only */}
        <div className="hidden w-full flex-col gap-6 sm:flex-row lg:flex">
          <div className="relative aspect-[672/706] w-full flex-1 overflow-hidden bg-[#464242]">
            <div
              className="absolute"
              style={{
                width: "91.67%",
                height: "178.8%",
                top: "14.59%",
                left: "52.23%",
              }}
            >
              <Image
                src={sevenloopTransformation.before.src}
                alt={sevenloopTransformation.before.alt}
                fill
                className="object-cover object-top"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="absolute top-6 left-6">
              <ComparePill label="Before" />
            </div>
          </div>

          <div className="relative aspect-[672/706] w-full flex-1 overflow-hidden bg-[#464242]">
            <div
              className="absolute"
              style={{
                width: "83.33%",
                height: "157.5%",
                top: "15.16%",
                left: "-33.33%",
              }}
            >
              <Image
                src={sevenloopTransformation.after.src}
                alt={sevenloopTransformation.after.alt}
                fill
                className="object-cover object-top"
                sizes="(min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="absolute top-6 right-6">
              <ComparePill label="After" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
