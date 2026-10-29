"use client";

import { useState, type FormEvent } from "react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { FormSubmissionToast } from "@/components/ui/FormSubmissionToast";
import { PillButton } from "@/components/ui/PillButton";
import { SplitHeading } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

const COMPANY_TYPE_OPTIONS = [
  { label: "Startup", value: "startup" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Agency", value: "agency" },
];

const inputClasses =
  "h-12 w-full rounded-lg bg-input-bg px-4 font-satoshi text-base font-normal text-black placeholder:text-black/50 outline-none";

const errorClass = "font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-[#cc1010]";

type FieldErrors = Partial<{
  fullName: string;
  workEmail: string;
  mobileNumber: string;
  companyType: string;
}>;

function validName(value: string) {
  const name = value.trim();
  return name.length >= 2;
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 4 && digits.length <= 15;
}

function fieldErrors(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("fullName") ?? "");
  if (!name.trim()) errors.fullName = "Please enter your full name";
  else if (!validName(name)) errors.fullName = "Please enter a valid name";

  const email = String(data.get("workEmail") ?? "");
  if (!email.trim()) errors.workEmail = "Please enter your email address";
  else if (!validEmail(email)) errors.workEmail = "Please enter a valid email address";

  const mobile = String(data.get("mobileNumber") ?? "");
  if (!mobile.trim()) errors.mobileNumber = "Please enter your mobile number";
  else if (!validMobile(mobile)) errors.mobileNumber = "Please enter a valid mobile number";

  if (!String(data.get("companyType") ?? "").trim()) {
    errors.companyType = "Please select your company type";
  }
  return errors;
}

function controlClass(invalid: boolean) {
  return `${inputClasses} border ${invalid ? "border-[#cc1010]" : "border-transparent"}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={errorClass} role="alert">
      {message}
    </p>
  );
}

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
  const [companyType, setCompanyType] = useState("");
  const [count, setCount] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearField(name: keyof FieldErrors) {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = fieldErrors(data);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setMessage("");
      return;
    }

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
      setCompanyType("");
      setCount(0);
      setErrors({});
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

  return (
    <section
      id="contact-form"
      className="scroll-mt-32 bg-white px-5 pt-16 pb-[120px] sm:px-8 lg:px-[60px] lg:pt-20 lg:pb-[200px]"
    >
      <div className="mx-auto grid w-full max-w-[1362px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,688px)] lg:gap-x-16">
        <div className="flex flex-col gap-6 lg:max-w-[420px] lg:gap-9 lg:pt-1">
          <h2 className="max-w-[320px] font-figtree text-[32px] leading-none font-normal tracking-[-1px] text-[#05201F] lg:text-[44px] lg:tracking-[-2px]">
            <SplitHeading before={before} accent={accent} after={after} />
          </h2>
          <p className="max-w-[420px] font-satoshi text-[16px] leading-[1.3] font-normal tracking-[-0.1px] text-black lg:text-[20px] lg:leading-[25.9px]">
            {body}
          </p>
        </div>

        <form className="flex w-full flex-col gap-6 lg:gap-[35px]" noValidate onSubmit={onSubmit}>
          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Full Name*</span>
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your Full Name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "contact-name-error" : undefined}
              onChange={() => clearField("fullName")}
              className={controlClass(Boolean(errors.fullName))}
            />
            <FieldError id="contact-name-error" message={errors.fullName} />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Work Email*</span>
            <input
              name="workEmail"
              type="email"
              autoComplete="email"
              placeholder="JonDoe@gmail.com"
              aria-invalid={Boolean(errors.workEmail)}
              aria-describedby={errors.workEmail ? "contact-email-error" : undefined}
              onChange={() => clearField("workEmail")}
              className={controlClass(Boolean(errors.workEmail))}
            />
            <FieldError id="contact-email-error" message={errors.workEmail} />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Mobile Number*</span>
            <CountryCodeSelect
              triggerClassName={`flex h-12 w-[68px] shrink-0 items-center justify-center gap-0.5 rounded-lg border bg-input-bg px-2 font-satoshi text-base text-black ${errors.mobileNumber ? "border-[#cc1010]" : "border-transparent"}`}
            >
              <input
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="1234567890"
                aria-invalid={Boolean(errors.mobileNumber)}
                aria-describedby={errors.mobileNumber ? "contact-mobile-error" : undefined}
                onChange={() => clearField("mobileNumber")}
                className={`${controlClass(Boolean(errors.mobileNumber))} min-w-0 flex-1`}
              />
            </CountryCodeSelect>
            <FieldError id="contact-mobile-error" message={errors.mobileNumber} />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">
              Company Type*
            </span>
            <CustomSelect
              name="companyType"
              value={companyType}
              onChange={(val) => {
                setCompanyType(val);
                clearField("companyType");
              }}
              options={COMPANY_TYPE_OPTIONS}
              placeholder="- Select -"
              invalid={Boolean(errors.companyType)}
              aria-describedby={errors.companyType ? "contact-company-error" : undefined}
            />
            <FieldError id="contact-company-error" message={errors.companyType} />
          </div>

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

          {status === "error" && message ? (
            <p className="font-satoshi text-sm text-[#FF3838]" aria-live="polite">
              {message}
            </p>
          ) : null}

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

      <FormSubmissionToast
        show={status === "success"}
        onClose={() => setStatus("idle")}
      />
    </section>
  );
}
