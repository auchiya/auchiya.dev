"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  PREFIX,
  PREFIX_TIMEOUT_MS,
  normalizeKey,
  resolveKey,
  shortcutGroups,
  type ShortcutAction,
} from "@/app/lib/shortcuts";
import { navigateHistory } from "@/app/lib/history-navigation";
import { toggleTheme } from "@/app/lib/theme";

type KeyboardShortcutsContextValue = {
  openHelp: () => void;
};

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);

  if (!context) {
    throw new Error("useKeyboardShortcuts must be used inside <KeyboardShortcutsProvider>.");
  }

  return context;
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    target.closest("input, textarea, select, [contenteditable='true']") !== null
  );
}

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0;
}

/** Move focus through the current page's list rows, if it has any. */
function focusListItem(direction: 1 | -1) {
  const items: HTMLElement[] = [];

  document.querySelectorAll<HTMLElement>("[data-keynav-list]").forEach((list) => {
    list.querySelectorAll<HTMLElement>("[data-keynav-item]").forEach((item) => {
      if (isVisible(item)) {
        items.push(item);
      }
    });
  });

  if (items.length === 0) {
    return false;
  }

  const active = document.activeElement;
  const index = active instanceof HTMLElement ? items.indexOf(active) : -1;
  const next =
    index === -1
      ? direction === 1
        ? 0
        : items.length - 1
      : Math.min(items.length - 1, Math.max(0, index + direction));

  items[next]?.focus();
  return true;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollBehavior(): ScrollBehavior {
  return prefersReducedMotion() ? "auto" : "smooth";
}

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const openHelp = useCallback(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const runAction = useCallback(
    (action: ShortcutAction) => {
      switch (action.type) {
        case "navigate":
          router.push(action.href);
          break;
        case "scroll":
          switch (action.to) {
            case "top":
              window.scrollTo({ top: 0, behavior: scrollBehavior() });
              break;
            case "bottom":
              window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: scrollBehavior(),
              });
              break;
            case "half-down":
              window.scrollBy({ top: window.innerHeight / 2, behavior: scrollBehavior() });
              break;
            case "half-up":
              window.scrollBy({ top: -window.innerHeight / 2, behavior: scrollBehavior() });
              break;
          }
          break;
        case "focus-item":
          if (!focusListItem(action.direction)) {
            window.scrollBy({ top: action.direction * 64, behavior: scrollBehavior() });
          }
          break;
        case "open": {
          const active = document.activeElement;
          if (active instanceof HTMLElement && active.matches("a[href], button:not([disabled])")) {
            active.click();
          }
          break;
        }
        case "back":
          navigateHistory("back");
          break;
        case "forward":
          navigateHistory("forward");
          break;
        case "theme":
          toggleTheme();
          break;
        case "help":
          openHelp();
          break;
        case "clear":
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          break;
      }
    },
    [openHelp, router],
  );

  useEffect(() => {
    let pending: string | null = null;
    let timer: number | undefined;

    const reset = () => {
      pending = null;
      window.clearTimeout(timer);
      setPendingKey(null);
    };

    const arm = () => {
      pending = PREFIX;
      setPendingKey(PREFIX);
      window.clearTimeout(timer);
      timer = window.setTimeout(reset, PREFIX_TIMEOUT_MS);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing) {
        return;
      }

      if (dialogRef.current?.open) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      const key = normalizeKey(event);

      if (!key) {
        return;
      }

      const resolution = resolveKey(pending, key);

      if (resolution.kind === "prefix") {
        event.preventDefault();
        arm();
        return;
      }

      if (pending !== null) {
        reset();

        if (resolution.kind === "action") {
          event.preventDefault();
          runAction(resolution.action);
        } else if (resolution.kind === "cancel") {
          event.preventDefault();
        }

        return;
      }

      if (resolution.kind === "action") {
        event.preventDefault();
        runAction(resolution.action);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timer);
    };
  }, [runAction]);

  const contextValue = useMemo(() => ({ openHelp }), [openHelp]);

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="shortcut-help-title"
        onClose={() => setPendingKey(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="m-auto max-h-[min(85vh,40rem)] w-[min(92vw,44rem)] overflow-y-auto rounded-lg border border-line bg-surface p-6 text-left shadow-xl backdrop:bg-overlay"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="shortcut-help-title" className="display text-[16px]">
              Keyboard shortcuts
            </h2>
            <p className="mt-1 text-sm text-muted">Shortcuts are paused while typing in a field.</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close keyboard shortcuts"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-subtle transition hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {shortcutGroups.map((group) => (
            <section key={group.title} aria-labelledby={`shortcut-group-${group.title}`}>
              <h3
                id={`shortcut-group-${group.title}`}
                className="text-xs font-semibold tracking-wide text-subtle uppercase"
              >
                {group.title}
              </h3>
              <dl className="mt-2 space-y-2">
                {group.hints.map((hint) => (
                  <div
                    key={`${group.title}-${hint.description}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt className="text-sm text-muted">{hint.description}</dt>
                    <dd className="flex shrink-0 items-center gap-1">
                      {hint.keys.map((key, index) => (
                        <kbd key={`${key}-${index}`} className="kbd">
                          {key}
                        </kbd>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </dialog>

      <p aria-live="polite" className="sr-only">
        {pendingKey ? `Waiting for a second key after ${pendingKey}.` : ""}
      </p>

      {pendingKey ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-xs text-muted shadow-sm backdrop-blur md:bottom-8"
        >
          <kbd className="kbd">{pendingKey}</kbd>
          <span className="ml-2">waiting for a key…</span>
        </div>
      ) : null}
    </KeyboardShortcutsContext.Provider>
  );
}
