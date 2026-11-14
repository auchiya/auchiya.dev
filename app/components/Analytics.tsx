"use client";

import { useEffect } from "react";
import { readConsentChoice, startAnalytics } from "@/app/lib/consent";

/**
 * Starts Google Tag Manager for visitors who already consented.
 *
 * The container is never loaded before consent: `startAnalytics` is a no-op
 * until the visitor accepts, so first-time visitors make no request to Google.
 * See `app/lib/consent.ts`.
 */
export function Analytics() {
  useEffect(() => {
    if (readConsentChoice() === "granted") {
      startAnalytics();
    }
  }, []);

  return null;
}
