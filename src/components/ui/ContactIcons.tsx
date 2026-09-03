/**
 * Contact glyphs for the Case Study footer's phone / email / address block.
 * Paths are pixel-traced from the exported Figma vectors (Vector.png,
 * Vector (1).png, Vector (2).png) via their alpha-channel outlines, so the
 * shapes are exact rather than approximated:
 * - Vector.png (29×29): a paper-plane / "send" glyph.
 * - Vector (1).png (40×40): an 8-point sparkle / burst glyph.
 * - Vector (2).png (21×40): a phone-handset glyph.
 */
export function ContactSendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 29 29"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4,0 L28,0 L28,24 L22,23 L21,11 L3,28 L0,24 L18,7 L5,6 Z" />
    </svg>
  );
}

export function ContactSparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16,0 L23,0 L23,11 L30,4 L35,7 L28,16 L39,16 L39,23 L28,23 L35,30 L32,35 L23,28 L23,39 L16,39 L16,28 L9,35 L4,32 L11,23 L0,23 L0,16 L11,16 L4,9 L7,4 L16,11 Z" />
    </svg>
  );
}

export function ContactPhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 40"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16,0 L20,0 L20,7 L16,7 L8,13 L7,24 L13,32 L20,33 L20,40 L7,36 L0,24 L2,10 L7,4 Z" />
    </svg>
  );
}
