"use client";

import { useRef, useSyncExternalStore } from "react";

interface LiveClockProps {
  /** Display label, e.g. "India" or "New Jersey, USA" — from Group 63.png */
  label: string;
  /** IANA time zone, e.g. "Asia/Kolkata" */
  timeZone: string;
  className?: string;
}

interface ClockParts {
  hour: string;
  minute: string;
  dayPeriod: string;
  offset: string;
}

function getClockParts(timeZone: string): ClockParts {
  const now = new Date();

  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(now);

  const offsetParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  }).formatToParts(now);

  return {
    hour: timeParts.find((p) => p.type === "hour")?.value.padStart(2, "0") ?? "--",
    minute: timeParts.find((p) => p.type === "minute")?.value ?? "--",
    dayPeriod: (
      timeParts.find((p) => p.type === "dayPeriod")?.value ?? "AM"
    ).toUpperCase(),
    offset:
      offsetParts.find((p) => p.type === "timeZoneName")?.value ?? "GMT",
  };
}

function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}

/**
 * Live clock for the navbar (Group 63.png).
 *
 * Confirmed decisions:
 * - Correct live timezones (Asia/Kolkata, America/New_York) — not the
 *   inconsistent GMT+1/+2 literals in the Figma placeholder.
 * - Flip-clock digit chips match the zoomed export (HH and MM in separate
 *   rounded boxes), with AM/PM + real GMT offset beside them.
 * - Digits update live; no flip animation (page remains otherwise static).
 */
export function LiveClock({ label, timeZone, className = "" }: LiveClockProps) {
  const cacheRef = useRef<ClockParts | null>(null);

  const getSnapshot = () => {
    const next = getClockParts(timeZone);
    const prev = cacheRef.current;
    if (
      prev &&
      prev.hour === next.hour &&
      prev.minute === next.minute &&
      prev.dayPeriod === next.dayPeriod &&
      prev.offset === next.offset
    ) {
      return prev;
    }
    cacheRef.current = next;
    return next;
  };

  const parts = useSyncExternalStore<ClockParts | null>(
    subscribe,
    getSnapshot,
    () => null,
  );

  return (
    <div className={`flex flex-col gap-1 leading-tight ${className}`}>
      <span className="font-figtree text-[10px] uppercase tracking-wider text-white/80">
        {label}
      </span>
      <span className="flex items-center gap-1 font-figtree text-xs text-white">
        <span className="rounded-[3px] bg-white/10 px-1 py-px tabular-nums">
          {parts?.hour ?? "--"}
        </span>
        <span className="rounded-[3px] bg-white/10 px-1 py-px tabular-nums">
          {parts?.minute ?? "--"}
        </span>
        <span className="ml-1 text-[10px] uppercase text-white/80">
          {parts?.dayPeriod ?? "AM"} ({parts?.offset ?? "GMT"})
        </span>
      </span>
    </div>
  );
}
