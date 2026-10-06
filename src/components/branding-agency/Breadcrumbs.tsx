import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbCurrent, breadcrumbs } from "@/data/brandingAgencyPage";

/**
 * Same separator as the client hub and case study breadcrumbs.
 * Lucide's chevron matches the supplied Figma caret, so that asset is not copied.
 */
export function Breadcrumbs({
  items = breadcrumbs,
  current = breadcrumbCurrent,
}: {
  items?: readonly { label: string; href: string }[];
  current?: string;
} = {}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center justify-center gap-1 font-satoshi text-[12px] font-normal leading-[19.6px] tracking-[-0.5px] text-black uppercase sm:text-[14px]"
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          <Link
            href={item.href}
            className="font-normal text-black transition-opacity hover:opacity-70"
          >
            {item.label}
          </Link>
          <ChevronRight
            className="size-4 shrink-0 text-black"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </span>
      ))}
      <span className="text-center font-medium text-black">{current}</span>
    </nav>
  );
}
