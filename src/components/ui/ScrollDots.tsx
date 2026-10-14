"use client";

export function activeSnapIndex(node: HTMLElement) {
  const cards = Array.from(node.children) as HTMLElement[];
  const origin = node.getBoundingClientRect().left;
  let index = 0;
  let best = Infinity;
  cards.forEach((card, i) => {
    const delta = Math.abs(card.getBoundingClientRect().left - origin);
    if (delta < best) {
      best = delta;
      index = i;
    }
  });
  return index;
}

export function scrollToSnap(node: HTMLElement, index: number) {
  const card = node.children[index] as HTMLElement | undefined;
  if (!card) return;
  const left =
    node.scrollLeft + (card.getBoundingClientRect().left - node.getBoundingClientRect().left);
  node.scrollTo({ left, behavior: "smooth" });
}

/** Orange pill plus dots used under the mobile careers carousels. */
export function ScrollDots({
  count,
  active,
  onSelect,
  className = "",
}: {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  if (count < 2) return null;
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`} role="tablist">
      {Array.from({ length: count }, (_, index) => {
        const selected = index === active;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-label={`Slide ${index + 1}`}
            aria-selected={selected}
            onClick={() => onSelect?.(index)}
            className={`h-2 rounded-full ${selected ? "w-[19px] bg-[#FE5A28]" : "w-2 bg-[#FE5A28]/30"}`}
          />
        );
      })}
    </div>
  );
}
