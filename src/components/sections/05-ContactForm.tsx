import Image from "next/image";
import { ContactLeadForm } from "@/components/sections/ContactLeadForm";

/**
 * Contact form — Homepage after Services.
 *
 * Desktop (lg+): absolute form in aspect box — same coordinates as before.
 * Mobile (<lg): normal-flow single-column form; no aspect lock.
 * Negative pull under Services is max-lg only.
 */
export function ContactForm() {
  return (
    <section className="relative z-0 w-full overflow-hidden bg-white max-lg:-mt-24 max-lg:bg-transparent max-lg:pt-24">
      {/*
        Mobile-only continuous background (no aspect trap).
        TOP image: kept pulled up so blue sits behind the heading.
        TOP melt: soft white→transparent band so the first visible pixels
        under Services are near-white (no hard seam). BOTTOM: unchanged.
        Desktop layers below are untouched.
      */}
      <div className="pointer-events-none absolute inset-0 lg:hidden" aria-hidden="true">
        <div className="absolute inset-x-0 -top-[20%] h-[75%]">
          <Image
            src="/assets/images/contact-form-bg-top-mobile.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
            priority
          />
        </div>
        {/* Soft Services → Contact join (mobile only). Does not affect bottom fade. */}
        <div
          className="absolute inset-x-0 top-0 z-[1] h-[13rem]"
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 48%, rgba(255,255,255,0.9) 56%, rgba(255,255,255,0.62) 66%, rgba(255,255,255,0.32) 76%, rgba(255,255,255,0.1) 88%, rgba(255,255,255,0) 100%)",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-[28%] bottom-0">
          <Image
            src="/assets/images/contact-form-bg-bottom-mobile.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[1470px] lg:aspect-[1470/1374]">
        {/* Desktop backgrounds — original aspect geometry */}
        <div
          className="absolute inset-x-0 top-0 hidden aspect-[1470/839] overflow-hidden lg:block"
          aria-hidden="true"
        >
          <Image
            src="/assets/images/contact-form-bg-top.png"
            alt=""
            fill
            sizes="1470px"
            className="object-cover"
          />
        </div>

        <div
          className="absolute inset-x-0 top-[calc(604/1374*100%)] hidden aspect-[1470/770] overflow-hidden lg:block"
          aria-hidden="true"
        >
          <Image
            src="/assets/images/contact-form-bg-bottom.png"
            alt=""
            fill
            sizes="1470px"
            className="object-cover"
          />
        </div>

        <ContactLeadForm />
      </div>
    </section>
  );
}
