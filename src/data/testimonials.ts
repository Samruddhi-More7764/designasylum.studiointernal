// Testimonials. Stills are the photo only. A video shows play and pause; a photo shows expand.
// Every card uses that same frame, with the quote caption underneath.
export interface Testimonial {
  image: string;
  alt: string;
  /** Optional role under the name, e.g. "Co-founder, i3systems". */
  designation?: string;
  quote?: string;
  video?: string;
  width: number;
  height: number;
}

export const testimonials: Testimonial[] = [
  {
    image: "/assets/images/testimonial-1.png",
    alt: "Dr. Mallesh B.",
    designation: "Co-founder, i3systems",
    quote:
      "\u201cIt was a genuinely successful branding project, and, more to the point, fun to work with the team.\u201d",
    width: 320,
    height: 320,
  },
  {
    image: "/assets/images/testimonial-2.png",
    alt: "Dr. Mallesh B.",
    designation: "Co-founder, i3systems",
    quote:
      "\u201cIt was a genuinely successful branding project, and, more to the point, fun to work with the team.\u201d",
    width: 320,
    height: 320,
  },
  {
    image: "/assets/images/testimonial-3.png",
    alt: "Dr. Mallesh B.",
    designation: "Co-founder, i3systems",
    quote:
      "\u201cIt was a genuinely successful branding project, and, more to the point, fun to work with the team.\u201d",
    width: 320,
    height: 320,
  },
];
