// Video testimonials — Frame 2095588036.png. The person name/role overlay
// and play/pause icons are baked into the cropped thumbnails (no separate
// assets exist in the Figma file). The center card is taller and has no
// quote box beneath it in the design.
export interface Testimonial {
  image: string;
  alt: string;
  quote?: string;
}

export const testimonials: Testimonial[] = [
  {
    image: "/assets/images/testimonial-1.png",
    alt: "Dr. Mallesh B., Co-founder, i3systems — video testimonial",
    quote:
      "\u201cIt was a genuinely successful branding project, and, more to the point, fun to work with the team.\u201d",
  },
  {
    image: "/assets/images/testimonial-2.png",
    alt: "Dr. Mallesh B., Co-founder, i3systems — video testimonial",
  },
  {
    image: "/assets/images/testimonial-3.png",
    alt: "Dr. Mallesh B., Co-founder, i3systems — video testimonial",
    quote:
      "\u201cIt was a genuinely successful branding project, and, more to the point, fun to work with the team.\u201d",
  },
];
