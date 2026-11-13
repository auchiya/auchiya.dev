import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { Prose } from "@/app/components/Prose";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  return {
    title: project?.title ?? "Projects",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const Body = project.Body;

  return (
    <article>
      <div className="mb-12">
        <Link href="/projects" className="text-sm text-subtle transition hover:text-muted">
          ← Projects
        </Link>
        <h1 className="display mt-5 text-[22px]">{project.title}</h1>
        <p className="mt-3 text-sm text-subtle">{project.year}</p>
      </div>

      <Prose>
        <Body />
        <h2>Stack</h2>
        <p>
          {project.stack.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? ", " : null}
              <code>{item}</code>
            </Fragment>
          ))}
        </p>
        <h2>Links</h2>
        <ul>
          {project.repo && (
            <li>
              <a href={project.repo} target="_blank" rel="noreferrer">
                {project.repoLabel ??
                  project.repo.replace(/^https:\/\/github\.com\//, "github.com/")}
              </a>
            </li>
          )}
          {project.links?.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Prose>
    </article>
  );
}
