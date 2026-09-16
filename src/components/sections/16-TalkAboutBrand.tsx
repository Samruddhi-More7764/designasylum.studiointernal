"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-satoshi text-[13px] text-black">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "h-12 w-full rounded-lg bg-input-bg px-4 font-satoshi text-sm text-black placeholder:text-black/40 outline-none";

/**
 * "Let's talk about your brand" — Homepage bottom contact form
 * (left heading + right stacked fields). Posts to the same Google Sheet
 * as the first homepage form.
 *
 * Mobile: stacked heading + full-width single-column form.
 * Desktop (lg+): 2-col layout unchanged.
 */
export function TalkAboutBrand() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

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
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

  return (
    <section className="bg-white px-5 py-16 sm:px-6 sm:py-24 lg:px-[60px]">
      <div className="mx-auto grid max-w-[1332px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20">
        <div className="flex flex-col gap-4 sm:gap-5 lg:pt-2">
          <SectionHeading className="max-w-[420px] text-[32px] font-medium leading-[1.15] tracking-[-0.8px] text-ink sm:text-[40px] lg:text-[48px] lg:tracking-[-1px]">
            Let&apos;s talk about <Accent>your</Accent> brand
          </SectionHeading>
          <p className="max-w-[360px] font-satoshi text-[15px] leading-relaxed text-muted sm:text-base">
            Tell us what you&rsquo;re building. We reply within a day, usually
            with questions, sometimes with opinions.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <Field label="Full Name*" htmlFor="talk-name">
            <input
              id="talk-name"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              placeholder="Your Full Name"
              className={inputClasses}
            />
          </Field>

          <Field label="Work Email*" htmlFor="talk-email">
            <input
              id="talk-email"
              name="workEmail"
              type="email"
              required
              autoComplete="email"
              placeholder="JonDoe@gmail.com"
              className={inputClasses}
            />
          </Field>

          <Field label="Mobile Number*" htmlFor="talk-phone">
            <div className="flex gap-2">
              <span className="flex h-12 shrink-0 items-center gap-1 rounded-lg bg-input-bg px-3 font-satoshi text-sm text-black">
                +91
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <input
                id="talk-phone"
                name="mobileNumber"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="1234567890"
                className={inputClasses}
              />
            </div>
          </Field>

          <Field label="Company Type*" htmlFor="talk-company">
            <div className="relative">
              <select
                id="talk-company"
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
            </div>
          </Field>

          <Field
            label="Tell us about your brand or project*"
            htmlFor="talk-message"
          >
            <textarea
              id="talk-message"
              name="message"
              rows={5}
              required
              placeholder="Your message"
              className="w-full resize-none rounded-lg bg-input-bg px-4 py-3 font-satoshi text-sm text-black placeholder:text-black/40 outline-none"
            />
          </Field>

          <p className="min-h-5 font-satoshi text-sm text-muted" aria-live="polite">
            {message}
          </p>

          <div className="pt-2">
            <PillButton
              variant="dark"
              size="lg"
              type="submit"
              disabled={status === "submitting"}
              className="h-[56px] w-full max-w-[290px] justify-between !border-black !px-[19.84px] font-satoshi text-[14px] font-medium leading-4 tracking-normal disabled:opacity-50"
            >
              {status === "submitting" ? "Sending" : "Submit"}
            </PillButton>
          </div>
        </form>
      </div>
    </section>
  );
}
