"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

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

export function ContactLeadForm() {
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
    <form
      onSubmit={onSubmit}
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
              required
              autoComplete="name"
              placeholder="Your Full Name"
              className={inputClasses}
            />
          </Field>

          <Field label="Work Email*" htmlFor="contact-email">
            <input
              id="contact-email"
              name="workEmail"
              type="email"
              required
              autoComplete="email"
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
                required
                inputMode="numeric"
                autoComplete="tel-national"
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
            required
            placeholder="Your Full Name"
            className="h-[127px] w-full resize-none rounded-lg bg-[#F2EFEA] p-4 font-satoshi text-base font-normal leading-none tracking-[-0.5%] text-black placeholder:text-black/50 outline-none"
          />
        </div>

        <p
          className="min-h-5 w-full text-center font-satoshi text-sm text-white"
          aria-live="polite"
        >
          {message}
        </p>

        <PillButton
          variant="dark"
          size="lg"
          type="submit"
          disabled={status === "submitting"}
          className="h-[56px] w-[290px] justify-between !border-black !px-[19.84px] font-satoshi text-[14px] font-medium leading-4 tracking-normal disabled:opacity-50"
        >
          {status === "submitting" ? "Sending" : "Submit"}
        </PillButton>
      </div>
    </form>
  );
}
