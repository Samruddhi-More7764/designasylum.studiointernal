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
  // Side padding keeps the italic from colliding with the words beside it.
  const content = typeof children === "string" ? children.trim() : children;
  return (
    <span className={`inline font-playfair italic px-[0.08em] ${className}`}>{content}</span>
  );
}

function attaches(value: string) {
  return /^[.,!?;:'’)\]%]/.test(value);
}

/**
 * Joins a heading's plain and italic parts with a real word space.
 * Stored copy is trimmed, so the space cannot live inside the CMS strings.
 */
export function SplitHeading({
  before = "",
  accent = "",
  after = "",
  accentClassName = "",
}: {
  before?: string;
  accent?: string;
  after?: string;
  accentClassName?: string;
}) {
  const lead = before.trim();
  const word = accent.trim();
  const trail = after.trim();

  return (
    <>
      {lead}
      {lead && word ? " " : null}
      {lead && !word && trail && !attaches(trail) ? " " : null}
      {word ? <Accent className={accentClassName}>{word}</Accent> : null}
      {word && trail && !attaches(trail) ? " " : null}
      {trail}
    </>
  );
}
