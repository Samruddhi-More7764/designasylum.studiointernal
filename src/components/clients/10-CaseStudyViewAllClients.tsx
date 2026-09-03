import { PillButton } from "@/components/ui/PillButton";
import { sevenloopCaseStudyViewAllClients } from "@/data/caseStudyPage";

/**
 * Case study — "View All Clients" CTA below the image gallery.
 * Figma: 185×50 pill, 1px solid #000000 border, uppercase Satoshi Medium 14px.
 *
 * Desktop (lg+): unchanged. Mobile: gutters/spacing only.
 */
export function CaseStudyViewAllClients() {
  return (
    <section className="bg-white px-5 pb-14 sm:px-8 sm:pb-16 lg:px-[60px] lg:pb-20">
      <div className="mx-auto flex w-full max-w-[1350px] justify-center">
        <PillButton
          variant="outline"
          size="sm"
          href={sevenloopCaseStudyViewAllClients.href}
          className="min-w-[185px] border-black"
        >
          {sevenloopCaseStudyViewAllClients.label}
        </PillButton>
      </div>
    </section>
  );
}
