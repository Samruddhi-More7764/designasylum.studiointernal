import { GoogleTagManager as NextGoogleTagManager } from "@next/third-parties/google";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();

/**
 * GTM bootstrap (dataLayer + gtm.js). Next.js injects this after hydration.
 * Renders nothing when NEXT_PUBLIC_GTM_ID is unset.
 */
export function GoogleTagManager() {
  if (!gtmId) return null;
  return <NextGoogleTagManager gtmId={gtmId} />;
}

/**
 * GTM noscript iframe — first child of <body>, for visitors with JS off.
 */
export function GoogleTagManagerNoscript() {
  if (!gtmId) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
