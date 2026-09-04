"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
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
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-figtree text-[13px] font-medium uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-70"
    >
      {children}
    </button>
  );
}

/**
 * Navbar logomark — Figma Group 61 (24×36 desktop, ~15×21 mobile).
 */
function LogoMark() {
  return (
    <Image
      src="/assets/images/nav-logomark.png"
      alt="Design Asylum"
      width={24}
      height={36}
      priority
      className="h-[21.2px] w-[15.06px] shrink-0 object-contain lg:h-9 lg:w-6"
    />
  );
}

/**
 * Navbar — Group 63 / Homepage: 1270 × 64px, top ~19px,
 * background #00000033, ~10px radius.
 *
 * Mobile (<lg): hamburger + mark left, Book a Call right.
 * Desktop (lg+): unchanged full link + clock layout.
 */
export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className="fixed inset-x-0 top-0 z-50 mt-5 w-full px-4">
      <div className="mx-auto flex h-16 max-w-[1270px] items-center justify-between gap-4 rounded-[10px] border border-border-subtle bg-nav-overlay px-4 backdrop-blur-sm sm:px-6 lg:gap-6">
        <div className="flex items-center gap-3 lg:gap-10">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
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

          <LogoMark />

          <nav className="hidden items-center gap-8 lg:flex">
            {LEFT_NAV_LINKS.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <div className="hidden items-center gap-8 xl:flex">
            <LiveClock label="India" timeZone="Asia/Kolkata" />
            <LiveClock label="New Jersey, USA" timeZone="America/New_York" />
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {RIGHT_NAV_LINKS.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </nav>

          <PillButton variant="invert" size="xs" className="shrink-0">
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
          <nav className="mx-4 flex flex-col gap-6 rounded-[10px] border border-border-subtle bg-nav-overlay px-6 py-8 backdrop-blur-md">
            {ALL_NAV_LINKS.map((link) => (
              <NavLink key={link} onClick={() => setMenuOpen(false)}>
                {link}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
