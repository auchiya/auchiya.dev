const THEME_EVENT = "themechange";

export function isDark() {
  return document.documentElement.classList.contains("dark");
}

export function setTheme(dark: boolean, options: { persist?: boolean } = {}) {
  const { persist = true } = options;

  document.documentElement.classList.toggle("dark", dark);

  if (persist) {
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      // Ignore storage failures (private mode, disabled storage).
    }
  }

  window.dispatchEvent(new CustomEvent<boolean>(THEME_EVENT, { detail: dark }));
}

export function toggleTheme() {
  setTheme(!isDark());
}

export function onThemeChange(handler: (dark: boolean) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<boolean>).detail);
  window.addEventListener(THEME_EVENT, listener);
  return () => window.removeEventListener(THEME_EVENT, listener);
}
