import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";
import { misc } from "@/content/misc";

function url(path: string) {
  return new URL(path, site.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: url("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: url("/projects"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: url("/misc"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...projects.map((project) => ({
      url: url(`/projects/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...misc.map((entry) => ({
      url: url(`/misc/${entry.slug}`),
      lastModified: new Date(entry.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
