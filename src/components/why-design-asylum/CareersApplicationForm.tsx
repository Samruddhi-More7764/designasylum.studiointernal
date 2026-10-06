"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { CountryCodeSelect } from "@/components/ui/CountryCodeSelect";
import { PillButton } from "@/components/ui/PillButton";
import { Accent } from "@/components/ui/SectionHeading";
import { careersForm } from "@/data/whyDesignAsylumPage";
import { submitContactLead } from "@/lib/submitContactLead";

const inputClasses =
  "h-12 w-full rounded-lg bg-input-bg px-4 font-satoshi text-base font-normal text-black placeholder:text-black/50 outline-none";

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
  const [cvName, setCvName] = useState("");
  const cvRef = useRef<HTMLInputElement>(null);

  function takeFile(file: File | undefined) {
    const input = cvRef.current;
    if (!file || !input) {
      setCvName("");
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    setCvName(file.name);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    takeFile(event.dataTransfer.files?.[0]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const portfolio = String(data.get("portfolio") ?? "").trim();
    const about = String(data.get("about") ?? "").trim();
    const note = [
      portfolio ? `Portfolio: ${portfolio}` : "",
      cvName ? `CV: ${cvName}` : "",
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
      setCvName("");
      setStatus("success");
      setMessage("Thanks — we will be in touch.");
    } catch {
      setStatus("error");
      setMessage("Could not save your details. Please try again.");
    }
  }

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

        <form className="flex w-full flex-col gap-6 lg:gap-[35px]" onSubmit={onSubmit}>
          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Full Name*</span>
            <input name="fullName" type="text" required autoComplete="name" placeholder="Your Full Name" className={inputClasses} />
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Work Email*</span>
            <input name="workEmail" type="email" required autoComplete="email" placeholder="JonDoe@gmail.com" className={inputClasses} />
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
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">What are you interested in?*</span>
            <span className="relative">
              <select name="interest" defaultValue="" required className={`${inputClasses} appearance-none pr-10`}>
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
          </label>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Portfolio/Website*</span>
            <input name="portfolio" type="url" required placeholder="https://yourwebsite.com" className={inputClasses} />
          </label>

          <div className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Upload CV*</span>
            <label
              onDragOver={(event) => event.preventDefault()}
              onDrop={onDrop}
              className="flex h-[221px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-input-bg px-6 text-center"
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
              <span className="font-satoshi text-base text-black/70">
                Drag and drop file here or <span className="text-black">choose file</span>
              </span>
              {cvName ? <span className="font-satoshi text-sm text-black">{cvName}</span> : null}
              <input
                ref={cvRef}
                name="cv"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="sr-only"
                onChange={(event) => setCvName(event.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>

          <label className="flex flex-col gap-2.5">
            <span className="font-satoshi text-[16px] leading-5 tracking-[-0.08px] text-black">Tell us about yourself</span>
            <textarea
              name="about"
              maxLength={500}
              placeholder="Your message"
              onChange={(event) => setCount(event.target.value.length)}
              className="h-[221px] w-full resize-none rounded-lg bg-input-bg px-4 py-4 font-satoshi text-base text-black placeholder:text-black/50 outline-none"
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
