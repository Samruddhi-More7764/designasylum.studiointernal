"use client";

import { useEffect, useState } from "react";

function readClock(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date());

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    hour: value("hour"),
    minute: value("minute"),
    period: value("dayPeriod").toUpperCase(),
  };
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative flex h-[34px] w-[34px] items-center justify-center overflow-hidden rounded-[6px] font-doto text-[20px] leading-5 font-black tracking-[1px] text-white/90">
      <span className="absolute inset-x-0 top-0 h-[16px] bg-black/20" aria-hidden="true" />
      <span className="absolute inset-x-0 bottom-0 h-[16px] bg-black/20" aria-hidden="true" />
      <span className="relative">{value}</span>
    </span>
  );
}

/** Local time overlay on the mobile office photographs. Hidden on desktop. */
export function OfficeClock({ timeZone }: { timeZone: string }) {
  const [clock, setClock] = useState(() => readClock(timeZone));

  useEffect(() => {
    const tick = () => setClock(readClock(timeZone));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <div className="absolute top-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-[11px] lg:hidden">
      <Digit value={clock.hour} />
      <Digit value={clock.minute} />
      <span className="font-figtree text-[14px] leading-5 tracking-[-0.14px] text-white uppercase">
        {clock.period}
      </span>
    </div>
  );
}
