"use client";

import { useDocumentInfo, useField } from "@payloadcms/ui";
import { useEffect, useRef } from "react";

function idOf(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) return Number(value);
  if (typeof value === "object" && "id" in value) {
    return idOf((value as { id: unknown }).id);
  }
  return null;
}

/**
 * The media drawer only stores the file. This writes `details.logo` onto the
 * case study as soon as the chosen file changes, so the public page updates
 * without a separate document save or a code change.
 */
export function PersistQuoteLogo() {
  const { value } = useField<unknown>({ path: "details.logo" });
  const { id, data, setData } = useDocumentInfo();
  const savedId = idOf(
    data && typeof data.details === "object" && data.details
      ? (data.details as { logo?: unknown }).logo
      : undefined,
  );
  const currentId = idOf(value);
  const dataRef = useRef(data);
  const setDataRef = useRef(setData);
  const pending = useRef<string | null>(null);
  dataRef.current = data;
  setDataRef.current = setData;

  useEffect(() => {
    if (id == null || currentId === savedId) return;
    const key = `${id}:${currentId ?? ""}`;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (cancelled || pending.current === key) return;
      pending.current = key;
      void fetch("/api/case-study-quote-logo", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, logo: currentId }),
      })
        .then(async (res) => {
          if (!res.ok) {
            pending.current = null;
            return;
          }
          const current = dataRef.current ?? {};
          const details =
            current.details && typeof current.details === "object"
              ? (current.details as Record<string, unknown>)
              : {};
          setDataRef.current({
            ...current,
            details: { ...details, logo: currentId },
          });
        })
        .catch(() => {
          pending.current = null;
        });
    }, 300);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [id, currentId, savedId]);

  return null;
}
