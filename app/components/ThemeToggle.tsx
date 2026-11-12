"use client";

import { useEffect, useState } from "react";
import { isDark, onThemeChange, setTheme } from "@/app/lib/theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(isDark());

    const unsubscribe = onThemeChange(setDark);

    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {
      // Ignore storage failures (private mode, disabled storage).
    }

    if (stored) {
      return unsubscribe;
    }

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches, { persist: false });
    };

    query.addEventListener("change", onChange);

    return () => {
      unsubscribe();
      query.removeEventListener("change", onChange);
    };
  }, []);

  function toggle() {
    setTheme(!isDark());
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-[18px] w-[18px] items-center justify-center text-gray-400 transition hover:text-gray-600 hover:opacity-80 dark:text-gray-500 dark:hover:text-gray-300"
    >
      {dark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[18px] w-[18px]"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
