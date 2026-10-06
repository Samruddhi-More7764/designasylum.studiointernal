export type FaqDetailSection = {
  id: string;
  title: string;
  body: string;
};

export type FaqDetail = {
  slug: string;
  question: string;
  lead: string;
  sections: FaqDetailSection[];
};

export const faqDetails: Record<string, FaqDetail> = {
  "defense-tech": {
    slug: "defense-tech",
    question: "How should a defense-tech startup approach branding for procurement and investors?",
    lead: "For a defense-tech startup, branding needs to do more than create recognition. It needs to establish credibility in a sector where trust, technical capability, security, and long-term reliability can heavily influence how a business is perceived. At the same time, the brand needs to communicate enough ambition and clarity to resonate with investors and potential partners. The challenge is finding a balance between the technical complexity of the product and a clear, confident story that different audiences can understand.",
    sections: [
      {
        id: "speaking",
        title: "Understand Who You're Speaking To",
        body: "Procurement teams and investors may be evaluating the same company, but they're often looking for very different signals. Procurement is likely to focus on capability, reliability, compliance, operational readiness, and whether the business can deliver on its promises. Investors, meanwhile, may be looking at the size of the opportunity, differentiation, scalability, leadership, and the potential for long-term growth. A strong defense-tech brand should account for these different priorities without becoming fragmented. Instead, it should establish a consistent foundation of credibility while allowing the messaging to adapt to the context and audience.",
      },
      {
        id: "credibility",
        title: "Build Credibility Into The Brand",
        body: "In defense and advanced technology, credibility can't be treated as a visual afterthought. The identity, messaging, website, presentations, and other touchpoints should work together to communicate a sense of precision and confidence. This doesn't necessarily mean relying on stereotypical military imagery or making the brand look overly serious. Instead, credibility can come through clarity, restraint, strong information hierarchy, thoughtful design systems, and a clear explanation of what the company actually does. The result should feel technically capable and established while still reflecting the ambition and innovation of a growing technology company.",
      },
      {
        id: "technology",
        title: "Make Complex Technology Easier To Understand",
        body: "Defense-tech companies often work with highly technical products, systems, or capabilities that can be difficult to communicate outside of an expert audience. Branding can help simplify that complexity without oversimplifying the technology itself. Clear positioning, purposeful messaging, considered visualisation, and a well-structured digital experience can help explain the problem being solved, why the technology matters, and what makes the company different. This becomes particularly important when the brand needs to move between technical documentation, procurement conversations, investor presentations, industry events, and public-facing digital channels.",
      },
      {
        id: "growth",
        title: "Create A Brand That Can Grow With The Business",
        body: "A startup's identity needs to work for where the company is going, not just where it is today. As a defense-tech business develops new capabilities, enters new markets, builds partnerships, or moves through different stages of investment and procurement, its brand will need to accommodate that growth. A flexible identity system can provide the consistency needed to build recognition while leaving enough room for new products, technologies, and applications to sit within the same brand world. The goal is to create something that feels credible enough for serious procurement conversations today, while giving the company the visual and strategic foundation to become a larger, more established player tomorrow.",
      },
    ],
  },
};
