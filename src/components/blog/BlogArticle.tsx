import Image from "next/image";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { StickyTableOfContents } from "@/components/branding-agency/StickyTableOfContents";
import { Accent } from "@/components/ui/SectionHeading";
import {
  sevenloopLead,
  sevenloopSections,
  sevenloopTopics,
  type ArticleBlock,
  type TextPart,
} from "@/data/sevenloopArticle";

const paragraphClass =
  "font-satoshi text-[16px] leading-[1.45] font-normal tracking-[-0.5px] text-black sm:text-[18px] lg:text-[20px] lg:leading-[25.9px]";

const headingClass =
  "font-figtree text-[28px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] sm:text-[36px] lg:text-[44px] lg:tracking-[-2.09px]";

function RichText({ parts }: { parts: TextPart[] }) {
  return (
    <p className={paragraphClass}>
      {parts.map((part, index) =>
        typeof part === "string" ? (
          <span key={index}>{part}</span>
        ) : (
          <span key={index} className="font-medium">
            {part.strong}
          </span>
        ),
      )}
    </p>
  );
}

function ArrowList({ items }: { items: { lead?: string; rest: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={`${item.lead ?? ""}-${item.rest}`} className="flex items-start gap-3 px-3">
          <span className="relative mt-1 h-6 w-6 shrink-0" aria-hidden="true">
            <Image
              src="/assets/images/branding-agency/pointer-shaft.png"
              alt=""
              width={19}
              height={2}
              unoptimized
              className="absolute top-1/2 left-0 h-[2px] w-[19px] -translate-y-1/2"
            />
            <Image
              src="/assets/images/branding-agency/pointer-head.png"
              alt=""
              width={8}
              height={14}
              unoptimized
              className="absolute top-1/2 right-0 h-[14px] w-[8px] -translate-y-1/2"
            />
          </span>
          <p className={paragraphClass}>
            {item.lead ? <span className="font-medium">{item.lead} </span> : null}
            {item.rest}
          </p>
        </li>
      ))}
    </ul>
  );
}

function BlockView({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "paragraphs":
      return (
        <div className="flex flex-col gap-4">
          {block.items.map((item) => (
            <p key={item} className={paragraphClass}>
              {item}
            </p>
          ))}
        </div>
      );
    case "rich":
      return <RichText parts={block.parts} />;
    case "subhead":
      return (
        <div className="flex flex-col gap-2">
          <h3 className="font-satoshi text-[20px] leading-[1.3] font-medium tracking-[-0.5px] text-black lg:text-[24px]">
            {block.title}
          </h3>
          {block.body ? <p className={paragraphClass}>{block.body}</p> : null}
        </div>
      );
    case "arrows":
      return <ArrowList items={block.items} />;
    case "rows":
      return (
        <ul className="w-full">
          {block.items.map((row) => (
            <li
              key={row.label}
              className="flex flex-col gap-1 border-t border-black/10 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <span className="font-satoshi text-[16px] leading-5 font-medium text-[#12110D] capitalize">
                {row.label}
              </span>
              <span className="font-satoshi text-[14px] leading-5 text-[#12110D] sm:text-right">
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <div className="relative h-[220px] w-full overflow-hidden rounded-xl sm:h-[360px] lg:h-[515px]">
          <Image src={block.src} alt={block.alt} fill sizes="(min-width: 1024px) 932px, 100vw" className="object-cover" />
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {block.srcs.map((src) => (
            <div key={src} className="relative h-[195px] overflow-hidden rounded-xl">
              <Image src={src} alt={block.alt} fill sizes="300px" className="object-cover" />
            </div>
          ))}
        </div>
      );
    case "quote":
      return (
        <figure className="flex flex-col gap-6 rounded-2xl bg-[#D5D5D533] p-6 sm:p-8">
          <blockquote className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[32px]">
            {block.quote}
          </blockquote>
          <figcaption className="flex items-center gap-2">
            <Image src="/assets/images/blog/avatar.png" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
            <span className="flex flex-col gap-1">
              <span className="font-satoshi text-[14px] leading-[1.2] font-medium tracking-[-0.5px] text-black capitalize">
                {block.name}
              </span>
              <span className="font-satoshi text-[10px] leading-[1.2] tracking-[-0.5px] text-black uppercase">
                {block.role}
              </span>
            </span>
          </figcaption>
        </figure>
      );
    case "note":
      return (
        <aside className="flex flex-col gap-2 rounded-2xl border-l-4 border-[#FE5A28] bg-[#D5D5D533] p-6 sm:p-8">
          {block.kicker ? (
            <p className="font-satoshi text-[16px] leading-[1.4] tracking-[-0.5px] text-black uppercase">
              {block.kicker}
            </p>
          ) : null}
          <p className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[32px]">
            {block.body}
          </p>
        </aside>
      );
    case "links":
      return (
        <aside className="flex flex-col gap-2 rounded-2xl border-l-4 border-[#FE5A28] bg-[#D5D5D533] p-6 sm:p-8">
          <p className="font-satoshi text-[16px] leading-[1.4] tracking-[-0.5px] text-black uppercase">
            {block.kicker}
          </p>
          <div className="font-figtree text-[24px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[32px]">
            {block.items.map((item) => (
              <a key={item.href} href={item.href} className="block hover:opacity-70">
                {item.label}
              </a>
            ))}
          </div>
        </aside>
      );
    default:
      return null;
  }
}

export function BlogArticle() {
  return (
    <>
      <header className="bg-white px-4 pt-10 lg:pt-20">
        <div className="mx-auto flex w-full max-w-[1136px] flex-col items-center gap-4 text-center lg:gap-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Blogs", href: "/blogs" },
            ]}
            current="Sevenloop Brand Website Redesign"
          />
          <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize lg:text-[56px]">
            Sevenloop <Accent className="text-[32px] tracking-[-2.09px] normal-case lg:text-[56px]">Rebrand</Accent>
            {" & Webflow Site: "}
            <span className="block">A 5-Month Case Study</span>
          </h1>
          <p className="max-w-[842px] font-satoshi text-[12px] leading-[1.2] tracking-[-0.5px] text-black uppercase lg:text-[14px]">
            How Sevenloop went from B2B product company to enterprise-ready brand in 5 months — repositioning, identity, Webflow build, and the conversations it opened.
          </p>
          <p className="flex items-center gap-1 font-satoshi text-[14px] leading-[1.2] tracking-[-0.5px] text-black capitalize">
            <Image src="/assets/images/blog/avatar.png" alt="" width={24} height={24} className="size-6 rounded-full object-cover" />
            Tanmaya Rao
            <span className="text-black/50">• Sept 28, 2026</span>
          </p>
        </div>
        <div
          aria-hidden="true"
          className="mx-auto mt-8 h-[220px] w-full max-w-[1150px] rounded-[8.6px] bg-black sm:h-[420px] lg:mt-8 lg:h-[647px]"
        />
      </header>

      <section className="bg-white px-5 pt-16 sm:px-8 lg:px-[60px] lg:pt-20">
        <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-10 lg:flex-row lg:items-start lg:gap-[72px]">
          <StickyTableOfContents
            items={sevenloopSections.map((section) => ({ id: section.id, label: section.label }))}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-16 lg:max-w-[932px] lg:gap-20">
            <p className="font-figtree text-[22px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] sm:text-[28px] lg:text-[32px] lg:tracking-[-2.09px]">
              {sevenloopLead}
            </p>
            {sevenloopSections.map((section) => (
              <article key={section.id} id={section.id} className="flex scroll-mt-[100px] flex-col gap-6">
                <h2 className={headingClass}>
                  {section.before}
                  {section.accent ? <Accent>{section.accent}</Accent> : null}
                  {section.after}
                </h2>
                {section.blocks.map((block, index) => (
                  <BlockView key={`${section.id}-${index}`} block={block} />
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function ArticleTopics() {
  return (
    <section className="bg-white px-5 pt-16 pb-4 sm:px-8 lg:px-[60px] lg:pt-[120px] lg:pb-10">
      <div className="mx-auto flex w-full max-w-[881px] flex-col items-center gap-10 lg:gap-16">
        <h2 className="text-center font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-[#05201F] lg:text-[44px] lg:leading-[62.6px]">
          Solutions <Accent>we </Accent>offer
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-[11px]">
          {sevenloopTopics.map((topic, index) => (
            <li
              key={topic}
              className="inline-flex items-center gap-2 rounded-xl border border-black/30 px-3"
            >
              <span className="size-6 shrink-0 rounded bg-[#D9D9D9]" aria-hidden="true" />
              <span
                className={`font-figtree text-[16px] leading-[45px] font-normal tracking-[-1px] text-black lg:text-[20px] lg:tracking-[-1.51px] ${index === 0 ? "capitalize" : ""}`}
              >
                {topic}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ArticleAuthor() {
  return (
    <section className="bg-white px-5 pb-8 sm:px-8 lg:px-[60px]">
      <div className="mx-auto flex w-full max-w-[1081px] flex-col items-start gap-6 rounded-2xl bg-[#D5D5D533] p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <Image
          src="/assets/images/blog/author.png"
          alt=""
          width={250}
          height={250}
          className="size-[140px] shrink-0 rounded-full object-cover sm:size-[180px] lg:size-[250px]"
        />
        <div className="flex flex-col gap-4 lg:h-[226px] lg:justify-between">
          <div>
            <p className="font-figtree text-[28px] leading-[1.2] font-normal tracking-[-0.5px] text-black capitalize lg:text-[44px]">
              Athira Krishnan
            </p>
            <p className="mt-1 font-satoshi text-[14px] leading-[1.2] tracking-[-0.5px] text-black uppercase lg:text-[20px]">
              Lead Designer | Content Strategist
            </p>
          </div>
          <p className="max-w-[767px] font-figtree text-[18px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[24px]">
            Articulate with a clear thought process, she excels in content writing, driving design in B2B SaaS and B2C websites.
          </p>
        </div>
      </div>
    </section>
  );
}
