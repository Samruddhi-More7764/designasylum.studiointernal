"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  id?: string;
  name: string;
  options: (string | SelectOption)[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  triggerClassName?: string;
  "aria-describedby"?: string;
  "aria-label"?: string;
}

function normalizeOptions(options: (string | SelectOption)[]): SelectOption[] {
  return options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt,
  );
}

export function CustomSelect({
  id,
  name,
  options: rawOptions,
  placeholder = "- Select -",
  value: controlledValue,
  defaultValue = "",
  onChange,
  required = false,
  disabled = false,
  invalid = false,
  className = "",
  triggerClassName = "",
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const selectId = useId();
  const inputId = id || selectId;
  const listboxId = `${inputId}-listbox`;
  const rootRef = useRef<HTMLDivElement>(null);
  const options = normalizeOptions(rawOptions);

  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Close on outside click or blur
  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSelect(val: string) {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(0);
      } else {
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0,
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightedIndex(options.length - 1);
      } else {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1,
        );
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open && highlightedIndex >= 0 && options[highlightedIndex]) {
        handleSelect(options[highlightedIndex].value);
      } else {
        setOpen((prev) => !prev);
      }
    } else if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
    }
  }

  const baseBorder = invalid
    ? "border-[#cc1010]"
    : "border-transparent";

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${open ? "z-40" : "z-10"} ${className}`}
    >
      {/* Hidden input for HTML form submissions / FormData */}
      <input
        type="hidden"
        name={name}
        id={inputId}
        value={selectedValue}
        required={required}
      />

      {/* Dropdown Trigger */}
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-describedby={ariaDescribedBy}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`flex h-12 w-full items-center justify-between rounded-lg bg-input-bg px-4 font-satoshi text-base text-black transition-colors outline-none cursor-pointer border ${baseBorder} ${triggerClassName}`}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-black" : "text-black/50"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-black transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu Options */}
      {open && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute top-full left-0 right-0 z-50 mt-2 w-full overflow-hidden rounded-lg border border-black/5 bg-input-bg p-1 shadow-[0_4px_24px_rgba(0,0,0,0.08)] max-h-60 overflow-y-auto"
        >
          {options.map((option, idx) => {
            const isSelected = option.value === selectedValue;
            const isHighlighted = idx === highlightedIndex;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={`flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-left font-satoshi text-base text-black transition-colors duration-150 ${
                  isSelected || isHighlighted
                    ? "bg-[#e2ddd6] font-medium"
                    : "bg-transparent hover:bg-[#e2ddd6]"
                }`}
              >
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
