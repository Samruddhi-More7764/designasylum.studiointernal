import type { ReactNode } from "react";

function CheckRow({ width }: { width: string }) {
  return (
    <div className="flex h-12 items-center gap-2 border-b border-black/10 last:border-b-0">
      <img src="/assets/images/studio/check.svg" alt="" className="size-[17px] shrink-0" />
      <span className={`h-5 rounded bg-[rgba(58,133,227,0.2)] ${width}`} />
    </div>
  );
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="w-[min(258px,78%)] rounded-[18px] border border-black/10 bg-white px-4 py-2 shadow-sm">
      {children}
    </div>
  );
}

function ChatMark() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black text-white">
      <svg width="10" height="14" viewBox="0 0 24 36" fill="none" aria-hidden="true">
        <path
          d="M9.22376 1.80078V6.02147H18.9625V13.5506C16.9357 11.9255 14.4932 11.066 11.8984 11.066C5.66906 11.066 0.601562 16.1203 0.601562 22.3334C0.601562 28.5465 5.66906 33.6008 11.8984 33.6008C14.4932 33.6008 16.9357 32.7414 18.9625 31.1162V33.6008H23.1942V1.80078H9.22376ZM18.9625 22.3345C18.9625 26.2202 15.7933 29.3812 11.8984 29.3812C8.00359 29.3812 4.83331 26.2202 4.83331 22.3345C4.83331 18.4487 8.00251 15.2889 11.8984 15.2889C15.7943 15.2889 18.9625 18.4498 18.9625 22.3345Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function FitIllustration({ index, tone }: { index: number; tone: "right" | "miss" }) {
  const wash =
    tone === "right"
      ? "bg-gradient-to-b from-[rgba(58,133,227,0.12)] to-transparent"
      : "bg-gradient-to-b from-[rgba(254,91,41,0.12)] to-transparent";

  return (
    <div className={`flex aspect-[332/256] h-auto w-full items-center justify-center rounded-2xl lg:aspect-auto lg:h-[313px] ${wash}`}>
      {index === 0 && tone === "right" ? (
        <Panel>
          <div className="flex h-9 items-center gap-2 border-b border-black/10">
            <img src="/assets/images/studio/plus.svg" alt="" className="size-4" />
            <span className="font-satoshi text-[15px] font-medium text-black">Your project</span>
          </div>
          <CheckRow width="w-36" />
          <CheckRow width="w-16" />
          <CheckRow width="w-40" />
        </Panel>
      ) : null}

      {index === 1 && tone === "right" ? (
        <Panel>
          <div className="border-b border-black/10 py-2">
            <p className="font-satoshi text-[13px] font-medium text-black/50">Team Lead</p>
            <div className="mt-1 flex items-center gap-2">
              <img src="/assets/images/studio/viaan.png" alt="" className="size-8 rounded-full object-cover" />
              <span className="font-satoshi text-[14px] font-medium">Viaan</span>
            </div>
          </div>
          <div className="py-2">
            <p className="font-satoshi text-[13px] font-medium text-black/50">Your Design Team</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="flex">
                {["team-a", "team-b", "team-c"].map((name) => (
                  <img
                    key={name}
                    src={`/assets/images/studio/${name}.png`}
                    alt=""
                    className="-ml-2 size-8 rounded-full border-2 border-white object-cover first:ml-0"
                  />
                ))}
              </span>
              <span className="font-satoshi text-[13px] font-medium">Mohit, Lulu, Ankit</span>
            </div>
          </div>
        </Panel>
      ) : null}

      {index === 2 && tone === "right" ? (
        <div className="flex w-[min(280px,86%)] flex-col gap-3">
          <div className="self-end">
            <div className="mb-1 flex items-center justify-end gap-2">
              <span className="font-satoshi text-[11px] text-black/50">4:33 PM</span>
            </div>
            <div className="flex items-start gap-2">
              <img src="/assets/images/studio/cohen.png" alt="" className="size-7 rounded-full object-cover" />
              <div>
                <p className="font-satoshi text-[12px] font-medium">Mr. Cohen</p>
                <p className="mt-1 max-w-[180px] rounded-2xl rounded-tl-sm bg-white px-3 py-2 font-satoshi text-[12px] leading-4 text-black">
                  We trust your expertise on how to bring this to life
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-satoshi text-[11px] text-black/50">4:34 PM</span>
              <span className="font-satoshi text-[12px] font-medium">DesignAsylum</span>
              <ChatMark />
            </div>
            <p className="max-w-[210px] rounded-2xl rounded-tl-sm bg-[#3b82f6] px-3 py-2 font-satoshi text-[12px] leading-4 text-white">
              We appreciate that. We’ll take the lead and make sure the solution gets us there.
            </p>
          </div>
        </div>
      ) : null}

      {index === 0 && tone === "miss" ? (
        <Panel>
          <p className="border-b border-black/10 py-2 font-satoshi text-[15px] font-medium">Invoice issued</p>
          <div className="flex items-center justify-between border-b border-black/10 py-3 font-satoshi text-[14px]">
            <span>Branding</span>
            <span>$$</span>
          </div>
          <div className="flex items-center justify-between border-b border-black/10 py-3">
            <span className="h-3 w-24 rounded-full bg-[rgba(254,91,41,0.35)]" />
            <span className="font-satoshi text-[14px]">$$$</span>
          </div>
          <div className="flex items-center justify-between py-3 font-satoshi text-[14px]">
            <span>Budget Availabe</span>
            <span>$0</span>
          </div>
        </Panel>
      ) : null}

      {index === 1 && tone === "miss" ? (
        <div className="flex w-[min(260px,86%)] flex-col gap-3">
          <div className="self-end">
            <div className="mb-1 flex items-center justify-end gap-2">
              <span className="font-satoshi text-[11px] text-black/50">10:34 PM</span>
              <span className="font-satoshi text-[12px] font-medium">DesignAsylum</span>
              <ChatMark />
            </div>
            <p className="max-w-[210px] rounded-2xl bg-[#e24b3b] px-3 py-2 font-satoshi text-[12px] leading-4 text-white">
              Hey! Just checking in. It’s been a week, and we’re still waiting for your feedback :(
            </p>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/images/studio/mrs.png" alt="" className="size-8 rounded-full object-cover" />
            <div>
              <p className="font-satoshi text-[12px] font-medium">
                Mrs. XXX <span className="ml-2 font-normal text-black/40">4:33 PM</span>
              </p>
              <p className="mt-1 inline-block rounded-full border border-black/10 bg-white px-3 py-1 font-satoshi text-[12px]">
                Typing...
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {index === 2 && tone === "miss" ? (
        <div className="relative h-[150px] w-[180px]">
          <div className="absolute top-4 left-0 h-[120px] w-[150px] rounded-lg border border-black/10 bg-white shadow-sm" />
          <div className="absolute top-2 left-3 h-[120px] w-[150px] rounded-lg border border-black/10 bg-white shadow-sm" />
          <div className="absolute top-0 left-6 h-[120px] w-[150px] overflow-hidden rounded-lg border border-black/10 bg-[#f7f7f7] shadow-sm">
            <div className="flex h-6 items-center gap-1 bg-white px-2">
              <span className="size-2 rounded-full bg-[#ff5f57]" />
              <span className="size-2 rounded-full bg-[#febc2e]" />
              <span className="size-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {Array.from({ length: 6 }, (_, cell) => (
                <span key={cell} className="h-7 rounded bg-[#e6e6e6]" />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
