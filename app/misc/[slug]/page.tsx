import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMiscEntry, misc } from "@/content/misc";
import { Prose } from "@/app/components/Prose";
import { TagList } from "@/app/components/TagList";
import { formatDate } from "@/app/lib/format-date";

type MiscPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return misc.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: MiscPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getMiscEntry(slug);

  return {
    title: entry?.title ?? "Misc",
    description: entry?.summary,
  };
}

export default async function MiscEntryPage({ params }: MiscPageProps) {
  const { slug } = await params;
  const entry = getMiscEntry(slug);

  if (!entry) {
    notFound();
  }

  const Body = entry.Body;

  return (
    <article>
      <div className="mb-12">
        <Link href="/misc" className="text-sm text-subtle transition hover:text-muted">
          ← Misc
        </Link>
        <h1 className="display mt-5 text-[22px]">{entry.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-subtle">
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          <span aria-hidden="true" className="h-3 w-px bg-line" />
          <TagList tags={entry.tags} />
        </div>
        <p className="mt-2 text-sm text-subtle">{entry.note}</p>
      </div>

      <Prose>
        <Body />
      </Prose>
    </article>
  );
}
