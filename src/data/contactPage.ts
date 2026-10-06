export type ContactLink = {
  label: string;
  href: string;
};

export type ContactOffice = {
  city: string;
  image: string;
  timeZone: string;
  /** Blue wash used on the Pune photograph. */
  tint?: boolean;
  links: ContactLink[];
};

export const contactOffices: ContactOffice[] = [
  {
    city: "New Jersey, USA",
    image: "/assets/images/contact/new-jersey.jpg",
    timeZone: "America/New_York",
    links: [
      { label: "+1 (203) 727-8979", href: "tel:+12037278979" },
      { label: "accounts@designasylum.in", href: "mailto:accounts@designasylum.in" },
    ],
  },
  {
    city: "Pune, India",
    image: "/assets/images/contact/pune.png",
    timeZone: "Asia/Kolkata",
    tint: true,
    links: [
      { label: "+91 9767085896", href: "tel:+919767085896" },
      { label: "+91 9158315015", href: "tel:+919158315015" },
      { label: "accounts@designasylum.in", href: "mailto:accounts@designasylum.in" },
    ],
  },
];
