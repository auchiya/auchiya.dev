"use client";

import { useEffect, useState } from "react";
import {
  OPEN_CONSENT_SETTINGS_EVENT,
  isAnalyticsEnabled,
  readConsentChoice,
  saveConsentChoice,
  type ConsentChoice,
} from "@/app/lib/consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return;
    }

    if (readConsentChoice() === null) {
      setVisible(true);
    }

    const open = () => setVisible(true);
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);

    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
  }, []);

  if (!visible) {
    return null;
  }

  function choose(choice: ConsentChoice) {
    saveConsentChoice(choice);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:left-1/2 md:right-auto md:w-[34rem] md:-translate-x-1/2">
      <section
        aria-label="Analytics consent"
        className="flex flex-col gap-3 border border-line bg-surface p-4 text-sm shadow-lg md:flex-row md:items-center md:justify-between"
      >
        <p className="text-muted">
          I use Google Analytics to understand how this site is used. Analytics cookies stay off
          until you accept.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("denied")}
            className="border border-line px-3 py-1.5 text-muted transition hover:text-ink"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            className="bg-ink px-3 py-1.5 text-on-accent transition hover:opacity-80"
          >
            Accept
          </button>
        </div>
      </section>
    </div>
  );
}
