"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { COUNTRY_DIAL_CODES } from "@/data/countryDialCodes";

/**
 * Country code control for a phone row. The list is anchored to the whole
 * mobile-number field (code + number), not the page, so it stays under that
 * field even when a parent is transformed.
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

  return (
    <div ref={rootRef} className={`relative w-full ${open ? "z-30" : ""}`}>
      <div className={`flex w-full ${rowClassName}`}>
        <input type="hidden" name={name} value={selected.dial} />
        <button
          type="button"
          className={triggerClassName}
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
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
        </button>
        {children}
      </div>

      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Country codes"
          className="absolute top-full left-0 z-30 mt-1 flex max-h-60 w-full flex-col overflow-hidden rounded-lg border border-black/10 bg-white text-black shadow-lg"
        >
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search country or code"
            className="h-10 shrink-0 border-b border-black/10 px-3 font-satoshi text-sm outline-none"
          />
          <ul className="min-h-0 flex-1 overflow-y-auto py-1">
            {countries.length ? (
              countries.map((country) => {
                const isSelected = country.iso === selected.iso;
                return (
                  <li key={country.iso}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-satoshi text-sm hover:bg-black/5 ${isSelected ? "bg-black/5" : ""}`}
                      onClick={() => {
                        setIso(country.iso);
                        setOpen(false);
                      }}
                    >
                      <span>{country.name}</span>
                      <span className="shrink-0 text-black/60">{country.dial}</span>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-2 font-satoshi text-sm text-black/50">
                No matches
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
