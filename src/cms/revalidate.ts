import { revalidatePath } from "next/cache";

/**
 * Trigger on-demand cache revalidation for marketing routes when content
 * changes in Payload CMS.
 */
export function revalidateMarketingPages(slug?: string) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/studio");
    revalidatePath("/team", "layout");
    revalidatePath("/clients", "layout");
    revalidatePath("/work", "layout");
    revalidatePath("/contact");
    revalidatePath("/why-design-asylum");

    if (slug) {
      const cleanSlug = slug.replace(/^\/+|\/+$/g, "").trim();
      revalidatePath(`/team/${cleanSlug}`);
      revalidatePath(`/clients/${cleanSlug}`);
      revalidatePath(`/blog/${cleanSlug}`);
    }
  } catch (error) {
    // If called outside of request context (e.g. during CLI scripts), safely ignore
    console.warn("[revalidate] Skipping on-demand revalidation outside request context:", error);
  }
}
