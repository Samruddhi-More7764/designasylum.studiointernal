"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import type { JobCategoryId, JobRole } from "@/data/openRolesPage";

const metaIcons = {
  location: { src: "/assets/images/open-roles/location.svg", width: 16, height: 18 },
  employment: { src: "/assets/images/open-roles/clock.svg", width: 18, height: 18 },
  experience: { src: "/assets/images/open-roles/experience.svg", width: 16, height: 18 },
} as const;

export function JobBoard({
  categories,
  roles,
}: {
  categories: { id: JobCategoryId; label: string }[];
  roles: JobRole[];
}) {
  const [filter, setFilter] = useState<JobCategoryId>("ui-ux");

  const counts = useMemo(() => {
    const tally = new Map<JobCategoryId, number>();
    for (const category of categories) tally.set(category.id, 0);
    tally.set("all", roles.length);
    for (const role of roles) tally.set(role.category, (tally.get(role.category) ?? 0) + 1);
    return tally;
  }, [categories, roles]);

  const visible = roles.filter((role) => filter === "all" || role.category === filter);

  return (
    <div className="mx-auto grid w-full max-w-[1350px] grid-cols-1 items-start gap-8 lg:grid-cols-[233px_minmax(0,1fr)] lg:gap-x-[77px]">
      <nav
        aria-label="Role categories"
        className="flex gap-1 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:gap-0 lg:self-start"
      >
        {categories.map((category) => {
          const active = filter === category.id;
          const count = counts.get(category.id) ?? 0;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(category.id)}
              className={`flex h-8 shrink-0 items-center rounded-xl px-2 text-left font-satoshi leading-4 font-medium uppercase whitespace-nowrap lg:h-10 lg:px-4 lg:text-[14px] ${
                active
                  ? "bg-[#FE5A28] text-[12px] text-white lg:w-[233px] lg:rounded-xl lg:border-l-2 lg:border-[#FE5A28] lg:bg-[#FE5A28]/10 lg:text-[14px] lg:text-black"
                  : "bg-black/6 text-[14px] text-black lg:w-auto lg:rounded-none lg:bg-transparent"
              }`}
            >
              {category.label} ({count})
            </button>
          );
        })}
      </nav>

      <div className="min-w-0">
        {visible.length === 0 ? (
          <p className="border-t border-[#e5e5e5] py-6 font-satoshi text-[16px] text-black/70">
            No open roles in this category.
          </p>
        ) : (
          visible.map((role) => <JobCard key={role.id} role={role} />)
        )}
      </div>
    </div>
  );
}

function JobCard({ role }: { role: JobRole }) {
  const pills = [
    { key: "location" as const, label: role.location },
    { key: "employment" as const, label: role.employment },
    { key: "experience" as const, label: role.experience },
  ].filter((pill) => pill.label);

  return (
    <article className="flex flex-col gap-6 border-b border-black/30 pb-8 lg:flex-row lg:items-start lg:justify-between lg:gap-8 lg:border-t lg:border-b-0 lg:border-[#e5e5e5] lg:py-6">
      <div className="flex max-w-[623px] flex-col gap-3 lg:gap-4">
        <h2 className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-1.51px] text-black lg:text-[32px] lg:leading-[45px] lg:text-[#1f1f1f]">
          {role.title}
        </h2>
        <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[20px] lg:leading-[24px] lg:tracking-[-0.1px] lg:text-[#1f1f1f]">
          {role.summary}
        </p>
        <a
          href={`/open-roles/${role.slug}`}
          className="group inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full border border-black px-[17px] font-satoshi text-[12px] leading-4 font-medium text-black uppercase lg:hidden"
        >
          <CtaHoverLabel>{role.applyLabel}</CtaHoverLabel>
          <Image
            src="/assets/images/open-roles/apply-arrow.svg"
            alt=""
            width={10}
            height={13}
            unoptimized
            aria-hidden="true"
            className={ctaArrowClass}
          />
        </a>
        {pills.length ? (
          <ul className="mt-0 flex flex-wrap gap-2 lg:mt-2">
            {pills.map((pill) => {
              const icon = metaIcons[pill.key];
              return (
                <li
                  key={pill.key}
                  className="inline-flex h-10 items-center gap-1 rounded-full bg-[#edecec] px-3.5 font-figtree text-[12px] leading-[10px] font-medium tracking-[0.8px] text-[#4b4b4b] uppercase lg:h-[45px] lg:text-[14px]"
                >
                  <Image
                    src={icon.src}
                    alt=""
                    width={icon.width}
                    height={icon.height}
                    unoptimized
                    aria-hidden="true"
                  />
                  {pill.label}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <a
        href={`/open-roles/${role.slug}`}
        className="group mt-1 hidden h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-black px-[17px] font-satoshi text-[14px] leading-4 font-medium text-black uppercase lg:inline-flex"
      >
        <CtaHoverLabel>{role.applyLabel}</CtaHoverLabel>
        <Image
          src="/assets/images/open-roles/apply-arrow.svg"
          alt=""
          width={10}
          height={13}
          unoptimized
          aria-hidden="true"
          className={ctaArrowClass}
        />
      </a>
    </article>
  );
}
