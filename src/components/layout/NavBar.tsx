"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { CtaHoverLabel } from "@/components/ui/CtaHoverLabel";
import { LiveClock } from "@/components/ui/LiveClock";
import { PillButton } from "@/components/ui/PillButton";

// Homepage: logo + WORKS · CLIENTS · THINKING on the left;
// TEAM · STUDIO sit next to BOOK A CALL on the right.
const LEFT_NAV_LINKS = ["Works", "Clients", "Thinking"];
const RIGHT_NAV_LINKS = ["Team", "Studio"];
const ALL_NAV_LINKS = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS];
const NAV_HREFS: Record<string, string> = {
  Works: "/work",
};

function NavLink({
  children,
  onClick,
  tone = "dark",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "dark" | "light";
}) {
  const className =
    tone === "light"
      ? "group whitespace-nowrap font-figtree text-[12px] leading-[16.8px] font-normal uppercase tracking-[-0.12px] text-black"
      : "group whitespace-nowrap font-figtree text-[13px] font-medium uppercase tracking-[0.12em] text-white";
  const href = typeof children === "string" ? NAV_HREFS[children] : undefined;
  const label = <CtaHoverLabel>{children}</CtaHoverLabel>;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}

/**
 * Navbar logomark. Same box as the previous mark:
 * 24×36 art, 15.06×21.2 on mobile, 24×36 (w-6 / h-9) on desktop.
 */
function LogoMark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <svg
      width="24"
      height="36"
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`h-[21.2px] w-[15.06px] shrink-0 transition-colors duration-300 lg:h-9 lg:w-6 ${
        tone === "light" ? "text-black" : "text-white"
      }`}
    >
      <path
        d="M9.22376 1.80078V6.02147H18.9625V13.5506C16.9357 11.9255 14.4932 11.066 11.8984 11.066C5.66906 11.066 0.601562 16.1203 0.601562 22.3334C0.601562 28.5465 5.66906 33.6008 11.8984 33.6008C14.4932 33.6008 16.9357 32.7414 18.9625 31.1162V33.6008H23.1942V1.80078H9.22376ZM18.9625 22.3345C18.9625 26.2202 15.7933 29.3812 11.8984 29.3812C8.00359 29.3812 4.83331 26.2202 4.83331 22.3345C4.83331 18.4487 8.00251 15.2889 11.8984 15.2889C15.7943 15.2889 18.9625 18.4498 18.9625 22.3345Z"
        fill="currentColor"
      />
    </svg>
  );
}

type NavMode = "dark" | "transition" | "light";

/**
 * Three bars:
 * - dark: solid black, while the bar sits fully on a dark section
 * - transition: frosted 20% black with white type, only while the bar
 *   is crossing from a dark section onto white
 * - light: pale bar with black type, once the bar is fully on white
 */
function useNavMode() {
  const [mode, setMode] = useState<NavMode>("dark");

  useLayoutEffect(() => {
    let settled: "dark" | "light" = "dark";
    let pending: "dark" | "light" | null = null;
    let hold = 0;
    let primed = false;

    const toneAt = (y: number, bar: Element | null) => {
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const marked = stack.find(
        (el) =>
          el instanceof HTMLElement &&
          el.dataset.nav &&
          !bar?.contains(el) &&
          getComputedStyle(el).pointerEvents !== "none",
      );
      return marked instanceof HTMLElement && marked.dataset.nav === "light"
        ? "light"
        : "dark";
    };

    const read = () => {
      const bar = document.querySelector("[data-nav-bar]");
      const rect = bar?.getBoundingClientRect();
      const top = toneAt(rect ? rect.top + 2 : 22, bar);
      const bottom = toneAt(rect ? rect.bottom - 2 : 82, bar);

      if (top !== bottom) {
        window.clearTimeout(hold);
        pending = null;
        setMode("transition");
        return;
      }

      if (!primed) {
        primed = true;
        settled = top;
        setMode(top);
        return;
      }

      if (top === settled) {
        window.clearTimeout(hold);
        pending = null;
        setMode(top);
        return;
      }

      if (pending === top) return;
      pending = top;
      setMode("transition");
      window.clearTimeout(hold);
      hold = window.setTimeout(() => {
        if (pending) settled = pending;
        pending = null;
        setMode(settled);
      }, 320);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.clearTimeout(hold);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return mode;
}

const BAR_SURFACE: Record<NavMode, string> = {
  dark: "border-white/10 bg-black",
  transition: "border-[#474747] bg-black/20 backdrop-blur-[8px]",
  light: "border-[#d1d2d2] bg-black/5 backdrop-blur-[8px]",
};

/**
 * Dark areas keep the solid black bar. The frosted bar appears only while
 * the bar crosses from dark onto white. On white it settles into the pale
 * bar with black type and a black Book a call pill.
 *
 * Mobile (<lg): hamburger + mark left, Book a Call right.
 * Desktop (lg+): full link + clock layout.
 */
export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const mode = useNavMode();
  const tone = mode === "light" ? "light" : "dark";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Clear mobile menu lock when crossing into desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) {
        setMenuOpen(false);
        document.body.style.overflow = "";
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header data-nav-bar className="fixed inset-x-0 top-0 z-50 mt-5 w-full px-4">
      <div
        className={`mx-auto flex h-16 max-w-[1270px] items-center justify-between gap-4 rounded-[12px] border px-4 transition-[background-color,border-color,backdrop-filter] duration-300 sm:px-6 lg:gap-6 ${BAR_SURFACE[mode]}`}
      >
        <div className="flex items-center gap-3 lg:gap-10">
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center transition-colors duration-300 lg:hidden ${
              tone === "light" ? "text-black" : "text-white"
            }`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <Link href="/" aria-label="Design Asylum home" className="shrink-0">
            <LogoMark tone={tone} />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {LEFT_NAV_LINKS.map((link) => (
              <NavLink key={link} tone={tone}>
                {link}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden items-center gap-8 xl:flex">
            <LiveClock label="India" timeZone="Asia/Kolkata" tone={tone} />
            <LiveClock label="New Jersey, USA" timeZone="America/New_York" tone={tone} />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {RIGHT_NAV_LINKS.map((link) => (
              <NavLink key={link} tone={tone}>
                {link}
              </NavLink>
            ))}
          </nav>

          <PillButton
            variant={tone === "light" ? "dark" : "invert"}
            size="xs"
            href="/#talk"
            className={`shrink-0 ${tone === "light" ? "!border-black" : ""}`}
          >
            Book a call
          </PillButton>
        </div>
      </div>

      {menuOpen ? (
          <div
          className="fixed inset-0 top-0 z-40 bg-black/80 pt-28 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav
            className={`mx-4 flex flex-col gap-6 rounded-[12px] border px-6 py-8 ${BAR_SURFACE[mode]}`}
          >
            {ALL_NAV_LINKS.map((link) => (
              <NavLink key={link} tone={tone} onClick={() => setMenuOpen(false)}>
                {link}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
