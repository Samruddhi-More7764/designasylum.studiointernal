"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { clientHubNavItems } from "@/data/clientHub";
import type { ClientHubNavItem } from "@/cms/types";

/**
 * Clearance below the fixed navbar (mt-5 + h-16) plus a small gap.
 * Keep in sync with the Body aside `top-*` and section `scroll-mt-*`.
 */
export const CLIENT_HUB_STICKY_OFFSET_PX = 100;

const fallbackNavItems: ClientHubNavItem[] = clientHubNavItems.map((item) => ({
  id: item.id,
  label: item.label,
}));

/**
 * Sticky section scroller — left rail on Client Hub (lg+ only).
 * Active: #1F3128 + solid bar. Inactive: #1F312899.
 */
export function ClientHubScroller({
  items = fallbackNavItems,
  defaultActive,
}: {
  items?: ClientHubNavItem[];
  defaultActive?: string;
}) {
  const navItems = items.length ? items : fallbackNavItems;
  const navKey = navItems.map((item) => item.id).join("|");
  const [active, setActive] = useState(defaultActive || navItems[0]?.id || "");

  const ids = useMemo(() => navKey.split("|").filter(Boolean), [navKey]);

  useEffect(() => {
    function updateActive() {
      const last = ids[ids.length - 1];
      const lastEl = document.getElementById(last);
      // Short last block (Case Study teaser): activate it once its top has
      // crossed the sticky offset, or it is the last visible Body section.
      if (lastEl) {
        const lastRect = lastEl.getBoundingClientRect();
        if (lastRect.top <= CLIENT_HUB_STICKY_OFFSET_PX + 1) {
          setActive((prev) => (prev === last ? prev : last));
          return;
        }
      }

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= CLIENT_HUB_STICKY_OFFSET_PX + 1) {
          current = id;
        } else {
          break;
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    }

    updateActive();

    const hashId = window.location.hash.slice(1);
    if (ids.includes(hashId)) {
      setActive(hashId);
    }

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [ids]);

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    const top =
      el.getBoundingClientRect().top + window.scrollY - CLIENT_HUB_STICKY_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <nav
      aria-label="On this page"
      className="relative flex h-[222.25px] w-[295.77px] shrink-0 gap-[23.73px]"
    >
      <div
        className="relative h-full w-[4.06px] shrink-0 overflow-hidden rounded-[76.56px] bg-[#1F3128]/15"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 w-full rounded-[76.56px] bg-[#1F3128] transition-[top,height] duration-300"
          style={{
            top: `${(navItems.findIndex((i) => i.id === active) / navItems.length) * 100}%`,
            height: `${100 / navItems.length}%`,
          }}
        />
      </div>

      <ul className="flex flex-1 flex-col justify-between py-0">
        {navItems.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "block font-satoshi text-base font-medium capitalize leading-none transition-colors",
                  isActive ? "text-[#1F3128]" : "text-[#1F312899]",
                ].join(" ")}
                onClick={(event) => scrollToSection(event, item.id)}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
