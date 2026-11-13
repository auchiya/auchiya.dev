import type { Metadata } from "next";
import Link from "next/link";
import { liveProjects, portfolioProjects, type Project } from "@/content/projects";
import { LiveBadge } from "@/app/components/LiveBadge";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and things I've built.",
};

function ProjectRow({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-keynav-item
      className="text-ink transition-all hover:text-ink/70"
    >
      <div className="flex flex-col items-start pb-4 pt-3 md:flex-row md:pb-2">
        <div className="relative top-[2px] flex-auto md:w-9/12">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="display text-[17px]">{project.title}</h1>
            {project.status === "live" ? <LiveBadge className="-translate-y-[1.5px]" /> : null}
          </div>
        </div>
        <div className="relative top-px shrink-0 text-sm text-subtle md:w-3/12 md:pl-4">
          {project.year}
        </div>
      </div>
    </Link>
  );
}

function ProjectSection({ title, projects }: { title: string; projects: Project[] }) {
  return (
    <section>
      <h2 className="display mb-2 text-[12px] text-subtle">{title}</h2>
      <div className="flex flex-col divide-y divide-line">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

export default function ProjectsPage() {
  return (
    <div data-keynav-list className="-mt-[14px] flex flex-col gap-10">
      <ProjectSection title="Live in production" projects={liveProjects} />
      <ProjectSection title="Portfolio" projects={portfolioProjects} />
    </div>
  );
}
