/**
 * Decorative vector on the Client Hub "Partnership" black story card
 * (figmaimages/Vector (6).png). Pure SVG, traced from the source raster's
 * alpha mask via boundary tracing — a single closed 18-point polygon
 * (vertical bar + arrow point + horizontal bar), verified at 99.8% pixel
 * match against the original asset. Source frame: 528×433.
 */

import type { SVGProps } from "react";

export function PartnershipIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 528 433"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M139 0 L241 0 L242 212 L392 62 L465 135 L316 286 L527 286 L527 388 L316 388 L358 432 L22 432 L65 389 L0 388 L0 286 L65 285 L0 220 L0 74 L138 212 Z"
        fill="currentColor"
      />
    </svg>
  );
}
