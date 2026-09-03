"use client";

import { useEffect, useState } from "react";
import {
  clientHubNavItems,
  type ClientHubNavId,
} from "@/data/clientHub";

/**
 * Sticky section scroller — left rail on Client Hub.
 * Active: #1F3128 + solid bar. Inactive: #1F312899.
 */
export function ClientHubScroller({
  defaultActive = "about-client",
}: {
  defaultActive?: ClientHubNavId;
}) {
  const [active, setActive] = useState<ClientHubNavId>(defaultActive);

  useEffect(() => {
    const ids = clientHubNavItems.map((item) => item.id);

    // Recompute on every scroll tick instead of relying on IntersectionObserver
    // entry diffs, which only fire on enter/exit and can leave `active` stuck
    // on a previous (typically taller) section once the viewport has fully
    // passed it without a new section ever intersecting the same threshold.
    function updateActive() {
      // Bottom-of-page guard: short trailing sections (e.g. Case Study) may
      // never be tall enough to push their own top past the anchor line
      // below, since there's no more page left to scroll. Without this, the
      // rail gets stuck on the second-to-last section forever.
      const doc = document.documentElement;
      const maxScrollY = doc.scrollHeight - window.innerHeight;
      if (maxScrollY > 0 && window.scrollY >= maxScrollY - 2) {
        const last = ids[ids.length - 1];
        setActive((prev) => (prev === last ? prev : last));
        return;
      }

      const anchorY = window.innerHeight * 0.35;
      let current: ClientHubNavId = ids[0];

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        if (top <= anchorY) {
          current = id;
        } else {
          break;
        }
      }

      setActive((prev) => (prev === current ? prev : current));
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

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
            top: `${(clientHubNavItems.findIndex((i) => i.id === active) / clientHubNavItems.length) * 100}%`,
            height: `${100 / clientHubNavItems.length}%`,
          }}
        />
      </div>

      <ul className="flex flex-1 flex-col justify-between py-0">
        {clientHubNavItems.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "block font-satoshi text-base font-medium capitalize leading-none transition-colors",
                  isActive ? "text-[#1F3128]" : "text-[#1F312899]",
                ].join(" ")}
                onClick={() => setActive(item.id)}
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
