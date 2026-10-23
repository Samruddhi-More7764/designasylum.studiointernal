"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { COUNTRY_DIAL_CODES } from "@/data/countryDialCodes";

/**
 * Country code control for a phone row. The list is anchored to the whole
 * mobile-number field (code + number), not the page, so it stays under that
 * field even when a parent is transformed.
 *
 * Dropdown design follows the Figma specification (node 1579-738 & 1579-764):
 * - Container background: #eeebe7 with rounded-[14px] and soft shadow
 * - Option hover / active state: #ecddd4 rounded-[8px]
 * - Rotating chevron indicator
 */
export function CountryCodeSelect({
  name = "countryCode",
  triggerClassName,
  rowClassName = "gap-2",
  children,
}: {
  name?: string;
  triggerClassName: string;
  rowClassName?: string;
  children: ReactNode;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [iso, setIso] = useState("IN");
  const [query, setQuery] = useState("");
  const selected =
    COUNTRY_DIAL_CODES.find((country) => country.iso === iso) ?? {
      iso: "IN",
      name: "India",
      dial: "+91",
    };

  const countries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return COUNTRY_DIAL_CODES;
    return COUNTRY_DIAL_CODES.filter((country) => {
      const haystack = `${country.name} ${country.dial} ${country.iso}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [query]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openBorder = open
    ? triggerClassName.includes("#cc1010")
      ? ""
      : "!border-[#e7643a]"
    : "";

  return (
    <div ref={rootRef} className={`relative w-full ${open ? "z-40" : "z-10"}`}>
      <div className={`flex w-full ${rowClassName}`}>
        <input type="hidden" name={name} value={selected.dial} />
        <button
          type="button"
          className={`${triggerClassName} ${openBorder} transition-colors cursor-pointer`}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`Country code ${selected.dial}`}
          onClick={() => {
            setQuery("");
            setOpen((current) => !current);
          }}
        >
          {selected.dial}
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
        {children}
      </div>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Country codes"
          className="absolute top-full left-0 z-50 mt-2 flex max-h-64 w-full flex-col overflow-hidden rounded-[14px] border border-black/5 bg-[#eeebe7] p-2 text-black shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]"
        >
          <div className="px-1 pb-1.5">
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search country or code..."
              className="h-9 w-full rounded-[8px] bg-black/[0.04] px-3 font-satoshi text-sm text-black placeholder:text-black/40 outline-none transition-colors border border-transparent focus:border-black/10 focus:bg-white/70"
            />
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto flex flex-col gap-0.5 px-0.5 py-0.5">
            {countries.length ? (
              countries.map((country) => {
                const isSelected = country.iso === selected.iso;
                return (
                  <li key={country.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3.5 py-2 text-left font-satoshi text-sm transition-colors duration-150 ${
                        isSelected
                          ? "bg-[#ecddd4] font-medium text-black"
                          : "text-black hover:bg-[#ecddd4]"
                      }`}
                      onClick={() => {
                        setIso(country.iso);
                        setOpen(false);
                      }}
                    >
                      <span className="truncate">{country.name}</span>
                      <span className="shrink-0 font-medium text-black/60">
                        {country.dial}
                      </span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-3 text-center font-satoshi text-sm text-black/50">
                No matches found
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
