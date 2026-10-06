export const teamPortrait = "/assets/images/team/tanmaya.jpg";

export const teamHeading = "Team";

export const teamIntro =
  "Strategists, designers, writers, developers and motion artists — in the same room, on the same problem. The people who make Design Asylum what it is.";

const designedPerson = {
  name: "Tanmaya Rao",
  role: "Lead Brand Designer | Illustrator",
  image: teamPortrait,
  href: "#",
};

export const teamPersonHref = "/team/tanmaya-rao";

export const teamLeadership = {
  heading: "Leadership",
  members: [designedPerson, designedPerson, designedPerson].map((member) => ({
    ...member,
    href: teamPersonHref,
  })),
};

export const teamGroup = {
  accent: "Our",
  after: "Team",
  members: [
    designedPerson,
    designedPerson,
    designedPerson,
    designedPerson,
    designedPerson,
    designedPerson,
  ],
};

/** Stays in code. Book an intro opens the homepage talk form. */
export const teamCta = {
  heading: "This is who you’d be working with.",
  button: "Book an intro",
  href: "/#talk",
};
