import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, posts } from "@/content/site";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  return {
    title: post?.title ?? "Writing",
    description: post?.summary,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <div className="mb-12">
        <Link
          href="/writing"
          className="text-sm text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
        >
          ← Writing
        </Link>
        <h1 className="display mt-5 text-[22px]">{post.title}</h1>
        <p className="mt-3 text-sm text-gray-400">{formatDate(post.date)}</p>
      </div>

      <div className="prose">
        <p>
          This is a placeholder article body. Replace it with your own writing, or wire this route
          up to a Markdown/MDX source later.
        </p>
        <h2>A placeholder section</h2>
        <p>
          Use this space to introduce the problem, share context, and explain why the reader should
          care. Keep paragraphs short and direct.
        </p>
        <ul>
          <li>First placeholder point.</li>
          <li>Second placeholder point.</li>
          <li>Third placeholder point.</li>
        </ul>
        <h2>Another placeholder section</h2>
        <p>
          Code samples use the same prose styles. For example: <code>const answer = 42;</code>.
        </p>
        <pre>
          <code>{`function placeholder() {\n  return "replace me";\n}`}</code>
        </pre>
        <p>Wrap up with a short conclusion or a link to related work.</p>
      </div>
    </article>
  );
}
