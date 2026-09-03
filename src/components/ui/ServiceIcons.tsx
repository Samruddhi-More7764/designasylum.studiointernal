/**
 * Service icons for the Homepage Services cards.
 * Traced from Figma vectors (Vector 3 / 4 / 5) — pure SVG, no raster.
 *
 * - ServiceStackIcon  — Brand strategy, Website design, Film & animation,
 *   Brand & identity, Brand campaigns (Vector 3: 3 stacked isometric squares).
 * - ServiceBlocksIcon — Website development (Vector 5 + Vector 4 composed).
 */

import type { SVGProps } from "react";

/**
 * Three stacked isometric squares (wireframe).
 * Figma: 45.5×46.3125, stroke 1.5px #000, inset at (5.25, 5.34) in a 56×57 frame.
 */
export function ServiceStackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 56 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <g
        transform="translate(5.25 5.34)"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="miter"
        strokeLinecap="square"
      >
        {/* Top square */}
        <path d="M22.75 0.75 L44.75 12.75 L22.75 24.75 L0.75 12.75 Z" />
        {/* Middle square */}
        <path d="M22.75 12.75 L44.75 24.75 L22.75 36.75 L0.75 24.75 Z" />
        {/* Bottom square */}
        <path d="M22.75 24.75 L44.75 36.75 L22.75 45.56 L0.75 36.75 Z" />
      </g>
    </svg>
  );
}

/**
 * Website development — two overlapping block glyphs:
 * Part 1 (Vector 5): three squares, 32.06×35.63 at (3.56, 3.56)
 * Part 2 (Vector 4): staircase of six squares, 35.63×35.63 at (17.81, 17.81)
 * Frame 56×57; fills match the card (#D5D5D533), strokes 1.5px #000.
 */
export function ServiceBlocksIcon(props: SVGProps<SVGSVGElement>) {
  const p1 = { x: 3.56, y: 3.56, w: 32.0625, h: 35.625 };
  const p2 = { x: 17.81, y: 17.81, w: 35.625, h: 35.625 };
  const cell = p2.w / 3;

  return (
    <svg
      viewBox="0 0 56 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Part 1 — three outlined squares (Vector 5) */}
      <g
        transform={`translate(${p1.x} ${p1.y}) scale(${p1.w / 33} ${p1.h / 36})`}
        stroke="#000000"
        strokeWidth={1.5}
        fill="#D5D5D533"
      >
        <rect x={0.75} y={0.75} width={12.5} height={12.5} />
        <rect x={17.75} y={6.75} width={12.5} height={12.5} />
        <rect x={0.75} y={21.75} width={12.5} height={12.5} />
      </g>

      {/* Part 2 — staircase blocks (Vector 4) */}
      <g
        transform={`translate(${p2.x} ${p2.y})`}
        stroke="#000000"
        strokeWidth={1.5}
        fill="#D5D5D533"
      >
        <rect x={0.75} y={cell * 2 + 0.75} width={cell - 1.5} height={cell - 1.5} />
        <rect x={cell + 0.75} y={cell * 2 + 0.75} width={cell - 1.5} height={cell - 1.5} />
        <rect x={cell * 2 + 0.75} y={cell * 2 + 0.75} width={cell - 1.5} height={cell - 1.5} />
        <rect x={cell + 0.75} y={cell + 0.75} width={cell - 1.5} height={cell - 1.5} />
        <rect x={cell * 2 + 0.75} y={cell + 0.75} width={cell - 1.5} height={cell - 1.5} />
        <rect x={cell * 2 + 0.75} y={0.75} width={cell - 1.5} height={cell - 1.5} />
      </g>
    </svg>
  );
}
