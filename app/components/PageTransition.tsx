"use client";

import { ViewTransition } from "react";

/**
 * Animates page content during client-side navigations. `update` is the
 * trigger used because the boundary stays mounted while its children change.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="none" update="page-transition">
      {children}
    </ViewTransition>
  );
}
