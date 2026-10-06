import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import { contactOffices, type ContactOffice } from "@/data/contactPage";

export type ContactContent = {
  breadcrumbCurrent: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  offices: ContactOffice[];
  formBefore: string;
  formAccent: string;
  formAfter: string;
  formBody: string;
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: ContactContent = {
  breadcrumbCurrent: "Contact us",
  titleBefore: "Get in ",
  titleAccent: "Touch",
  titleAfter: "!",
  offices: contactOffices,
  formBefore: "Let's talk about ",
  formAccent: "your ",
  formAfter: "brand",
  formBody:
    "Tell us what you're building. We reply within a day, usually with questions, sometimes with opinions.",
};

export const getContactPage = cache(async (): Promise<ContactContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "contact-page" as "site-footer",
      depth: 1,
    })) as unknown as {
      breadcrumbCurrent?: string | null;
      titleBefore?: string | null;
      titleAccent?: string | null;
      titleAfter?: string | null;
      offices?: Array<{
        city?: string | null;
        image?: unknown;
        imageSrc?: string | null;
        timeZone?: string | null;
        tint?: boolean | null;
        links?: Array<{ label?: string | null; href?: string | null } | null> | null;
      } | null> | null;
      formBefore?: string | null;
      formAccent?: string | null;
      formAfter?: string | null;
      formBody?: string | null;
    };

    const offices = (doc.offices || [])
      .map((office, index) => {
        const city = office?.city?.trim() || "";
        if (!city) return null;
        const designed = fallback.offices[index];
        const links = (office?.links || [])
          .map((link) => ({
            label: link?.label?.trim() || "",
            href: link?.href?.trim() || "",
          }))
          .filter((link) => link.label && link.href);
        const row: ContactOffice = {
          city,
          image: storedImage(office?.image, office?.imageSrc?.trim() || designed?.image || ""),
          timeZone: office?.timeZone?.trim() || designed?.timeZone || "Asia/Kolkata",
          links: links.length ? links : designed?.links || [],
        };
        if (office?.tint) row.tint = true;
        return row;
      })
      .filter((office): office is ContactOffice => Boolean(office));

    return {
      breadcrumbCurrent: text(doc.breadcrumbCurrent, fallback.breadcrumbCurrent),
      titleBefore: text(doc.titleBefore, fallback.titleBefore),
      titleAccent: text(doc.titleAccent, fallback.titleAccent),
      titleAfter: text(doc.titleAfter, fallback.titleAfter),
      offices: offices.length ? offices : fallback.offices,
      formBefore: text(doc.formBefore, fallback.formBefore),
      formAccent: text(doc.formAccent, fallback.formAccent),
      formAfter: text(doc.formAfter, fallback.formAfter),
      formBody: text(doc.formBody, fallback.formBody),
    };
  } catch (error) {
    console.warn("[cms] contact page fallback", error);
    return fallback;
  }
});
