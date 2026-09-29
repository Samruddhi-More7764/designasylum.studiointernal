import { DesignAsylumWordmark } from "@/components/ui/DesignAsylumWordmark";

/**
 * Full-width Design Asylum footer wordmark.
 *
 * Replaces the previous Figtree text + scaleX approximation with the
 * composed Figma vector artwork. The outer container classes are unchanged
 * so footer layout/spacing stay the same; only the inner mark is swapped.
 *
 * Shared by the Homepage/Client Hub footer and the Case Study footer.
 * The `text` prop is retained for call-site compatibility but unused.
 */
export function FitWordmark(_props: { text?: string }) {
  return (
    <div className="mt-20 flex w-full justify-center lg:block">
      {/* Mobile artboard: 351.8 × 43.91. Desktop fills the 1402px frame. */}
      <DesignAsylumWordmark className="block h-[43.906px] w-[351.799px] max-w-full text-white lg:h-auto lg:w-full" />
    </div>
  );
}
