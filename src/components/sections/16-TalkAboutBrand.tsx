"use client";

import { useState, type FormEvent } from "react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { FormSubmissionToast } from "@/components/ui/FormSubmissionToast";
import { PillButton } from "@/components/ui/PillButton";
import { SectionHeading, Accent } from "@/components/ui/SectionHeading";
import { submitContactLead } from "@/lib/submitContactLead";

const COMPANY_TYPE_OPTIONS = [
  { label: "Startup", value: "startup" },
  { label: "Enterprise", value: "enterprise" },
  { label: "Agency", value: "agency" },
];

const errorClass = "font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-[#cc1010]";

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
    <section
      id="talk"
      className="scroll-mt-[100px] bg-white px-5 py-16 sm:px-6 sm:py-24 lg:px-[60px]"
    >
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

        <form className="flex flex-col gap-5" noValidate onSubmit={onSubmit}>
          <Field label="Full Name*" htmlFor="talk-name">
            <input
              id="talk-name"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your Full Name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "talk-name-error" : undefined}
              onChange={() => clearField("fullName")}
              className={controlClass(Boolean(errors.fullName))}
            />
            <FieldError id="talk-name-error" message={errors.fullName} />
          </Field>

          <Field label="Work Email*" htmlFor="talk-email">
            <input
              id="talk-email"
              name="workEmail"
              type="email"
              autoComplete="email"
              placeholder="JonDoe@gmail.com"
              aria-invalid={Boolean(errors.workEmail)}
              aria-describedby={errors.workEmail ? "talk-email-error" : undefined}
              onChange={() => clearField("workEmail")}
              className={controlClass(Boolean(errors.workEmail))}
            />
            <FieldError id="talk-email-error" message={errors.workEmail} />
          </Field>

          <Field label="Mobile Number*" htmlFor="talk-phone">
            <CountryCodeSelect
              triggerClassName={`flex h-12 w-[84px] shrink-0 items-center justify-center gap-0.5 rounded-lg border bg-input-bg px-2 font-satoshi text-sm text-black ${errors.mobileNumber ? "border-[#cc1010]" : "border-transparent"}`}
            >
              <input
                id="talk-phone"
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="1234567890"
                aria-invalid={Boolean(errors.mobileNumber)}
                aria-describedby={errors.mobileNumber ? "talk-mobile-error" : undefined}
                onChange={() => clearField("mobileNumber")}
                className={`${controlClass(Boolean(errors.mobileNumber))} min-w-0 flex-1`}
              />
            </CountryCodeSelect>
            <FieldError id="talk-mobile-error" message={errors.mobileNumber} />
          </Field>

          <Field label="Company Type*" htmlFor="talk-company">
            <CustomSelect
              id="talk-company"
              name="companyType"
              value={companyType}
              onChange={(val) => {
                setCompanyType(val);
                clearField("companyType");
              }}
              options={COMPANY_TYPE_OPTIONS}
              placeholder="- Select -"
              invalid={Boolean(errors.companyType)}
              aria-describedby={errors.companyType ? "talk-company-error" : undefined}
            />
            <FieldError id="talk-company-error" message={errors.companyType} />
          </Field>

          <Field
            label="Tell us about your brand or project*"
            htmlFor="talk-message"
          >
            <textarea
              id="talk-message"
              name="message"
              rows={5}
              placeholder="Your message"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "talk-message-error" : undefined}
              onChange={() => clearField("message")}
              className={`w-full resize-none rounded-lg bg-input-bg px-4 py-3 font-satoshi text-sm text-black placeholder:text-black/40 outline-none border ${errors.message ? "border-[#cc1010]" : "border-transparent"}`}
            />
            <FieldError id="talk-message-error" message={errors.message} />
          </Field>

          {status === "error" && message ? (
            <p className="font-satoshi text-sm text-[#cc1010]" aria-live="polite">
              {message}
            </p>
          ) : null}

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

      <FormSubmissionToast
        show={status === "success"}
        onClose={() => setStatus("idle")}
      />
    </section>
  );
}
