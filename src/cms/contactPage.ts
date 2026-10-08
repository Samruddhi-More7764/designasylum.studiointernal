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

export function getContactPage(): Promise<ContactContent> {
  return Promise.resolve(page);
}
