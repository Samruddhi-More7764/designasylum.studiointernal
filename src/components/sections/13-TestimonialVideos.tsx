import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { CmsMediaFill } from "@/components/ui/CmsMediaFill";
import { getTestimonials } from "@/cms/content";
import type { Testimonial } from "@/data/testimonials";

function TestimonialCard({
  item,
  featured = false,
}: {
  item: Testimonial;
  featured?: boolean;
}) {
  const frameClass = featured
    ? "aspect-[290/320] lg:aspect-[290/360]"
    : "aspect-[290/320] lg:aspect-[290/240]";

  return (
    <div className="flex flex-col gap-4">
      <div className={`relative w-full overflow-hidden rounded-2xl ${frameClass}`}>
        <CmsMediaFill
          image={item.image}
          video={item.video}
          alt={item.alt}
          sizes="(min-width: 1024px) 290px, 100vw"
        />
      </div>
      {item.quote ? (
        <p className="rounded-2xl border border-hairline bg-white px-5 py-4 text-center font-satoshi text-sm leading-relaxed text-muted lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-left">
          {item.quote}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Video testimonials — Frame 2095588036: 992 × 536px, gap 60px, centered.
 * Cards come from CMS (add/remove). The second card is the taller featured one
 * when at least two exist.
 */
export async function TestimonialVideos() {
  const testimonials = await getTestimonials();
  const featuredIndex = testimonials.length >= 2 ? 1 : -1;

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-[992px] flex-col gap-10 sm:gap-[60px]">
        <SectionHeading className="text-center text-[26px] font-medium tracking-[-0.8px] text-ink sm:text-[32px] lg:text-center lg:text-[40px] lg:tracking-[-1px]">
          Client words, backing the <Accent>brand strategy</Accent> results
        </SectionHeading>

        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-3 lg:gap-[60px]">
          {testimonials.map((item, i) => (
            <TestimonialCard
              key={`${item.alt}-${i}`}
              item={item}
              featured={i === featuredIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
