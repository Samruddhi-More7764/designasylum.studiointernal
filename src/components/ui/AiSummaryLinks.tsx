import { ArrowUpRight } from "lucide-react";
import { AI_LINKS, aiButtonWidth, aiHomepage } from "@/data/footer";

/**
 * Heading, then two right-aligned rows.
 * 20px under the heading, 8px between the pills in a row and between the rows.
 */

function AiPill({ name }: { name: string }) {
  return (
    <a
      href={aiHomepage(name) ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-12 shrink-0 items-center justify-between rounded-pill border border-black px-4 font-satoshi text-[13px] font-medium leading-[16px] tracking-[-0.26px] text-black uppercase ${aiButtonWidth(name)}`}
    >
      <span className="whitespace-nowrap">{name}</span>
      <ArrowUpRight
        className="shrink-0"
        style={{ width: 10.203, height: 13.008 }}
        aria-hidden="true"
      />
    </a>
  );
}

export function AiSummaryLinks({ links = AI_LINKS }: { links?: string[] }) {
  const rows: string[][] = [];
  for (let i = 0; i < links.length; i += 2) {
    rows.push(links.slice(i, i + 2));
  }

  return (
    <div className="flex w-full flex-col items-end gap-5">
      <p className="h-[15px] w-[290px] max-w-full text-right font-figtree text-[11px] font-medium leading-[15px] tracking-[0.14em] whitespace-nowrap text-[#1D1D1D] uppercase">
        Ask AI for a summary of Design Asylum
      </p>
      <div className="flex flex-col items-end gap-2">
        {rows.map((row) => (
          <div key={row.join("-")} className="flex justify-end gap-2">
            {row.map((name) => (
              <AiPill key={name} name={name} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
