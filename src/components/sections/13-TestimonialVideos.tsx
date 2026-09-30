import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { getTestimonials } from "@/cms/content";
import { TestimonialCard } from "@/components/sections/TestimonialCard";

/**
 * Video testimonials — 992 wide. 16px between the three cards.
 * Each card is 320px. A click enlarges that card and hides the quote.
 */
export async function TestimonialVideos() {
  const testimonials = await getTestimonials();

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex w-full max-w-[992px] flex-col gap-[60px]">
        <SectionHeading className="text-center text-[26px] font-medium tracking-[-0.8px] text-ink sm:text-[32px] lg:text-[40px] lg:tracking-[-1px]">
          Client words, backing the <Accent>brand strategy</Accent> results
        </SectionHeading>

        <div className="mx-auto grid w-full grid-cols-1 items-start justify-center gap-4 lg:grid-cols-3 lg:gap-4">
          {testimonials.map((item, i) => (
            <TestimonialCard key={`${item.alt}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
