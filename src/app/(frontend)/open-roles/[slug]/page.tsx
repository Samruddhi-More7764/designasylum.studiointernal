import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { Breadcrumbs } from "@/components/branding-agency/Breadcrumbs";
import { CtaHoverLabel, ctaArrowClass } from "@/components/ui/CtaHoverLabel";
import { getFooter } from "@/cms/content";
import { getOpenRole } from "@/cms/openRolesPage";

export const revalidate = 120;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getOpenRole(slug);
  if (!detail) return { title: "Open role" };
  return {
    title: detail.role.title,
    description: detail.role.summary,
  };
}

export default async function OpenRolePage({ params }: PageProps) {
  const { slug } = await params;
  const [detail, footer] = await Promise.all([getOpenRole(slug), getFooter()]);
  if (!detail) notFound();

  const { role, dutiesHeading, lookingHeading } = detail;
  const facts = [
    { label: "Location", value: role.detailLocation },
    { label: "Experience", value: role.detailExperience },
    { label: "Type", value: role.detailType },
  ].filter((fact) => fact.value);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <article className="bg-white px-4 pt-10 pb-24 lg:px-[60px] lg:pt-20 lg:pb-[120px]">
          <header className="mx-auto flex w-full max-w-[1136px] flex-col items-center gap-6 text-center lg:gap-8">
            <Breadcrumbs
              items={[
                { label: "Careers", href: "/why-design-asylum" },
                { label: "Open roles", href: "/open-roles" },
              ]}
              current={role.breadcrumb}
            />
            <h1 className="font-figtree text-[32px] leading-[1.2] font-normal tracking-[-2px] text-black capitalize lg:text-[56px] lg:tracking-[-0.5px]">
              {role.title}
            </h1>
            <a
              href={role.applyNowHref}
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black bg-black px-5 font-satoshi text-[12px] leading-4 font-medium text-white uppercase lg:h-14 lg:text-[14px]"
            >
              <CtaHoverLabel>{role.applyNowLabel}</CtaHoverLabel>
              <Image
                src="/assets/images/open-roles/apply-now-arrow.svg"
                alt=""
                width={10}
                height={13}
                unoptimized
                aria-hidden="true"
                className={ctaArrowClass}
              />
            </a>
          </header>

          <div className="mx-auto mt-12 flex w-full max-w-[1024px] flex-col gap-6 rounded-xl bg-[rgba(237,236,236,0.7)] px-4 py-6 lg:mt-10 lg:rounded-3xl lg:p-12">
            {facts.length ? (
              <dl className="flex flex-col gap-2.5 font-satoshi text-[20px] leading-[1.2] tracking-[-0.5px] text-black lg:text-[24px] lg:leading-[26px]">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="inline font-medium">{fact.label}: </dt>
                    <dd className="inline font-normal">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <div className="flex flex-col gap-[18px]">
              <p className="font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:text-[20px] lg:leading-[26px]">
                {role.summary}
              </p>
              <DetailList heading={dutiesHeading} items={role.responsibilities} />
              <DetailList heading={lookingHeading} items={role.requirements} />
            </div>
          </div>
        </article>
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}

function DetailList({ heading, items }: { heading: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-satoshi text-[24px] leading-[26px] font-medium tracking-[-0.5px] text-black">
        {heading}
      </h2>
      <ul className="list-disc pl-6 font-satoshi text-[16px] leading-[1.2] font-normal tracking-[-0.5px] text-black lg:pl-[30px] lg:text-[20px] lg:leading-[26px]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
