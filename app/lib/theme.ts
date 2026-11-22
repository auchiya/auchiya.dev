const SCHEME_EVENT = "schemechange";
const STORAGE_KEY = "color-scheme";
const LEGACY_STORAGE_KEY = "theme";

type Scheme = "light" | "dark";
export type ThemePreference = Scheme | "system";

function metaElement() {
  return document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
}

function systemScheme(): Scheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** `system` means "no stored override"; legacy `theme` values are still read. */
function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function resolve(preference: ThemePreference): Scheme {
  return preference === "system" ? systemScheme() : preference;
}

/** The <meta> is the single source of truth; CSS maps it to color-scheme + tokens. */
function publish(preference: ThemePreference) {
  const meta = metaElement();
  if (meta) {
    meta.content = preference === "system" ? "light dark" : preference;
  }
  window.dispatchEvent(
    new CustomEvent<boolean>(SCHEME_EVENT, { detail: resolve(preference) === "dark" }),
  );
}

export function isDark() {
  return resolve(readPreference()) === "dark";
}

export function setTheme(preference: ThemePreference) {
  try {
    if (preference === "system") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, preference);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode, disabled storage).
  }

  publish(preference);
}

/**
 * Two-state toggle over a tri-state model: target the opposite of what is
 * rendered, and return to `system` when that target matches the OS preference.
 * Divergence is only checked here at storage time, never retroactively.
 */
export function toggleTheme() {
  const system = systemScheme();
  const target: Scheme = resolve(readPreference()) === "dark" ? "light" : "dark";

  setTheme(target === system ? "system" : target);
}

export function onThemeChange(handler: (dark: boolean) => void) {
  const onSchemeChange = (event: Event) => handler((event as CustomEvent<boolean>).detail);

  // Another tab can change the override; keep this tab in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === LEGACY_STORAGE_KEY) {
      publish(readPreference());
    }
  };

  // With no override, the OS preference is the source of truth. React to it
  // without pinning a value: CSS already follows `color-scheme: light dark`.
  const query = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (event: MediaQueryListEvent) => {
    if (readPreference() === "system") {
      handler(event.matches);
    }
  };

  window.addEventListener(SCHEME_EVENT, onSchemeChange);
  window.addEventListener("storage", onStorage);
  query.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener(SCHEME_EVENT, onSchemeChange);
    window.removeEventListener("storage", onStorage);
    query.removeEventListener("change", onSystemChange);
  };
}
