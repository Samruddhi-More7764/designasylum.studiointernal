"use client";

import { useState, type FormEvent } from "react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { FormSubmissionToast } from "@/components/ui/FormSubmissionToast";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

const COMPANY_TYPE_OPTIONS = [
  { label: "Startup", value: "startup" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Agency", value: "agency" },
];

const errorClass = "font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-[#FFB4B4]";

type FieldErrors = Partial<{
  fullName: string;
  workEmail: string;
  mobileNumber: string;
  companyType: string;
  message: string;
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

  const message = String(data.get("message") ?? "");
  if (!message.trim()) {
    errors.message = "Please enter your message";
  }

  return errors;
}

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

export function ContactLeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function clearField(name: keyof FieldErrors) {
    setStatus("idle");
    setMessage("");
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
      const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus?.();
      }
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
      setErrors({});
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

  return (
    <form
      noValidate
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
        <div className="grid w-full grid-cols-1 items-start justify-items-stretch gap-5 lg:grid-cols-2 lg:justify-items-center lg:gap-x-[35px] lg:gap-y-6">
          <Field label="Full Name*" htmlFor="contact-name">
            <input
              id="contact-name"
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
          </Field>

          <Field label="Work Email*" htmlFor="contact-email">
            <input
              id="contact-email"
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
          </Field>

          <Field label="Mobile Number*" htmlFor="contact-phone">
            <CountryCodeSelect
              rowClassName="gap-[8.83px]"
              triggerClassName={`flex h-12 w-[84px] shrink-0 items-center justify-center gap-0.5 rounded-lg border bg-[#F2EFEA] px-2 font-satoshi text-base text-black ${errors.mobileNumber ? "border-[#cc1010]" : "border-transparent"}`}
            >
              <input
                id="contact-phone"
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
          </Field>

          <Field label="Company Type*" htmlFor="contact-company">
            <CustomSelect
              id="contact-company"
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
            placeholder="Your message"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            onChange={() => clearField("message")}
            className={`h-[127px] w-full resize-none rounded-lg bg-[#F2EFEA] p-4 font-satoshi text-base font-normal leading-none tracking-[-0.5%] text-black placeholder:text-black/50 outline-none border ${errors.message ? "border-[#cc1010]" : "border-transparent"}`}
          />
          <FieldError id="contact-message-error" message={errors.message} />
        </div>

        {status === "error" && message ? (
          <p
            className="w-full text-center font-satoshi text-sm text-[#FFB4B4]"
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}

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

      <FormSubmissionToast
        show={status === "success"}
        onClose={() => setStatus("idle")}
      />
    </form>
  );
}
