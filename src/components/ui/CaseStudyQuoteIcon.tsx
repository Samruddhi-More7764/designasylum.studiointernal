/**
 * Decorative circular badge below the pull-quote on the Sevenloop case
 * study page ("We wrote four thousand words..."). Pure SVG, traced from
 * the source raster's alpha mask via boundary tracing (Moore-neighbor +
 * Catmull-Rom smoothing) — an orange disc with a white organic blob and
 * a small punched-through orange dot near its center. Source frame: 54×54.
 */

import type { SVGProps } from "react";

export function CaseStudyQuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <circle cx="27" cy="27" r="27" fill="#EF6C2E" />
      <path
        d="M 25.00 12.00 C 26.12 11.67 27.68 11.58 28.77 12.00 C 29.85 12.42 30.84 13.54 31.50 14.50 C 32.16 15.46 32.17 16.83 32.75 17.75 C 33.33 18.67 34.08 19.42 35.00 20.00 C 35.92 20.58 37.42 20.53 38.25 21.25 C 39.08 21.97 39.72 23.16 40.00 24.29 C 40.28 25.43 40.34 27.04 39.96 28.04 C 39.57 29.04 38.59 29.63 37.71 30.29 C 36.82 30.95 35.51 31.30 34.65 32.00 C 33.78 32.70 33.11 33.56 32.50 34.50 C 31.89 35.44 31.75 36.90 31.00 37.65 C 30.25 38.40 29.13 38.77 28.00 39.00 C 26.87 39.23 25.36 39.30 24.23 39.00 C 23.10 38.70 21.80 38.10 21.21 37.21 C 20.61 36.32 21.25 34.58 20.66 33.66 C 20.08 32.75 18.71 32.32 17.71 31.71 C 16.70 31.10 15.43 30.74 14.65 30.00 C 13.86 29.26 13.27 28.37 13.00 27.29 C 12.73 26.21 12.62 24.62 13.00 23.53 C 13.38 22.43 14.33 21.29 15.29 20.71 C 16.25 20.12 17.85 20.58 18.77 20.00 C 19.68 19.42 20.25 18.21 20.79 17.21 C 21.34 16.20 21.34 14.82 22.04 13.96 C 22.74 13.09 23.88 12.33 25.00 12.00 Z"
        fill="#FFFFFF"
      />
      <circle cx="26.5" cy="25.5" r="1.3" fill="#EF6C2E" />
    </svg>
  );
}
