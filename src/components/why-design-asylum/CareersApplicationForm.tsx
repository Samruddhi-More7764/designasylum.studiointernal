"use client";

import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { ChevronDown, X } from "lucide-react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";
import { careersForm } from "@/data/whyDesignAsylumPage";
import { submitContactLead } from "@/lib/submitContactLead";

const inputClasses =
  "h-12 w-full rounded-lg bg-input-bg px-4 font-satoshi text-base font-normal text-black placeholder:text-black/50 outline-none";

const errorClass = "font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-[#cc1010]";

const acceptedCv = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

type FieldErrors = Partial<{
  fullName: string;
  workEmail: string;
  mobileNumber: string;
  interest: string;
  portfolio: string;
  cv: string;
}>;

type CvUpload =
  | { status: "empty" }
  | { status: "uploading"; file: File; progress: number }
  | { status: "done"; file: File };

function validName(value: string) {
  const name = value.trim();
  return name.length >= 2 && /^[\p{L}][\p{L}\s.'’-]*$/u.test(name);
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function validMobile(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function validWebsite(value: string) {
  const raw = value.trim();
  if (!raw) return false;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function acceptedFile(file: File) {
  if (acceptedCv.has(file.type)) return true;
  return /\.(pdf|doc|docx)$/i.test(file.name);
}

function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function fieldErrors(data: FormData, cv: CvUpload): FieldErrors {
  const errors: FieldErrors = {};
  if (!validName(String(data.get("fullName") ?? ""))) errors.fullName = "Please enter a valid name";
  if (!validEmail(String(data.get("workEmail") ?? ""))) {
    errors.workEmail = "Please enter a valid email address";
  }
  if (!validMobile(String(data.get("mobileNumber") ?? ""))) {
    errors.mobileNumber = "Please enter a valid mobile number";
  }
  if (!String(data.get("interest") ?? "").trim()) {
    errors.interest = "Please select your area of interest";
  }
  if (!validWebsite(String(data.get("portfolio") ?? ""))) errors.portfolio = "Invalid website URL";
  if (cv.status !== "done") errors.cv = "Please upload your CV to continue";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={errorClass} role="alert">
      {message}
    </p>
  );
}

export function CareersApplicationForm({
  titleBefore = careersForm.titleBefore,
  titleAccent = careersForm.titleAccent,
  titleAfter = careersForm.titleAfter,
  dek = careersForm.dek,
  interests = careersForm.interests,
}: {
  titleBefore?: string;
  titleAccent?: string;
  titleAfter?: string;
  dek?: string;
  interests?: string[];
} = {}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [cv, setCv] = useState<CvUpload>({ status: "empty" });
  const cvRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (cv.status !== "uploading") return;
    const file = cv.file;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(100, Math.round(((now - started) / 1200) * 100));
      if (progress >= 100) {
        setCv({ status: "done", file });
        return;
      }
      setCv({ status: "uploading", file, progress });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [cv.status === "uploading" ? cv.file : null]);

  function clearField(name: keyof FieldErrors) {
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function takeFile(file: File | undefined) {
    if (!file || !acceptedFile(file)) return;
    setCv({ status: "uploading", file, progress: 0 });
    clearField("cv");
  }

  function clearCv() {
    if (cvRef.current) cvRef.current.value = "";
    setCv({ status: "empty" });
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    takeFile(event.dataTransfer.files?.[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const nextErrors = fieldErrors(data, cv);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      setMessage("");
      return;
    }

    const portfolio = String(data.get("portfolio") ?? "").trim();
    const about = String(data.get("about") ?? "").trim();
    const file = cv.status === "done" ? cv.file : null;
    const note = [
      portfolio ? `Portfolio: ${portfolio}` : "",
      file ? `CV: ${file.name}` : "",
      about,
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("submitting");
    setMessage("");

    try {
      const result = await submitContactLead({
        fullName: data.get("fullName"),
        workEmail: data.get("workEmail"),
        countryCode: data.get("countryCode"),
        mobileNumber: data.get("mobileNumber"),
        companyType: data.get("interest"),
        message: note,
      });

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error || "Could not save your details. Please try again.");
        return;
      }

      form.reset();
      setCount(0);
      clearCv();
      setErrors({});
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

  const cvFile = cv.status === "empty" ? null : cv.file;

  return (
    <section id="apply" className="scroll-mt-[100px] bg-white px-5 pt-16 pb-[120px] sm:px-8 lg:px-[60px] lg:pt-[120px] lg:pb-[200px]">
      <div className="mx-auto grid w-full max-w-[1362px] grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,688px)] lg:gap-x-16">
        <div className="flex flex-col gap-6 lg:max-w-[420px] lg:pt-1">
          <h2 className="max-w-[368px] font-figtree text-[32px] leading-[1.2] font-normal tracking-[-1px] text-[#05201F] lg:text-[44px] lg:tracking-[-2px]">
            {titleBefore}
            <Accent className="text-[32px] tracking-[-2.09px] lg:text-[44px]">{titleAccent}</Accent>
            {titleAfter}
          </h2>
          <p className="max-w-[420px] font-satoshi text-[16px] leading-[1.3] font-normal tracking-[-0.1px] text-black lg:text-[20px] lg:leading-[25.9px]">
            {dek}
          </p>
        </div>

        <form ref={formRef} className="flex w-full flex-col gap-6 lg:gap-[35px]" noValidate onSubmit={onSubmit}>
          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Full Name*</span>
            <input
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your Full Name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "career-name-error" : undefined}
              onChange={() => clearField("fullName")}
              className={inputClasses}
            />
            <FieldError id="career-name-error" message={errors.fullName} />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Work Email*</span>
            <input
              name="workEmail"
              type="email"
              autoComplete="email"
              placeholder="JonDoe@gmail.com"
              aria-invalid={Boolean(errors.workEmail)}
              aria-describedby={errors.workEmail ? "career-email-error" : undefined}
              onChange={() => clearField("workEmail")}
              className={inputClasses}
            />
            <FieldError id="career-email-error" message={errors.workEmail} />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Mobile Number*</span>
            <CountryCodeSelect triggerClassName="flex h-12 w-[68px] shrink-0 items-center justify-center gap-0.5 rounded-lg bg-input-bg px-2 font-satoshi text-base text-black">
              <input
                name="mobileNumber"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="1234567890"
                aria-invalid={Boolean(errors.mobileNumber)}
                aria-describedby={errors.mobileNumber ? "career-mobile-error" : undefined}
                onChange={() => clearField("mobileNumber")}
                className={`${inputClasses} min-w-0 flex-1`}
              />
            </CountryCodeSelect>
            <FieldError id="career-mobile-error" message={errors.mobileNumber} />
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">What are you interested in?*</span>
            <span className="relative">
              <select
                name="interest"
                defaultValue=""
                aria-invalid={Boolean(errors.interest)}
                aria-describedby={errors.interest ? "career-interest-error" : undefined}
                onChange={() => clearField("interest")}
                className={`${inputClasses} appearance-none pr-10`}
              >
                <option value="" disabled>
                  - Select -
                </option>
                {interests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-black" aria-hidden="true" />
            </span>
            <FieldError id="career-interest-error" message={errors.interest} />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Portfolio/Website*</span>
            <input
              name="portfolio"
              type="text"
              inputMode="url"
              placeholder="https://yourwebsite.com"
              aria-invalid={Boolean(errors.portfolio)}
              aria-describedby={errors.portfolio ? "career-portfolio-error" : undefined}
              onChange={() => clearField("portfolio")}
              className={inputClasses}
            />
            <FieldError id="career-portfolio-error" message={errors.portfolio} />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Upload CV*</span>
            {cv.status === "empty" ? (
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={onDrop}
                className="flex h-[188px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-input-bg px-6 text-center lg:h-[221px]"
              >
                <img
                  src="/assets/images/why-design-asylum/upload-cv-mobile.svg"
                  alt=""
                  width={17.5}
                  height={21.5}
                  className="lg:hidden"
                />
                <img
                  src="/assets/images/why-design-asylum/upload-cv.svg"
                  alt=""
                  width={22.8334}
                  height={28.1667}
                  className="hidden lg:block"
                />
                <span className="font-satoshi text-[16px] tracking-[-0.08px] text-black">
                  Drag and drop file here or <span className="font-bold underline">choose file</span>
                </span>
                <input
                  ref={cvRef}
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(event) => takeFile(event.target.files?.[0])}
                />
              </label>
            ) : (
              <div
                className={`flex min-h-[90px] items-center gap-3 rounded-xl border border-dashed py-4 pr-3 pl-4 ${
                  cv.status === "done"
                    ? "border-[#02521f] bg-[rgba(15,159,68,0.05)]"
                    : "border-[#181f1f] bg-white"
                }`}
              >
                <PdfMark />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-satoshi text-[14px] font-medium tracking-[-0.07px] text-black lg:text-[16px] lg:tracking-[-0.08px]">
                    {cvFile?.name}
                  </p>
                  <p className="font-satoshi text-[12px] tracking-[-0.06px] text-black lg:text-[14px] lg:tracking-[-0.07px]">
                    {cv.status === "uploading" ? `Uploading..${cv.progress}%` : formatSize(cv.file.size)}
                  </p>
                  {cv.status === "uploading" ? (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-black/15">
                      <div className="h-full bg-[#FE5A28]" style={{ width: `${cv.progress}%` }} />
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={clearCv}
                  aria-label={cv.status === "uploading" ? "Cancel upload" : "Remove file"}
                  className="flex size-6 shrink-0 items-center justify-center text-black"
                >
                  <X className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            )}
            <FieldError id="career-cv-error" message={errors.cv} />
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Tell us about yourself</span>
            <textarea
              name="about"
              maxLength={500}
              placeholder="Your message"
              onChange={(event) => setCount(event.target.value.length)}
              className="h-[188px] w-full resize-none rounded-lg bg-input-bg px-4 py-4 font-satoshi text-base text-black placeholder:text-black/50 outline-none lg:h-[221px]"
            />
            <span className="text-right font-satoshi text-[14px] leading-5 tracking-[-0.07px] text-black">{count}/500</span>
          </label>

          <p className="min-h-5 font-satoshi text-sm text-black/70" aria-live="polite">
            {message}
          </p>

          <PillButton
            variant="dark"
            size="lg"
            type="submit"
            disabled={status === "submitting" || cv.status === "uploading"}
            className="mx-auto h-11 w-[198px] justify-between !border-black !px-5 font-satoshi text-[14px] font-medium leading-4 tracking-normal disabled:opacity-50 lg:mx-0 lg:h-14 lg:w-full lg:max-w-[290px]"
          >
            {status === "submitting" ? "Sending" : "Submit"}
          </PillButton>
        </form>
      </div>
    </section>
  );
}

function PdfMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0 lg:size-6" aria-hidden="true">
      <path fill="#E5252A" d="M6 2.5h7.2L18 7.3V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V4A1.5 1.5 0 0 1 6.5 2.5H6Z" />
      <path fill="#fff" d="M13 2.8V7h4.2" opacity=".9" />
      <text x="12" y="16.5" textAnchor="middle" fill="#fff" fontSize="5.2" fontFamily="Arial, sans-serif" fontWeight="700">
        PDF
      </text>
    </svg>
  );
}
