"use client";

import { useState } from "react";
import Image from "next/image";
import { workFilters, workProjects, type WorkFilterId } from "@/data/workPage";

export function WorkGrid() {
  const [filter, setFilter] = useState<WorkFilterId>("all");
  const projects =
    filter === "all" ? workProjects : workProjects.filter((project) => project.category === filter);

  return (
    <div>
      <div className="flex gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-wrap lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {workFilters.map((item) => {
          const active = item.id === filter;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.id)}
              className={`h-10 shrink-0 border-b-2 px-2.5 font-satoshi text-[14px] leading-4 font-medium text-black uppercase ${
                active ? "border-[#FE5A28]" : "border-transparent"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-8 lg:mt-12 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-[46px]">
        {projects.map((project) => (
          <li key={project.id}>
            <a href="#" className="group block">
              <div className="relative aspect-[358/201] w-full overflow-hidden lg:aspect-[663/373]">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 663px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4 lg:items-center">
                <div className="flex min-w-0 flex-col gap-1 lg:flex-row lg:items-baseline lg:gap-6">
                  <p className="font-figtree text-[16px] leading-[26px] font-semibold tracking-[-0.4px] text-black lg:text-[20px]">
                    {project.name}
                  </p>
                  <p className="font-satoshi text-[16px] leading-[26px] font-normal tracking-[-0.1px] text-black lg:text-[20px]">
                    {project.service}
                  </p>
                </div>
                <img
                  src="/assets/images/work/arrow.svg"
                  alt=""
                  width={26.4398}
                  height={10.2501}
                  className="mt-2 shrink-0 lg:mt-0"
                />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
