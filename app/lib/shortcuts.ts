import { nav } from "@/content/site";

/** Key that starts a multi-key sequence, e.g. `g` in `g a`. */
export const PREFIX = "g";

/** How long the prefix stays armed, in milliseconds. */
export const PREFIX_TIMEOUT_MS = 1400;

export type ShortcutAction =
  | { type: "navigate"; href: string }
  | { type: "scroll"; to: "top" | "bottom" | "half-down" | "half-up" }
  | { type: "focus-item"; direction: 1 | -1 }
  | { type: "open" }
  | { type: "back" }
  | { type: "forward" }
  | { type: "theme" }
  | { type: "help" }
  | { type: "clear" };

/**
 * Match keys physically (`event.code`) so vim motions keep their muscle memory
 * on non-QWERTY layouts. Uppercase letters are reported with a leading shift.
 */
export function normalizeKey(event: KeyboardEvent): string | null {
  if (event.isComposing) {
    return null;
  }

  const letter = /^Key([A-Z])$/.exec(event.code);
  if (letter) {
    const key = letter[1].toLowerCase();
    return event.shiftKey ? key.toUpperCase() : key;
  }

  if (event.key === "?" || (event.code === "Slash" && event.shiftKey)) {
    return "?";
  }

  if (event.code === "Escape" || event.key === "Escape") {
    return "Escape";
  }

  if (event.code === "Enter" || event.key === "Enter") {
    return "Enter";
  }

  return event.key.length > 0 ? event.key : null;
}

export const gotoActions: Record<string, ShortcutAction> = {
  ...Object.fromEntries(
    nav.map((item): [string, ShortcutAction] => [
      item.shortcut.toLowerCase(),
      { type: "navigate", href: item.href },
    ]),
  ),
  [PREFIX]: { type: "scroll", to: "top" },
};

export const singleKeyActions: Record<string, ShortcutAction> = {
  j: { type: "focus-item", direction: 1 },
  k: { type: "focus-item", direction: -1 },
  ArrowDown: { type: "focus-item", direction: 1 },
  ArrowUp: { type: "focus-item", direction: -1 },
  d: { type: "scroll", to: "half-down" },
  u: { type: "scroll", to: "half-up" },
  G: { type: "scroll", to: "bottom" },
  o: { type: "open" },
  h: { type: "back" },
  l: { type: "forward" },
  ArrowLeft: { type: "back" },
  ArrowRight: { type: "forward" },
  t: { type: "theme" },
  "?": { type: "help" },
  Escape: { type: "clear" },
};

export type KeyResolution =
  | { kind: "prefix" }
  | { kind: "action"; action: ShortcutAction }
  | { kind: "cancel" }
  | { kind: "none" };

export function resolveKey(pending: string | null, key: string): KeyResolution {
  if (pending === PREFIX) {
    const action = gotoActions[key];
    return action ? { kind: "action", action } : { kind: "cancel" };
  }

  if (key === PREFIX) {
    return { kind: "prefix" };
  }

  const action = singleKeyActions[key];
  return action ? { kind: "action", action } : { kind: "none" };
}

export type ShortcutHint = {
  keys: string[];
  description: string;
};

export type ShortcutGroup = {
  title: string;
  hints: ShortcutHint[];
};

/** Single source of truth for the help dialog. */
export const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Go to",
    hints: [
      ...nav.map((item) => ({ keys: [PREFIX, item.shortcut], description: item.label })),
      { keys: [PREFIX, PREFIX], description: "Top of page" },
    ],
  },
  {
    title: "Move",
    hints: [
      { keys: ["j / ↓"], description: "Next item / scroll down" },
      { keys: ["k / ↑"], description: "Previous item / scroll up" },
      { keys: ["d"], description: "Half page down" },
      { keys: ["u"], description: "Half page up" },
      { keys: ["G"], description: "Bottom of page" },
      { keys: ["Enter"], description: "Open focused item" },
    ],
  },
  {
    title: "General",
    hints: [
      { keys: ["Tab"], description: "Move focus forward" },
      { keys: ["Shift", "Tab"], description: "Move focus back" },
      { keys: ["h / ←"], description: "Back" },
      { keys: ["l / →"], description: "Forward" },
      { keys: ["t"], description: "Toggle theme" },
      { keys: ["?"], description: "Keyboard shortcuts" },
      { keys: ["Esc"], description: "Cancel / clear focus" },
    ],
  },
];
