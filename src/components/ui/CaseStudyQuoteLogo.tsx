"use client";

import { useState } from "react";
import Image from "next/image";
import { CaseStudyQuoteIcon } from "@/components/ui/CaseStudyQuoteIcon";

export function CaseStudyQuoteLogo({
  src,
  alt,
}: {
  src?: string | null;
  alt?: string | null;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <CaseStudyQuoteIcon className="h-10 w-10 sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]" />;
  }

  return (
    <Image
      src={src}
      alt={alt || "Client logo"}
      width={54}
      height={54}
      className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12 lg:h-[54px] lg:w-[54px]"
      onError={() => setHasError(true)}
    />
  );
}
