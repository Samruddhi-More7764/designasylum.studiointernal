import Image from "next/image";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { testimonials, type Testimonial } from "@/data/testimonials";

function TestimonialCard({
  item,
  featured = false,
}: {
  item: Testimonial;
  featured?: boolean;
}) {
  // Frame 2095588036.png: play/pause + name/role are baked into the cropped
  // thumbnails. Center card is taller on desktop; mobile uses uniform cards
  // with bordered quote boxes beneath.
  return (
    <div className="flex flex-col gap-4">
      <div
        className={`relative w-full overflow-hidden rounded-2xl ${
          featured
            ? "aspect-[290/320] lg:aspect-[290/360]"
            : "aspect-[290/320] lg:aspect-[290/240]"
        }`}
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className="object-cover"
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
 * Three cards; center card is the active/taller one with no quote beneath.
 * Mobile: single column. Desktop (lg+): 3-col.
 */
export function TestimonialVideos() {
  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-[992px] flex-col gap-10 sm:gap-[60px]">
        <SectionHeading className="text-center text-[26px] font-medium tracking-[-0.8px] text-ink sm:text-[32px] lg:text-center lg:text-[40px] lg:tracking-[-1px]">
          Client words, backing the <Accent>brand strategy</Accent> results
        </SectionHeading>

        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-3 lg:gap-[60px]">
          <TestimonialCard item={testimonials[0]} />
          <TestimonialCard item={testimonials[1]} featured />
          <TestimonialCard item={testimonials[2]} />
        </div>
      </div>
    </section>
  );
}
