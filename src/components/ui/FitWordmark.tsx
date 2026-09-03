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
    <div className="mt-20 w-full overflow-hidden">
      <DesignAsylumWordmark className="block h-auto w-full text-white" />
    </div>
  );
}
