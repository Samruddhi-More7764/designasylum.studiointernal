import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";

interface FieldProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, className = "", children }: FieldProps) {
  return (
    <div
      className={`flex w-full flex-col gap-2.5 lg:max-w-[232px] ${className}`}
    >
      <label
        htmlFor={htmlFor}
        className="font-satoshi text-base font-medium leading-[20.47px] tracking-[-0.5%] text-white"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "h-12 w-full rounded-lg bg-[#F2EFEA] px-4 font-satoshi text-base font-normal leading-none tracking-[-0.5%] text-black placeholder:text-black/50 outline-none";

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

        <form
          action="#"
          className="relative z-10 mx-auto flex w-full max-w-[499px] flex-col items-center gap-8 px-5 py-16 lg:absolute lg:top-[calc(396/1374*100%)] lg:left-1/2 lg:w-[min(100%,688px)] lg:max-w-[688px] lg:-translate-x-1/2 lg:gap-11 lg:px-4 lg:py-0"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <h2 className="max-w-[636px] font-figtree text-[28px] font-medium leading-tight tracking-[-1.5px] text-white sm:text-[36px] sm:leading-none sm:tracking-[-2px] lg:text-[44px]">
              Let&apos;s <Accent>Create</Accent> Something Exceptional
            </h2>
            <p className="max-w-[545px] font-satoshi text-[15px] font-medium leading-snug tracking-[-0.5%] text-white sm:text-[18px] sm:leading-[25.9px] lg:text-[20.24px]">
              From strategy and design to development and marketing, we&apos;re
              ready when you are.
            </p>
          </div>

          <div className="flex w-full max-w-[499px] flex-col items-center gap-5 sm:gap-6">
            <div className="grid w-full grid-cols-1 justify-items-stretch gap-5 lg:grid-cols-2 lg:justify-items-center lg:gap-x-[35px] lg:gap-y-6">
              <Field label="Full Name*" htmlFor="contact-name">
                <input
                  id="contact-name"
                  name="fullName"
                  type="text"
                  placeholder="Your Full Name"
                  className={inputClasses}
                />
              </Field>

              <Field label="Work Email*" htmlFor="contact-email">
                <input
                  id="contact-email"
                  name="workEmail"
                  type="email"
                  placeholder="JonDoe@gmail.com"
                  className={inputClasses}
                />
              </Field>

              <Field label="Mobile Number*" htmlFor="contact-phone">
                <div className="flex w-full gap-[8.83px]">
                  <span className="flex h-12 w-[68px] shrink-0 items-center justify-center gap-0.5 rounded-lg bg-[#F2EFEA] px-2 font-satoshi text-base text-black">
                    +91
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <input
                    id="contact-phone"
                    name="mobileNumber"
                    type="tel"
                    placeholder="1234567890"
                    className={`${inputClasses} min-w-0 flex-1`}
                  />
                </div>
              </Field>

              <Field label="Company Type*" htmlFor="contact-company">
                <div className="relative">
                  <select
                    id="contact-company"
                    name="companyType"
                    defaultValue=""
                    className={`${inputClasses} appearance-none pr-10`}
                  >
                    <option value="" disabled>
                      - Select -
                    </option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="agency">Agency</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-black"
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </div>

            <div className="flex w-full flex-col gap-2.5">
              <label
                htmlFor="contact-message"
                className="font-satoshi text-base font-medium leading-[20.47px] tracking-[-0.5%] text-white"
              >
                Tell us about your brand or project*
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Your Full Name"
                className="h-[127px] w-full resize-none rounded-lg bg-[#F2EFEA] p-4 font-satoshi text-base font-normal leading-none tracking-[-0.5%] text-black placeholder:text-black/50 outline-none"
              />
            </div>

            <PillButton
              variant="dark"
              size="lg"
              type="button"
              className="h-[56px] w-[290px] justify-between !border-black !px-[19.84px] font-satoshi text-[14px] font-medium leading-4 tracking-normal"
            >
              Submit
            </PillButton>
          </div>
        </form>
      </div>
    </section>
  );
}
