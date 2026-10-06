import type { ReactNode } from "react";

/** Arrow turns from up-right to right on hover. Parent needs the `group` class. */
export const ctaArrowClass =
  "shrink-0 transition-transform duration-300 ease-out group-hover:rotate-[45.45deg]";

/**
 * Two copies of the label. Hover slides the second copy up into the
 * clipped window, matching the pill hover in the nav and section CTAs.
 */
export function CtaHoverLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      <span className="invisible" aria-hidden="true">
        {children}
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
    </span>
  );
}
