import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Prev/next pair from the industry frame. Other industry routes do not
 * exist yet, so the buttons render and do not navigate.
 */
export function IndustryPager() {
  return (
    <div className="flex items-center justify-center gap-3 bg-white py-6">
      <button
        type="button"
        aria-label="Previous industry"
        className="flex size-10 items-center justify-center rounded-full border border-black/15 text-black"
      >
        <ChevronLeft className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Next industry"
        className="flex size-10 items-center justify-center rounded-full border border-black/15 text-black"
      >
        <ChevronRight className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
