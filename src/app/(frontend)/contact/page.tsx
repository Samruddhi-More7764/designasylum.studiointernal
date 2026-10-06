import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { ContactOffices } from "@/components/contact/ContactOffices";
import { getFooter } from "@/cms/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Get in Touch",
  description:
    "Tell us what you're building. We reply within a day, usually with questions, sometimes with opinions.",
};

export default async function ContactPage() {
  const footer = await getFooter();

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ContactOffices />
        <ContactInquiryForm />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
