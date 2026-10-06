import { Accent } from "@/components/ui/SectionHeading";
import { ahmedabadCallout } from "@/data/ahmedabadLocationPage";

export function LocationCallout() {
  return (
    <section className="bg-white px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto mt-[120px] flex w-full max-w-[1346px] flex-col gap-4 rounded-2xl border-l-4 border-[#FE5A28] bg-[#D5D5D533] px-6 py-10 sm:px-8 sm:py-12 lg:mt-[200px]">
        <h2 className="font-figtree text-[28px] font-normal leading-[1.2] tracking-[-0.5px] text-black sm:text-[32px]">
          {ahmedabadCallout.before}
          <Accent className="text-[28px] tracking-[-1px] sm:text-[32px]">
            {ahmedabadCallout.accent}
          </Accent>
          {ahmedabadCallout.after}
        </h2>
        <p className="font-satoshi text-[16px] leading-[1.45] tracking-[-0.5px] text-black sm:text-[18px] lg:text-[20px] lg:leading-[26px]">
          {ahmedabadCallout.body}
        </p>
      </div>
    </section>
  );
}
