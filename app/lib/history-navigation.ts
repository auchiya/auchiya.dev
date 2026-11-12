/** Upper bound for waiting on the route content to commit after a history change. */
const HISTORY_TRANSITION_TIMEOUT_MS = 1500;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Navigate browser history with a view transition.
 *
 * React's <ViewTransition> only activates for React transitions. Back/forward
 * updates arrive through `popstate`, so they need the native View Transition
 * API. The transition update callback resolves once `#main` has changed, so the
 * browser captures the new page rather than the old one.
 */
export function navigateHistory(direction: "back" | "forward") {
  const navigate = () => {
    if (direction === "back") {
      window.history.back();
    } else {
      window.history.forward();
    }
  };

  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    navigate();
    return;
  }

  const transition = document.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const main = document.getElementById("main");

        if (!main) {
          navigate();
          resolve();
          return;
        }

        let finished = false;
        let timeout: number | undefined;

        const finish = () => {
          if (finished) {
            return;
          }

          finished = true;
          observer.disconnect();

          if (timeout !== undefined) {
            window.clearTimeout(timeout);
          }

          // The DOM is already updated here; resolve immediately. Waiting for
          // requestAnimationFrame would deadlock: rendering is paused while the
          // transition waits for this callback, and Chrome aborts after ~4s.
          resolve();
        };

        const observer = new MutationObserver(finish);
        observer.observe(main, { childList: true, subtree: true });

        timeout = window.setTimeout(finish, HISTORY_TRANSITION_TIMEOUT_MS);

        navigate();
      }),
  );

  // A skipped or interrupted transition should not surface as unhandled
  // rejections. Each promise rejects independently: `ready` reports timeouts,
  // aborts, and skipped transitions; `updateCallbackDone` reports update
  // failures; `finished` reports the end of the animation.
  transition.ready.catch(() => {});
  transition.updateCallbackDone.catch(() => {});
  transition.finished.catch(() => {});
}
