import { PillButton } from "@/components/ui/PillButton";

/**
 * Client hub — closing CTA: display headline + "Start a Project" pill.
 * Figma: 1199×370 container, 32px gap between heading and button.
 *
 * Also used on Case Study. Desktop (lg+) typography unchanged.
 *
 * `align`:
 * - "center" (default) — Client Hub / existing behavior
 * - "start" — Case Study mobile left-align; desktop remains centered via lg:
 */
export function ClientHubStartProject({
  align = "center",
}: {
  align?: "center" | "start";
} = {}) {
  const isStart = align === "start";

  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-20 lg:px-[60px] lg:py-24">
      <div
        className={`mx-auto flex max-w-[1199px] flex-col gap-6 sm:gap-8 ${
          isStart
            ? "items-start lg:items-center"
            : "items-center"
        }`}
      >
        <h2
          className={`font-figtree text-[28px] leading-[1.2] tracking-[-1px] font-normal text-black sm:text-[36px] sm:leading-[1.25] lg:text-display lg:leading-[72px] lg:tracking-[-3px] ${
            isStart ? "text-left lg:text-center" : "text-center"
          }`}
        >
          We exist to design B2B businesses their right to win &
          communicate with clarity, personality, and a point of view, making
          the right people want to remember & associate.
        </h2>
        <PillButton variant="dark" size="sm" className="min-w-[200px]">
          Start a Project
        </PillButton>
      </div>
    </section>
  );
}
