import {
  ANALYTICS_DEBUG_PARAM,
  ANALYTICS_HOSTNAME,
  CONSENT_STATES,
  CONSENT_STORAGE_KEY,
} from "@/app/lib/consent";
import { site } from "@/content/site";

const hostname = JSON.stringify(ANALYTICS_HOSTNAME);
const debugParam = JSON.stringify(ANALYTICS_DEBUG_PARAM);
const storageKey = JSON.stringify(CONSENT_STORAGE_KEY);
const denied = JSON.stringify(CONSENT_STATES.denied);
const granted = JSON.stringify(CONSENT_STATES.granted);
const containerId = JSON.stringify(site.googleTagManagerId);

/**
 * Google Tag Manager container with Consent Mode v2 defaults.
 *
 * Consent is denied globally until the visitor chooses, so Google tags start
 * in advanced consent mode (cookieless pings only). Returning visitors' stored
 * choice is applied to the default so their first page view already reflects
 * it.
 *
 * Client-side page views are currently handled by the container's history
 * tracking. Do not add a manual `page_view` until that is disabled in GTM, or
 * every navigation will be counted twice.
 *
 * Custom events are declarative: components tag links with `data-gtm-*`
 * attributes (see `app/lib/analytics.ts`) and the container reads them. Do not
 * push events to `dataLayer` from application code.
 */
const gtmScript = `
(function () {
  var siteHost = ${hostname};
  var hostname = window.location.hostname;
  var isSite = hostname === siteHost || hostname.slice(-(siteHost.length + 1)) === "." + siteHost;
  var isDebug = false;
  try {
    isDebug = new URLSearchParams(window.location.search).has(${debugParam});
  } catch (error) {}
  if (!isSite && !isDebug) return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  var stored = null;
  try {
    stored = window.localStorage.getItem(${storageKey});
  } catch (error) {}

  gtag("consent", "default", stored === "granted" ? ${granted} : ${denied});
  gtag("js", new Date());

  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", ${containerId});
})();
`;

export function GoogleTagManager() {
  return <script dangerouslySetInnerHTML={{ __html: gtmScript }} />;
}
