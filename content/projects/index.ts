import type { ComponentType } from "react";
import type { ProjectMeta } from "./types";

export type Project = ProjectMeta & {
  slug: string;
  Body: ComponentType;
};

type ProjectModule = {
  meta: ProjectMeta;
  default: ComponentType;
};

const modules = import.meta.glob<ProjectModule>("./*.mdx", { eager: true });

// Newest first, regardless of the order files are discovered in.
export const projects: Project[] = Object.entries(modules)
  .map(([path, module]) => {
    if (!module.meta) {
      throw new Error(`Project ${path} is missing a "meta" export.`);
    }

    return {
      ...module.meta,
      slug: path.replace(/^\.\//, "").replace(/\.mdx$/, ""),
      Body: module.default,
    };
  })
  .sort((a, b) => Number(b.year) - Number(a.year));

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
