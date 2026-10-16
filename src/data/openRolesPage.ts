export const openRolesHeading = {
  before: "Find",
  accent: "Your",
  after: "place at DA",
};

export const jobCategories = [
  { id: "all", label: "All roles" },
  { id: "ui-ux", label: "UI/UX Design" },
  { id: "brand", label: "Brand & Graphic Design" },
  { id: "web", label: "Web Development" },
  { id: "video", label: "Video Editing" },
  { id: "content", label: "Content & Copy" },
  { id: "project", label: "Project Management" },
  { id: "marketing", label: "Marketing" },
] as const;

export type JobCategoryId = (typeof jobCategories)[number]["id"];
export type JobDepartment = Exclude<JobCategoryId, "all">;

export const jobDetailHeadings = {
  duties: "What you’ll do",
  looking: "What we’re looking for",
};

export type JobRole = {
  id: string;
  slug: string;
  category: JobDepartment;
  title: string;
  breadcrumb: string;
  summary: string;
  location: string;
  employment: string;
  experience: string;
  applyLabel: string;
  detailLocation: string;
  detailExperience: string;
  detailType: string;
  responsibilities: string[];
  requirements: string[];
  applyNowLabel: string;
  applyNowHref: string;
};

const uiuxSummary =
  "We’re looking for a UI/UX Designer who can think beyond screens and turn complex ideas into clear, thoughtful digital experiences.";

const uiuxResponsibilities = [
  "Design websites and digital products from concept to final delivery",
  "Translate strategy and ideas into intuitive user experiences",
  "Create wireframes, user flows, and high-fidelity UI",
  "Work closely with brand, strategy, and development teams",
  "Present and defend design decisions",
  "Sweat the details — from interaction to final polish",
];

const uiuxRequirements = [
  "Strong visual and UX fundamentals",
  "Excellent command of Figma",
  "A thoughtful approach to problem-solving",
  "A portfolio that shows both thinking and craft",
  "Ability to take ownership and work collaboratively",
];

function role(
  slug: string,
  category: JobDepartment,
  title: string,
  summary: string,
  experience: string,
  detail?: Partial<Pick<JobRole, "breadcrumb" | "detailLocation" | "detailExperience" | "detailType" | "responsibilities" | "requirements">>,
): JobRole {
  return {
    id: slug,
    slug,
    category,
    title,
    breadcrumb: detail?.breadcrumb || title.replace(/^Jr\.\s*/i, ""),
    summary,
    location: "100% Remote",
    employment: "Full time",
    experience,
    applyLabel: "Apply",
    detailLocation: detail?.detailLocation || "Remote",
    detailExperience: detail?.detailExperience || experience.replace(/yrs/i, "Years"),
    detailType: detail?.detailType || "Full-time",
    responsibilities: detail?.responsibilities || [
      `Own the ${title.toLowerCase()} work from the first conversation through delivery`,
      "Collaborate with strategy, design, and development as the job requires",
      "Present the work clearly and stay with it through the last round of changes",
    ],
    requirements: detail?.requirements || [
      "A portfolio or body of work that shows both thinking and craft",
      "A thoughtful approach to the problem in front of the team",
      "Ability to take ownership and work collaboratively",
    ],
    applyNowLabel: "Apply now",
    applyNowHref: "/why-design-asylum#apply",
  };
}

/** Counts match the category library in the job openings frame. */
export const jobRoles: JobRole[] = [
  ...Array.from({ length: 5 }, (_, index) =>
    role(
      index === 0 ? "jr-ui-ux-designer" : `jr-ui-ux-designer-${index + 1}`,
      "ui-ux",
      "Jr.UI/UX Designer",
      uiuxSummary,
      "0-2 yrs",
      {
        breadcrumb: "UI/UX Designer",
        detailLocation: "Remote",
        detailExperience: "2-4 Years",
        detailType: "Full-time",
        responsibilities: uiuxResponsibilities,
        requirements: uiuxRequirements,
      },
    ),
  ),
  role(
    "brand-designer",
    "brand",
    "Brand Designer",
    "We’re looking for a brand designer who can shape identities that feel clear, ownable, and ready for the work ahead.",
    "2-4 yrs",
  ),
  role(
    "graphic-designer",
    "brand",
    "Graphic Designer",
    "We’re looking for a graphic designer who cares about craft, from campaign systems to the last detail on the page.",
    "1-3 yrs",
  ),
  role(
    "junior-graphic-designer",
    "brand",
    "Junior Graphic Designer",
    "We’re looking for a junior graphic designer ready to learn the studio’s way of making and to ship work that holds up.",
    "0-2 yrs",
  ),
  role(
    "frontend-developer",
    "web",
    "Frontend Developer",
    "We’re looking for a frontend developer who can turn design into fast, careful interfaces.",
    "2-4 yrs",
  ),
  role(
    "webflow-developer",
    "web",
    "Webflow Developer",
    "We’re looking for a Webflow developer who can build marketing sites that stay faithful to the design.",
    "1-3 yrs",
  ),
  role(
    "video-editor",
    "video",
    "Video Editor",
    "We’re looking for a video editor who can cut stories that feel sharp, paced, and true to the brand.",
    "2-4 yrs",
  ),
  role(
    "motion-editor",
    "video",
    "Motion Editor",
    "We’re looking for a motion editor who can bring still ideas into sequences with timing and restraint.",
    "1-3 yrs",
  ),
  role(
    "junior-video-editor",
    "video",
    "Junior Video Editor",
    "We’re looking for a junior video editor who wants to learn the cut, the grade, and the reason behind both.",
    "0-2 yrs",
  ),
  role(
    "content-writer",
    "content",
    "Content Writer",
    "We’re looking for a content writer who can make complex work sound clear, specific, and human.",
    "1-3 yrs",
  ),
  role(
    "copywriter",
    "content",
    "Copywriter",
    "We’re looking for a copywriter who can find the line that carries a brand, a page, or a campaign.",
    "2-4 yrs",
  ),
  role(
    "project-manager",
    "project",
    "Project Manager",
    "We’re looking for a project manager who can hold the brief, the timeline, and the team in the same picture.",
    "3-5 yrs",
  ),
  role(
    "studio-producer",
    "project",
    "Studio Producer",
    "We’re looking for a studio producer who can keep ambitious work moving without losing the details.",
    "2-4 yrs",
  ),
  role(
    "junior-project-manager",
    "project",
    "Junior Project Manager",
    "We’re looking for a junior project manager ready to learn how a studio runs a job from first call to delivery.",
    "0-2 yrs",
  ),
  role(
    "marketing-manager",
    "marketing",
    "Marketing Manager",
    "We’re looking for a marketing manager who can connect the studio’s work with the people it is for.",
    "3-5 yrs",
  ),
  role(
    "performance-marketer",
    "marketing",
    "Performance Marketer",
    "We’re looking for a performance marketer who can read the numbers and still care how the work looks.",
    "2-4 yrs",
  ),
];
