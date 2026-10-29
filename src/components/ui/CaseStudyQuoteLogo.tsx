"use client";

import { useState } from "react";
import Image from "next/image";
import { CaseStudyQuoteIcon } from "@/components/ui/CaseStudyQuoteIcon";

export function CaseStudyQuoteLogo({
  src,
  alt,
  shape = "circle",
}: {
  src?: string | null;
  alt?: string | null;
  shape?: "circle" | "rectangle" | string | null;
}) {
  const [hasError, setHasError] = useState(false);
  const cleanSrc = src?.trim();
  const isRectangle = shape === "rectangle";

  if (!cleanSrc || hasError) {
    if (isRectangle) {
      return (
        <div
          className="flex h-[57px] w-[114px] items-center justify-center rounded-lg bg-[#f4f2ee] text-black/30"
          aria-hidden="true"
        >
          <CaseStudyQuoteIcon className="h-8 w-8" />
        </div>
      );
    }
    return <CaseStudyQuoteIcon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]" />;
  }

  if (isRectangle) {
    return (
      <Image
        src={cleanSrc}
        alt={alt || "Client logo"}
        width={114}
        height={57}
        className="h-[57px] w-[114px] object-contain"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <Image
      src={cleanSrc}
      alt={alt || "Client logo"}
      width={54}
      height={54}
      className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]"
      onError={() => setHasError(true)}
    />
  );
}
