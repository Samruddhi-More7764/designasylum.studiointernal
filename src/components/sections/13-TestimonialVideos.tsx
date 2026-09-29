import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { getTestimonials } from "@/cms/content";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

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
      <div className="mx-auto flex max-w-[1080px] flex-col gap-10 sm:gap-[60px]">
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
