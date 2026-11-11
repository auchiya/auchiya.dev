"use client";

import { useKeyboardShortcuts } from "./KeyboardShortcuts";

export function ShortcutHelpButton() {
  const { openHelp } = useKeyboardShortcuts();

  return (
    <button
      type="button"
      onClick={openHelp}
      aria-label="Keyboard shortcuts"
      aria-keyshortcuts="?"
      title="Keyboard shortcuts (?)"
      className="flex h-[18px] w-[18px] items-center justify-center text-gray-400 transition hover:text-gray-600 hover:opacity-80 dark:text-gray-500 dark:hover:text-gray-300"
    >
      <kbd
        aria-hidden="true"
        className="font-mono text-[11px] leading-none font-semibold text-current"
      >
        ?
      </kbd>
    </button>
  );
}
