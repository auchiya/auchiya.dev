"use client";

import { useEffect, useState } from "react";
import { isAnalyticsEnabled, openConsentSettings } from "@/app/lib/consent";

export function ConsentSettingsButton() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isAnalyticsEnabled());
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openConsentSettings}
      aria-label="Analytics cookie settings"
      title="Analytics cookie settings"
      className="transition hover:text-muted hover:opacity-80 hover:cursor-pointer"
    >
      Cookie settings
    </button>
  );
}
