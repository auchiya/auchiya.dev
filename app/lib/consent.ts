import { site } from "@/content/site";

export const ANALYTICS_DEBUG_PARAM = "gtm_debug";
export const CONSENT_STORAGE_KEY = "analytics-consent";
export const OPEN_CONSENT_SETTINGS_EVENT = "open-consent-settings";

export const ANALYTICS_HOSTNAME = new URL(site.url).hostname;

export type ConsentChoice = "granted" | "denied";

type ConsentState = {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
};

/** Consent Mode v2 signals, one set per choice. */
export const CONSENT_STATES: Record<ConsentChoice, ConsentState> = {
  granted: {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  },
  denied: {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  },
};

/**
 * Analytics is only enabled on the production hostname (any subdomain), so
 * local development and preview deployments never reach the live GA property.
 * `?gtm_debug=1` opts a non-production host in for testing.
 */
export function isAnalyticsEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const { hostname, search } = window.location;

  if (hostname === ANALYTICS_HOSTNAME || hostname.endsWith(`.${ANALYTICS_HOSTNAME}`)) {
    return true;
  }

  try {
    return new URLSearchParams(search).has(ANALYTICS_DEBUG_PARAM);
  } catch {
    return false;
  }
}

export function readConsentChoice(): ConsentChoice | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

/** Persist the choice and tell Google tags about it immediately. */
export function saveConsentChoice(choice: ConsentChoice) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }

  window.gtag?.("consent", "update", CONSENT_STATES[choice]);
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_SETTINGS_EVENT));
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
