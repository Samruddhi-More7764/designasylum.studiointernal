import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { painPoints, type PainPoint } from "@/data/painPoints";

function PainPointCard({ point }: { point: PainPoint }) {
  // Container (Nivaro).png card anatomy: rounded bordered card; large
  // decorative opening quotes top-left; category chip top-right (sampled:
  // #31398F text on #F2F2F2); quote; SEE OUTCOME outline pill; small
  // muted resolution paragraph.
  return (
    <div className="flex flex-col items-start gap-5 rounded-2xl border border-hairline bg-white p-7">
      <div className="flex w-full items-start justify-between">
        <span
          aria-hidden="true"
          className="font-figtree text-[56px] leading-[0.9] font-bold text-black"
        >
          &ldquo;
        </span>
        <span className="rounded-pill bg-chip-bg px-3 py-1.5 font-satoshi text-[11px] uppercase tracking-wide text-chip-text">
          {point.tag}
        </span>
      </div>

      <p className="font-satoshi text-base font-medium leading-snug text-black">
        {point.quote}
      </p>

      <PillButton variant="outline" size="sm">
        See outcome
      </PillButton>

      <p className="font-satoshi text-xs leading-relaxed text-muted">
        {point.resolution}
      </p>
    </div>
  );
}

/**
 * Pain points — Container (Nivaro - Framer Template): 1470 × 566px,
 * background #FFFFFF, padding 60px, gap 64px. Centered heading with
 * Playfair italic "sound", then three cards side by side.
 *
 * Mobile: single-column stack. Desktop (lg+): 3-col.
 */
export function PainPoints() {
  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-[60px] lg:px-[60px]">
      <SectionHeading className="mb-10 text-center text-[28px] font-medium tracking-[-0.8px] text-ink sm:mb-16 sm:text-[36px] lg:text-[40px] lg:tracking-[-1px]">
        Does any of this <Accent>sound</Accent> familiar?
      </SectionHeading>

      <div className="mx-auto grid max-w-[1230px] grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
        {painPoints.map((point, i) => (
          <PainPointCard key={i} point={point} />
        ))}
      </div>
    </section>
  );
}
