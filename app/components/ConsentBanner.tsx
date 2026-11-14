"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  OPEN_CONSENT_SETTINGS_EVENT,
  isAnalyticsEnabled,
  readConsentChoice,
  saveConsentChoice,
  type ConsentChoice,
} from "@/app/lib/consent";

/** Both actions use the same styling: refusing must be as easy as accepting. */
const buttonClass = "border border-line px-3 py-1.5 text-ink transition hover:border-ink";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    if (!isAnalyticsEnabled()) {
      return;
    }

    setCurrent(readConsentChoice());

    if (readConsentChoice() === null) {
      setVisible(true);
    }

    const open = () => {
      setCurrent(readConsentChoice());
      setVisible(true);
    };
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);

    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, open);
  }, []);

  if (!visible) {
    return null;
  }

  function choose(choice: ConsentChoice) {
    saveConsentChoice(choice);
    setCurrent(choice);
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-50 md:bottom-4 md:left-1/2 md:right-auto md:w-[34rem] md:-translate-x-1/2">
      <section
        aria-label="Analytics consent"
        className="flex flex-col gap-3 border border-line bg-surface p-4 text-sm shadow-lg md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-2 text-muted">
          <p>
            I use Google Analytics (Google LLC) to understand how this site is read. It stores
            cookies and sends data to Google, possibly outside the EU. Nothing loads until you
            accept. See the{" "}
            <Link href="/privacy" className="text-ink underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
          {current ? (
            <p className="text-subtle">
              Analytics is currently {current === "granted" ? "on" : "off"}. You can change this
              later from the footer.
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 justify-end gap-2">
          <button type="button" onClick={() => choose("denied")} className={buttonClass}>
            Decline
          </button>
          <button type="button" onClick={() => choose("granted")} className={buttonClass}>
            Accept
          </button>
        </div>
      </section>
    </div>
  );
}
