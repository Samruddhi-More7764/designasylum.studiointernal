import { revalidatePath } from "next/cache";

/**
 * Trigger on-demand cache revalidation for marketing routes when content
 * changes in Payload CMS.
 */
export function revalidateMarketingPages(slug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/studio");
    revalidatePath("/team");
    revalidatePath("/clients");
    revalidatePath("/work");
    revalidatePath("/contact");
    revalidatePath("/why-design-asylum");

    if (slug) {
      const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim();
      revalidatePath(`/team/${cleanSlug}`);
      revalidatePath(`/clients/${cleanSlug}`);
      revalidatePath(`/blog/${cleanSlug}`);
      revalidatePath(`/industries/${cleanSlug}`);
      revalidatePath(`/services/${cleanSlug}`);
      revalidatePath(`/solutions/${cleanSlug}`);
      revalidatePath(`/work/${cleanSlug}`);
    }
  } catch (error) {
    // If called outside of request context (e.g. during CLI scripts), safely ignore
    console.warn("[revalidate] Skipping on-demand revalidation outside request context:", error);
  }
}
