import type { Metadata } from "next";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/sections/15-Footer";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { ContactOffices } from "@/components/contact/ContactOffices";
import { getContactPage } from "@/cms/contactPage";
import { getFooter } from "@/cms/content";
import { buildMetadata } from "@/cms/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return buildMetadata({
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ogImage: page.ogImage,
    noIndex: page.noIndex,
    fallbackTitle: "Get in Touch | Design Asylum",
    fallbackDescription:
      "Tell us what you're building. We reply within a day, usually with questions, sometimes with opinions.",
  });
}

export default async function ContactPage() {
  const [page, footer] = await Promise.all([getContactPage(), getFooter()]);

  return (
    <>
      <NavBar />
      <main data-nav="light" className="bg-white pt-28">
        <ContactOffices
          breadcrumbCurrent={page.breadcrumbCurrent}
          titleBefore={page.titleBefore}
          titleAccent={page.titleAccent}
          titleAfter={page.titleAfter}
          offices={page.offices}
        />
        <ContactInquiryForm
          before={page.formBefore}
          accent={page.formAccent}
          after={page.formAfter}
          body={page.formBody}
        />
      </main>
      <Footer columns={footer.columns} aiLinks={footer.aiLinks} />
    </>
  );
}
