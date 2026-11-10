import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/content/site";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project?.title ?? "Projects",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <article>
      <div className="mb-12">
        <Link
          href="/projects"
          className="text-sm text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          ← Projects
        </Link>
        <h1 className="display mt-5 text-[22px]">{project.title}</h1>
        <p className="mt-3 text-sm text-gray-400">{project.year}</p>
      </div>

      <div className="prose">
        <p>{project.summary}</p>
        <h2>Overview</h2>
        <p>
          This is a placeholder project description. Explain the problem, what you built, and why it
          matters. Replace this text with details about the real project.
        </p>
        <h2>What I built</h2>
        <ul>
          <li>First placeholder feature or contribution.</li>
          <li>Second placeholder feature or contribution.</li>
          <li>Third placeholder feature or contribution.</li>
        </ul>
        <h2>Stack</h2>
        <p>
          Mention the languages, frameworks, and tools used here. For example:{" "}
          <code>TypeScript</code>, <code>React</code>, and <code>Cloudflare Workers</code>.
        </p>
        <p>Link to the repository or live site when it is available.</p>
      </div>
    </article>
  );
}
