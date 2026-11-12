"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Move focus to the main content after client-side navigations, so keyboard
 * and screen reader users start at the new page instead of the old link.
 */
export function RouteFocus() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
