"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

const inputClasses =
  "h-12 w-full rounded-lg bg-input-bg px-4 font-satoshi text-base font-normal text-black placeholder:text-black/50 outline-none";

export function ContactInquiryForm({
  before = "Let's talk about ",
  accent = "your ",
  after = "brand",
  body = "Tell us what you're building. We reply within a day, usually with questions, sometimes with opinions.",
}: {
  before?: string;
  accent?: string;
  after?: string;
  body?: string;
} = {}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("submitting");
    setMessage("");

    try {
      const result = await submitContactLead({
        fullName: data.get("fullName"),
        workEmail: data.get("workEmail"),
        countryCode: data.get("countryCode"),
        mobileNumber: data.get("mobileNumber"),
        companyType: data.get("companyType"),
        message: data.get("message"),
      });

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error || "Could not save your details. Please try again.");
        return;
      }

      form.reset();
      setCount(0);
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

  return (
    <section className="bg-white px-5 pt-16 pb-[120px] sm:px-8 lg:px-[60px] lg:pt-20 lg:pb-[200px]">
      <div className="mx-auto grid w-full max-w-[1362px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,688px)] lg:gap-x-16">
        <div className="flex flex-col gap-6 lg:max-w-[420px] lg:gap-9 lg:pt-1">
          <h2 className="max-w-[320px] font-figtree text-[32px] leading-none font-normal tracking-[-1px] text-[#05201F] lg:text-[44px] lg:tracking-[-2px]">
            {before}
            <Accent>{accent}</Accent>
            {after}
          </h2>
          <p className="max-w-[420px] font-satoshi text-[16px] leading-[1.3] font-normal tracking-[-0.1px] text-black lg:text-[20px] lg:leading-[25.9px]">
            {body}
          </p>
        </div>

        <form className="flex w-full flex-col gap-6 lg:gap-[35px]" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Full Name*</span>
            <input
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Your Full Name"
              className={inputClasses}
            />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Work Email*</span>
            <input
              name="workEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="JonDoe@gmail.com"
              className={inputClasses}
            />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Mobile Number*</span>
            <CountryCodeSelect triggerClassName="flex h-12 w-[68px] shrink-0 items-center justify-center gap-0.5 rounded-lg bg-input-bg px-2 font-satoshi text-base text-black">
              <input
                name="mobileNumber"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="1234567890"
                className={`${inputClasses} min-w-0 flex-1`}
              />
            </CountryCodeSelect>
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Company Type*</span>
            <span className="relative">
              <select
                name="companyType"
                defaultValue=""
                required
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
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-black"
                aria-hidden="true"
              />
            </span>
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">
              Tell us about your brand or project
            </span>
            <textarea
              name="message"
              maxLength={500}
              placeholder="Your message"
              onChange={(event) => setCount(event.target.value.length)}
              className="h-[221px] w-full resize-none rounded-lg bg-input-bg px-4 py-4 font-satoshi text-base text-black placeholder:text-black/50 outline-none"
            />
            <span className="text-right font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-black">
              {count}/500
            </span>
          </label>

          <p className="min-h-5 font-satoshi text-sm text-black/70" aria-live="polite">
            {message}
          </p>

          <PillButton
            variant="dark"
            size="lg"
            type="submit"
            disabled={status === "submitting"}
            className="h-[56px] w-full max-w-[290px] justify-between !border-black !px-5 font-satoshi text-[14px] font-medium leading-4 tracking-normal disabled:opacity-50"
          >
            {status === "submitting" ? "Sending" : "Submit"}
          </PillButton>
        </form>
      </div>
    </section>
  );
}
