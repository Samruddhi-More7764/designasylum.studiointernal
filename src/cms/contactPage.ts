import { getPayloadClient } from "@/cms/getPayload";
import { contactOffices, type ContactOffice } from "@/data/contactPage";

export type ContactContent = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: unknown;
  noIndex?: boolean | null;
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

const page: ContactContent = {
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

export async function getContactPage(): Promise<ContactContent> {
  const payload = await getPayloadClient();
  if (!payload) return page;
  try {
    const doc = (await payload.findGlobal({ slug: "contact-page", depth: 0 })) as unknown as {
      metaTitle?: string | null;
      metaDescription?: string | null;
      ogImage?: unknown;
      noIndex?: boolean | null;
    };
    if (doc) {
      return {
        ...page,
        metaTitle: doc.metaTitle ? String(doc.metaTitle) : null,
        metaDescription: doc.metaDescription ? String(doc.metaDescription) : null,
        ogImage: doc.ogImage ?? null,
        noIndex: Boolean(doc.noIndex),
      };
    }
  } catch {}
  return page;
}
