import type { ComponentType } from "react";
import type { MiscMeta } from "./types";

export type MiscEntry = MiscMeta & {
  slug: string;
  Body: ComponentType;
};

type MiscModule = {
  meta: MiscMeta;
  default: ComponentType;
};

const modules = import.meta.glob<MiscModule>("./*.mdx", { eager: true });

// Manual order first, then newest, regardless of the order files are discovered in.
export const misc: MiscEntry[] = Object.entries(modules)
  .map(([path, module]) => {
    if (!module.meta) {
      throw new Error(`Misc entry ${path} is missing a "meta" export.`);
    }

    return {
      ...module.meta,
      slug: path.replace(/^\.\//, "").replace(/\.mdx$/, ""),
      Body: module.default,
    };
  })
  .sort(
    (a, b) =>
      (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY) ||
      b.date.localeCompare(a.date) ||
      a.title.localeCompare(b.title),
  );

export function getMiscEntry(slug: string) {
  return misc.find((entry) => entry.slug === slug);
}
