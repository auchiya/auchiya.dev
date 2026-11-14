import { site } from "@/content/site";

export const ANALYTICS_DEBUG_PARAM = "gtm_debug";
export const CONSENT_STORAGE_KEY = "analytics-consent";
export const OPEN_CONSENT_SETTINGS_EVENT = "open-consent-settings";

/**
 * Bump when the banner text, the tracked data, or the recipients change so
 * returning visitors are asked again.
 */
export const CONSENT_VERSION = 1;

/** Consent is re-requested yearly, in line with EU supervisory guidance. */
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

export const ANALYTICS_HOSTNAME = new URL(site.url).hostname;

export type ConsentChoice = "granted" | "denied";

type ConsentState = {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
};

/**
 * Consent Mode v2 signals. Advertising signals stay denied even after opting
 * in: this site runs analytics only, so there is no purpose that would justify
 * granting them.
 */
export const CONSENT_STATES: Record<ConsentChoice, ConsentState> = {
  granted: {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  },
  denied: {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  },
};

export type ConsentRecord = {
  choice: ConsentChoice;
  /** Epoch milliseconds, used to demonstrate when consent was given. */
  ts: number;
  version: number;
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

/**
 * Reads the stored decision, ignoring expired records and records made under a
 * previous banner version. Anything unusable is treated as "not asked yet".
 */
export function readConsentRecord(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const record = JSON.parse(raw) as Partial<ConsentRecord>;

    if (record.choice !== "granted" && record.choice !== "denied") {
      return null;
    }
    if (record.version !== CONSENT_VERSION) {
      return null;
    }
    if (typeof record.ts !== "number" || Date.now() - record.ts > CONSENT_MAX_AGE_MS) {
      return null;
    }

    return record as ConsentRecord;
  } catch {
    return null;
  }
}

export function readConsentChoice(): ConsentChoice | null {
  return readConsentRecord()?.choice ?? null;
}

let started = false;

/**
 * Loads the Google Tag Manager container. Nothing Google-related is fetched
 * before this runs, so a visitor who never accepts makes no request to Google
 * at all — no pre-consent pings, no cookieless tracking.
 */
export function startAnalytics() {
  if (started || typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }

  started = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };

  window.gtag("consent", "default", CONSENT_STATES.granted);
  window.dataLayer.push({ event: "gtm.js", "gtm.start": Date.now() });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
    site.googleTagManagerId,
  )}`;
  document.head.appendChild(script);
}

/** Withdrawal is immediate and also removes the identifiers Google set. */
function clearAnalyticsCookies() {
  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (!name || (name !== "_ga" && !name.startsWith("_ga_"))) {
      continue;
    }

    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${ANALYTICS_HOSTNAME}`;
  }
}

/** Persist the choice, then apply it to Google tags. */
export function saveConsentChoice(choice: ConsentChoice) {
  const record: ConsentRecord = { choice, ts: Date.now(), version: CONSENT_VERSION };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }

  if (!started) {
    if (choice === "granted") {
      startAnalytics();
    }
    return;
  }

  window.gtag?.("consent", "update", CONSENT_STATES[choice]);

  if (choice === "denied") {
    clearAnalyticsCookies();
  }
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
