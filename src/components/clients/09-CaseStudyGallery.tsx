import { CaseStudyMediaFrame } from "@/components/clients/CaseStudyMedia";
import { getCaseStudyPage } from "@/cms/content";

/**
 * Case study gallery. Each row is either one 1316×740 frame or two
 * 648×702 columns with 16px between them.
 */
export async function CaseStudyGallery({
  clientSlug = "sevenloop",
  studySlug = "case-study",
}: {
  clientSlug?: string;
  studySlug?: string;
}) {
  const page = await getCaseStudyPage(clientSlug, studySlug);
  if (!page) return null;
  const { gallery } = page;
  return (
    <section className="bg-white">
      {gallery.map((frame, i) => (
        <div
          key={`${frame.layout}-${frame.image.src}-${i}`}
          className={`mx-auto w-full max-w-[1470px] px-5 sm:px-8 lg:px-[60px] ${
            i === gallery.length - 1
              ? "pb-10 sm:pb-12 lg:pb-16"
              : "pb-6 sm:pb-8 lg:pb-10"
          }`}
        >
          <CaseStudyMediaFrame frame={frame} />
        </div>
      ))}
    </section>
  );
}
