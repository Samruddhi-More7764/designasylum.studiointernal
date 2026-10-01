"use client";

import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { LiveClock } from "@/components/ui/LiveClock";
import { PillButton } from "@/components/ui/PillButton";

// Homepage: logo + WORKS · CLIENTS · THINKING on the left;
// TEAM · STUDIO sit next to BOOK A CALL on the right.
const LEFT_NAV_LINKS = ["Works", "Clients", "Thinking"];
const RIGHT_NAV_LINKS = ["Team", "Studio"];
const ALL_NAV_LINKS = [...LEFT_NAV_LINKS, ...RIGHT_NAV_LINKS];

function NavLink({
  children,
  onClick,
  tone = "dark",
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "dark" | "light";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-figtree text-[13px] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-70 ${
        tone === "light" ? "text-black" : "text-white"
      }`}
    >
      {children}
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
      className="h-[21.2px] w-[15.06px] shrink-0 lg:h-9 lg:w-6"
    >
      <path
        d="M9.22376 1.80078V6.02147H18.9625V13.5506C16.9357 11.9255 14.4932 11.066 11.8984 11.066C5.66906 11.066 0.601562 16.1203 0.601562 22.3334C0.601562 28.5465 5.66906 33.6008 11.8984 33.6008C14.4932 33.6008 16.9357 32.7414 18.9625 31.1162V33.6008H23.1942V1.80078H9.22376ZM18.9625 22.3345C18.9625 26.2202 15.7933 29.3812 11.8984 29.3812C8.00359 29.3812 4.83331 26.2202 4.83331 22.3345C4.83331 18.4487 8.00251 15.2889 11.8984 15.2889C15.7943 15.2889 18.9625 18.4498 18.9625 22.3345Z"
        fill={tone === "light" ? "black" : "white"}
      />
    </svg>
  );
}

/** True when the bar is sitting on a white section (`data-nav="light"`). */
function useNavOnLight() {
  const [onLight, setOnLight] = useState(false);

  useLayoutEffect(() => {
    const read = () => {
      const bar = document.querySelector("[data-nav-bar]");
      const rect = bar?.getBoundingClientRect();
      const y = rect ? rect.top + rect.height / 2 : 48;
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const marked = stack.find(
        (el) => el instanceof HTMLElement && el.dataset.nav,
      );
      const next = marked instanceof HTMLElement && marked.dataset.nav === "light";
      setOnLight((prev) => (prev === next ? prev : next));
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  return onLight;
}

/**
 * Navbar stays the black bar on dark areas (hero photo, video, about
 * photograph, footer). On white sections it switches to the light bar.
 *
 * Mobile (<lg): hamburger + mark left, Book a Call right.
 * Desktop (lg+): full link + clock layout.
 */
export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onLight = useNavOnLight();
  const tone = onLight ? "light" : "dark";

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
        className={`mx-auto flex h-16 max-w-[1270px] items-center justify-between gap-4 rounded-[10px] border px-4 transition-colors duration-200 sm:px-6 lg:gap-6 ${
          onLight ? "border-black/10 bg-[#0000000D]" : "border-white/10 bg-black"
        }`}
      >
        <div className="flex items-center gap-3 lg:gap-10">
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center lg:hidden ${
              onLight ? "text-black" : "text-white"
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
            variant={onLight ? "dark" : "invert"}
            size="xs"
            href="/#talk"
            className={`shrink-0 ${onLight ? "!border-black" : ""}`}
          >
            Book a call
          </PillButton>
        </div>
      </div>

      {menuOpen ? (
          <div
          className={`fixed inset-0 top-0 z-40 pt-28 lg:hidden ${
            onLight ? "bg-white/80" : "bg-black/80"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav
            className={`mx-4 flex flex-col gap-6 rounded-[10px] border px-6 py-8 ${
              onLight ? "border-black/10 bg-white" : "border-white/10 bg-black"
            }`}
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
