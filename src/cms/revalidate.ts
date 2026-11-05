import { revalidatePath } from "next/cache";

/**
 * Targeted on-demand cache revalidation.
 * Only revalidates the exact pages that depend on the updated collection or document.
 * This prevents massive 19-route SSR regeneration storms during CMS saves that
 * previously triggered Vercel serverless function timeouts and transaction rollbacks.
 */
export function revalidateForCollection(collectionSlug: string, docSlug?: string) {
  try {
    const cleanSlug = docSlug?.replace(/^\/+|\/+$/g, "").trim();

    switch (collectionSlug) {
      case "case-studies":
      case "clients":
        revalidatePath("/");
        revalidatePath("/work");
        revalidatePath("/clients");
        if (cleanSlug) {
          revalidatePath(`/clients/${cleanSlug}`);
          revalidatePath(`/work/${cleanSlug}`);
        }
        break;

      case "blog-posts":
        revalidatePath("/blog");
        revalidatePath("/blogs");
        if (cleanSlug) {
          revalidatePath(`/blog/${cleanSlug}`);
          revalidatePath(`/blogs/${cleanSlug}`);
        }
        break;

      case "team-members":
        revalidatePath("/team");
        revalidatePath("/studio");
        if (cleanSlug) {
          revalidatePath(`/team/${cleanSlug}`);
        }
        break;

      case "faq-items":
      case "faq-details":
        revalidatePath("/faq");
        if (cleanSlug) {
          revalidatePath(`/faq/${cleanSlug}`);
        }
        break;

      case "services":
      case "service-pages":
        revalidatePath("/", "layout");
        revalidatePath("/services");
        if (cleanSlug) {
          revalidatePath(`/services/${cleanSlug}`);
        }
        break;

      case "industry-pages":
        revalidatePath("/", "layout");
        revalidatePath("/industries");
        if (cleanSlug) {
          revalidatePath(`/industries/${cleanSlug}`);
        }
        break;

      case "solution-pages":
        revalidatePath("/", "layout");
        revalidatePath("/solutions");
        if (cleanSlug) {
          revalidatePath(`/solutions/${cleanSlug}`);
        }
        break;

      case "work-service-pages":
        revalidatePath("/", "layout");
        revalidatePath("/work");
        if (cleanSlug) {
          revalidatePath(`/work/${cleanSlug}`);
        }
        break;

      case "location-pages":
        if (cleanSlug) {
          revalidatePath(`/locations/${cleanSlug}`);
        }
        break;

      case "testimonials":
      case "client-logos":
      case "featured-projects":
      case "portfolio-items":
      case "pain-points":
      case "homepage-case-studies":
        revalidatePath("/");
        break;

      case "media":
        // Media files are served via Blob CDN with random suffixes; no page re-renders needed
        break;

      default:
        revalidatePath("/");
        break;
    }
  } catch (error) {
    console.warn("[revalidate] Skipping on-demand collection revalidation:", error);
  }
}

export function revalidateForGlobal(globalSlug: string) {
  try {
    switch (globalSlug) {
      case "work-page":
        revalidatePath("/work");
        break;
      case "clients-page":
      case "clients-grid-global":
        revalidatePath("/clients");
        break;
      case "team-page":
        revalidatePath("/team");
        break;
      case "studio-page":
        revalidatePath("/studio");
        break;
      case "faq-page":
        revalidatePath("/faq");
        break;
      case "contact-page":
        revalidatePath("/contact");
        break;
      case "blog-index":
      case "blog-article":
        revalidatePath("/blog");
        revalidatePath("/blogs");
        break;
      case "site-footer":
        revalidatePath("/", "layout");
        break;
      default:
        revalidatePath("/");
        break;
    }
  } catch (error) {
    console.warn("[revalidate] Skipping on-demand global revalidation:", error);
  }
}

/**
 * Backward compatibility alias.
 */
export function revalidateMarketingPages(slug?: string) {
  revalidateForCollection("case-studies", slug);
}
