"use client";

import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type PillButtonVariant = "dark" | "light" | "invert" | "outline";
export type PillButtonSize = "xs" | "sm" | "lg";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  showArrow?: boolean;
  /** When set, renders a Next.js Link with the same pill styles. */
  href?: string;
  children: ReactNode;
}

// dark    — design.md "Submit button": bg #000000, border 1px solid #FFFFFF.
// light   — hero "GET STARTED": transparent fill, white border, on photo.
// invert  — navbar "BOOK A CALL" (Group 63.png): white fill, black text.
// outline — "VIEW WEBSITE" / "SEE OUTCOME" pills on white sections
//           (Frame 2095587764.png / Container Nivaro.png): transparent fill,
//           thin dark border, black text.
const variantClasses: Record<PillButtonVariant, string> = {
  dark: "bg-black text-white border border-white",
  light: "bg-transparent text-white border border-white",
  invert: "bg-white text-black border border-white",
  outline: "bg-transparent text-black border border-black/20",
};

// xs — navbar pill measured 32px tall in Group 63.png (y 16..47 of the 64px bar).
// sm — design.md "Submit button (Link.png)": height 50px, padding 16px.
// lg — design.md large submit: height 56px, padding 14px / ~20px.
const sizeClasses: Record<PillButtonSize, string> = {
  xs: "h-8 px-4 text-[11px] font-medium",
  sm: "h-[50px] px-5 text-[13px] font-medium",
  lg: "h-[56px] px-6 text-[14px] font-medium",
};

function scrollToPageHash(event: MouseEvent<HTMLAnchorElement>, href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;
  const id = href.slice(hashIndex + 1);
  if (!id || typeof window === "undefined") return;

  const path = hashIndex > 0 ? href.slice(0, hashIndex) : window.location.pathname;
  const onThisPage = path === window.location.pathname;
  const target = document.getElementById(id);
  if (!onThisPage || !target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

export function PillButton({
  variant = "dark",
  size = "sm",
  showArrow = true,
  className = "",
  type = "button",
  href,
  children,
  ...rest
}: PillButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-pill",
    "font-figtree uppercase tracking-[0.04em] whitespace-nowrap",
    "transition-opacity hover:opacity-80",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  const content = (
    <>
      <span>{children}</span>
      {showArrow && <ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
    </>
  );

  if (href) {
    if (href.includes("#")) {
      return (
        <a
          href={href}
          className={classes}
          style={rest.style}
          onClick={(event) => scrollToPageHash(event, href)}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} style={rest.style}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
