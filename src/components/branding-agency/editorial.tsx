import Image from "next/image";
import type { ReactNode } from "react";
import type { PointerEntry } from "@/data/brandingAgencyPage";

const headingClass =
  "max-w-[931px] font-figtree text-[28px] font-normal leading-[1.2] tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]";

const accentClass =
  "font-playfair text-[28px] font-normal italic leading-[1.2] tracking-[-1px] sm:text-[36px] lg:text-[44px] lg:leading-[62.6px] lg:tracking-[-2.09px]";

const paragraphClass =
  "font-satoshi text-[16px] font-normal leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] sm:leading-[25.9px] lg:text-[20px]";

export function EditorialHeading({
  before,
  accent,
  after,
}: {
  before?: string;
  accent?: string;
  after?: string;
}) {
  return (
    <h2 className={headingClass}>
      {before}
      {accent ? <span className={accentClass}>{accent}</span> : null}
      {after}
    </h2>
  );
}

export function EditorialParagraph({ children }: { children: ReactNode }) {
  return <p className={paragraphClass}>{children}</p>;
}

function PointerIcon() {
  return (
    <span className="relative mt-0.5 h-6 w-6 shrink-0" aria-hidden="true">
      <Image
        src="/assets/images/branding-agency/pointer-shaft.png"
        alt=""
        width={19}
        height={2}
        unoptimized
        className="absolute top-1/2 left-0 h-[2px] w-[19px] -translate-y-1/2"
      />
      <Image
        src="/assets/images/branding-agency/pointer-head.png"
        alt=""
        width={8}
        height={14}
        unoptimized
        className="absolute top-1/2 right-0 h-[14px] w-[8px] -translate-y-1/2"
      />
    </span>
  );
}

export function PointerList({ items }: { items: PointerEntry[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={`${item.term ?? ""}-${item.text}`} className="flex items-start gap-3">
          <PointerIcon />
          <p className={paragraphClass}>
            {item.term ? <span className="font-medium">{item.term}</span> : null}
            {item.term ? <span className="font-normal"> — </span> : null}
            <span className={item.term ? "font-normal" : "font-medium"}>{item.text}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export function HighlightBox({ title, body }: { title: string; body: string }) {
  return (
    <aside className="flex flex-col gap-4 rounded-2xl border-l-4 border-[#FE5A28] bg-[#D5D5D533] p-6 sm:p-8">
      <h3 className="font-figtree text-[24px] font-normal leading-[1.2] text-[#05201F] sm:text-[28px] lg:text-[32px]">
        {title}
      </h3>
      <p className={paragraphClass}>{body}</p>
    </aside>
  );
}
