import { PillButton } from "@/components/ui/PillButton";

/**
 * Article display text — Frame 2095588035.
 * Container: 899×370, gap 32. Text block: 899×288. Button: 318.19×50,
 * radius 9999, border 1px, padding 16.
 */
export function ArticleCta() {
  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20 lg:px-[60px]">
      <div className="flex w-full max-w-[899px] flex-col items-start gap-6 sm:gap-8">
        <p className="font-figtree text-[28px] font-medium leading-[1.2] tracking-[-1px] text-black sm:text-[36px] sm:tracking-[-1.5px] lg:text-display lg:leading-[72px] lg:tracking-[-3px]">
          We wrote four thousand words on how that film actually got made.
          The brief, the dead ends, the bit we&rsquo;d never do again. Worth
          a read.
        </p>
        <PillButton
          variant="dark"
          className="h-[50px] w-full max-w-[318.19px] !px-4"
        >
          Book a brand strategy session
        </PillButton>
      </div>
    </section>
  );
}
