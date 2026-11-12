import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMiscEntry, misc } from "@/content/misc";
import { Prose } from "@/app/components/Prose";

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
        <p className="mt-3 text-sm text-subtle">{entry.note}</p>
      </div>

      <Prose>
        <Body />
      </Prose>
    </article>
  );
}
