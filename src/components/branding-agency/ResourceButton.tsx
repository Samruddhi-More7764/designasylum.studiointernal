import Image from "next/image";
import Link from "next/link";

const ICONS = {
  light: "/assets/images/branding-agency/arrow-up-right-white.png",
  dark: "/assets/images/branding-agency/arrow-up-right-black.png",
} as const;

/**
 * Page pill. Existing PillButton is Figtree with a Lucide arrow and a
 * different border treatment, so this page keeps its own Satoshi pill.
 */
export function ResourceButton({
  href,
  children,
  tone = "solid",
  size = "sm",
  className = "",
}: {
  href: string;
  children: string;
  tone?: "solid" | "outline";
  size?: "sm" | "lg";
  className?: string;
}) {
  const solid = tone === "solid";

  return (
    <Link
      href={href}
      className={[
        "inline-flex w-full items-center justify-center gap-2 rounded-pill border border-black px-4 text-center",
        "font-satoshi text-[14px] font-medium uppercase leading-4 tracking-[-0.5px]",
        "transition-opacity hover:opacity-80",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#05201F]",
        size === "lg"
          ? "h-auto min-h-[56px] px-[19.84px] py-3 whitespace-normal sm:h-[56px] sm:whitespace-nowrap"
          : "h-[50px] whitespace-nowrap",
        solid ? "bg-black text-white" : "bg-transparent text-black",
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <Image
        src={solid ? ICONS.light : ICONS.dark}
        alt=""
        width={9}
        height={9}
        unoptimized
        aria-hidden="true"
        className="h-[9px] w-[9px] shrink-0"
      />
    </Link>
  );
}
