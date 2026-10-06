import { cache } from "react";
import { getPayloadClient } from "@/cms/getPayload";
import { storedImage } from "@/cms/storedImage";
import {
  careersForm,
  lifeOutside,
  openRoles,
  teamWords,
  whyBenefits,
  whyHero,
} from "@/data/whyDesignAsylumPage";

const studioMark = "/assets/images/why-design-asylum/studio-mark.png";

export type CareersContent = {
  breadcrumbCurrent: string;
  titleBefore: string;
  titleAccent: string;
  titleAfter: string;
  intro: string;
  heroImage: string | null;
  benefitsBefore: string;
  benefitsAccent: string;
  benefitsAfter: string;
  studioImage: string;
  benefits: { title: string; body: string }[];
  lifeBefore: string;
  lifeAccent: string;
  lifeAfter: string;
  lifeDek: string;
  lifeSlides: string[];
  teamBefore: string;
  teamAccent: string;
  teamAfter: string;
  quotes: { name: string; role: string; quote: string; body: string; image: string | null }[];
  rolesBefore: string;
  rolesAccent: string;
  rolesAfter: string;
  rolesBody: string;
  rolesButton: string;
  formBefore: string;
  formAccent: string;
  formAfter: string;
  formDek: string;
  interests: string[];
};

function text(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed || fallback;
}

const fallback: CareersContent = {
  breadcrumbCurrent: "Careers",
  titleBefore: whyHero.titleBefore,
  titleAccent: whyHero.titleAccent,
  titleAfter: whyHero.titleAfter,
  intro: whyHero.dek,
  heroImage: null,
  benefitsBefore: whyBenefits.titleBefore,
  benefitsAccent: whyBenefits.titleAccent,
  benefitsAfter: whyBenefits.titleAfter,
  studioImage: studioMark,
  benefits: whyBenefits.items,
  lifeBefore: lifeOutside.titleBefore,
  lifeAccent: lifeOutside.titleAccent,
  lifeAfter: lifeOutside.titleAfter,
  lifeDek: lifeOutside.dek,
  lifeSlides: [],
  teamBefore: teamWords.titleBefore,
  teamAccent: teamWords.titleAccent,
  teamAfter: teamWords.titleAfter,
  quotes: teamWords.quotes.map((person) => ({ ...person, image: null })),
  rolesBefore: openRoles.titleBefore,
  rolesAccent: openRoles.titleAccent,
  rolesAfter: openRoles.titleAfter,
  rolesBody: openRoles.body,
  rolesButton: openRoles.button,
  formBefore: careersForm.titleBefore,
  formAccent: careersForm.titleAccent,
  formAfter: careersForm.titleAfter,
  formDek: careersForm.dek,
  interests: [...careersForm.interests],
};

export const getCareersPage = cache(async (): Promise<CareersContent> => {
  const payload = await getPayloadClient();
  if (!payload) return fallback;

  try {
    const doc = (await payload.findGlobal({
      slug: "careers-page" as "site-footer",
      depth: 1,
    })) as unknown as Record<string, unknown>;

    const benefits = asRows(doc.benefits)
      .map((row) => ({
        title: str(row.title),
        body: str(row.body),
      }))
      .filter((row) => row.title && row.body);
    const slides = asRows(doc.lifeSlides)
      .map((row) => storedImage(row.image, ""))
      .filter(Boolean);
    const quotes = asRows(doc.quotes)
      .map((row) => ({
        name: str(row.name),
        role: str(row.role),
        quote: str(row.quote),
        body: str(row.body),
        image: storedImage(row.image, "") || null,
      }))
      .filter((row) => row.name && row.quote);
    const interests = asRows(doc.interests)
      .map((row) => str(row.label))
      .filter(Boolean);

    return {
      breadcrumbCurrent: text(str(doc.breadcrumbCurrent), fallback.breadcrumbCurrent),
      titleBefore: text(str(doc.titleBefore), fallback.titleBefore),
      titleAccent: text(str(doc.titleAccent), fallback.titleAccent),
      titleAfter: text(str(doc.titleAfter), fallback.titleAfter),
      intro: text(str(doc.intro), fallback.intro),
      heroImage: storedImage(doc.heroImage, "") || null,
      benefitsBefore: text(str(doc.benefitsBefore), fallback.benefitsBefore),
      benefitsAccent: text(str(doc.benefitsAccent), fallback.benefitsAccent),
      benefitsAfter: text(str(doc.benefitsAfter), fallback.benefitsAfter),
      studioImage: storedImage(doc.studioImage, fallback.studioImage),
      benefits: benefits.length ? benefits : fallback.benefits,
      lifeBefore: text(str(doc.lifeBefore), fallback.lifeBefore),
      lifeAccent: text(str(doc.lifeAccent), fallback.lifeAccent),
      lifeAfter: text(str(doc.lifeAfter), fallback.lifeAfter),
      lifeDek: text(str(doc.lifeDek), fallback.lifeDek),
      lifeSlides: slides,
      teamBefore: text(str(doc.teamBefore), fallback.teamBefore),
      teamAccent: text(str(doc.teamAccent), fallback.teamAccent),
      teamAfter: text(str(doc.teamAfter), fallback.teamAfter),
      quotes: quotes.length ? quotes : fallback.quotes,
      rolesBefore: text(str(doc.rolesBefore), fallback.rolesBefore),
      rolesAccent: text(str(doc.rolesAccent), fallback.rolesAccent),
      rolesAfter: text(str(doc.rolesAfter), fallback.rolesAfter),
      rolesBody: text(str(doc.rolesBody), fallback.rolesBody),
      rolesButton: text(str(doc.rolesButton), fallback.rolesButton),
      formBefore: text(str(doc.formBefore), fallback.formBefore),
      formAccent: text(str(doc.formAccent), fallback.formAccent),
      formAfter: text(str(doc.formAfter), fallback.formAfter),
      formDek: text(str(doc.formDek), fallback.formDek),
      interests: interests.length ? interests : fallback.interests,
    };
  } catch (error) {
    console.warn("[cms] careers page fallback", error);
    return fallback;
  }
});

function str(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asRows(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object");
}
