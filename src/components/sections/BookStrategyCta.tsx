import { PillButton } from "@/components/ui/PillButton";

/**
 * Standalone CTA between Case Studies and Testimonials
 * (Homepage / design.md: ~318 × 50–56, centered dark pill).
 */
export function BookStrategyCta() {
  return (
    <section className="flex justify-center bg-white px-5 py-12 sm:px-6 sm:py-16">
      <PillButton
        variant="dark"
        size="lg"
        className="w-full max-w-[318px] min-w-0 sm:min-w-[318px]"
      >
        Book a brand strategy session
      </PillButton>
    </section>
  );
}
