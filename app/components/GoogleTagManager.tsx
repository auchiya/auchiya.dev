import Script from "next/script";
import { site } from "@/content/site";

const gtmInitScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
`;

/**
 * Loads the Google Tag Manager container.
 *
 * The dataLayer is initialized inline before the container script loads so
 * tags queued by the page are not lost while gtm.js is being fetched.
 */
export function GoogleTagManager() {
  return (
    <>
      <Script id="google-tag-manager-init" strategy="beforeInteractive">
        {gtmInitScript}
      </Script>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${site.googleTagManagerId}`}
      />
    </>
  );
}
