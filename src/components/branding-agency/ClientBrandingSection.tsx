"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { ResourceButton } from "@/components/branding-agency/ResourceButton";
import { Accent } from "@/components/ui/SectionHeading";
import { brandingProjects, clientBrandingTabs } from "@/data/brandingAgencyPage";

export function ClientBrandingSection({
  heading,
  headingBefore = "Clients we did ",
  headingAccent = "branding",
  headingAfter = " for",
  tabs = clientBrandingTabs,
  projects = brandingProjects,
  flushTop = false,
}: {
  heading?: ReactNode;
  headingBefore?: string;
  headingAccent?: string;
  headingAfter?: string;
  tabs?: readonly { id: string; label: string }[];
  projects?: ReadonlyArray<
    (typeof brandingProjects)[number] & { tab?: string }
  >;
  /** Drop the desktop top padding when the section sits under the hero. */
  flushTop?: boolean;
} = {}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "solution");
  const visible = projects.filter((project) => !project.tab || project.tab === active);

  return (
    <section
      className={`overflow-x-clip bg-white px-5 pt-0 sm:px-8 lg:px-[60px] ${
        flushTop ? "pb-0 lg:pt-0 lg:pb-0" : "pb-14 sm:pb-16 lg:pt-12 lg:pb-24"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-8 lg:gap-10">
        <h2 className="text-center font-figtree text-[28px] font-normal leading-none tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]">
          {heading ?? (
            <>
              {headingBefore}
              <Accent>{headingAccent}</Accent>
              {headingAfter}
            </>
          )}
        </h2>

        <div
          role="tablist"
          aria-label="Client branding filters"
          className="flex h-10 w-full items-end justify-between lg:mx-auto lg:max-w-[421px] lg:justify-center lg:gap-5"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`client-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="client-branding-panel"
                onClick={() => setActive(tab.id)}
                className={[
                  "shrink-0 border-b-2 pb-2 font-satoshi text-[14px] font-medium uppercase leading-4 tracking-[-0.5px] whitespace-nowrap",
                  selected
                    ? "border-footer-orange text-black"
                    : "border-transparent text-black/45",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="client-branding-panel"
          aria-labelledby={`client-tab-${active}`}
          className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12"
        >
          {visible.map((project) => (
            <article
              key={`${active}-${project.key}`}
              className="flex w-full flex-col gap-4"
            >
              <div className="relative aspect-[663/373] w-full overflow-hidden bg-[#f4f4f4]">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col items-start gap-3">
                <h3 className="font-figtree text-[22px] font-medium leading-[1.2] tracking-[-0.5px] text-black sm:text-[24px]">
                  {project.name}
                </h3>
                <p className="font-satoshi text-[15px] leading-snug tracking-[-0.3px] text-black/80 sm:text-[16px]">
                  {project.description}
                </p>
                <ResourceButton
                  href={project.href}
                  tone="outline"
                  className="!w-auto self-start"
                >
                  View website
                </ResourceButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
