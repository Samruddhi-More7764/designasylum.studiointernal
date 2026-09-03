import type { ElementType, ReactNode } from "react";

interface SectionHeadingProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

/**
 * Base heading wrapper used across sections. It only fixes the font-family
 * (Figtree, per design.md) and the semantic tag — font-size/line-height are
 * intentionally left to the consumer's className, since design.md only
 * confirms sizing for the Hero headline (44px) and the display text (60px),
 * not for every other section heading. Set the confirmed size per section
 * once verified in Figma rather than defaulting to one here.
 */
export function SectionHeading({
  as: Tag = "h2",
  children,
  className = "",
}: SectionHeadingProps) {
  return <Tag className={`font-figtree ${className}`}>{children}</Tag>;
}

interface AccentProps {
  children: ReactNode;
  className?: string;
}

/**
 * Italic accent span used inside SectionHeading for the recurring pattern
 * seen across the page (e.g. Featured *Projects*, does this *sound*
 * familiar?, 8 in 10 clients *come back*...). Per design.md's `span`
 * typography spec: font-family Playfair Display, style Italic.
 */
export function Accent({ children, className = "" }: AccentProps) {
  // Inherits parent color by default (hero white, section black). Pass an
  // explicit text-* class only when a section needs a different accent.
  return (
    <span className={`font-playfair italic ${className}`}>{children}</span>
  );
}
