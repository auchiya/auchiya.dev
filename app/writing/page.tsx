import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, posts } from "@/content/site";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and notes on software engineering.",
};

export default function WritingPage() {
  return (
    <div className="-mt-[14px] flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/writing/${post.slug}`}
          className="text-gray-900 transition-all hover:text-gray-900/70 dark:text-gray-100 dark:hover:text-gray-100/70"
        >
          <div className="flex flex-col items-start pb-4 pt-3 md:flex-row md:pb-2">
            <div className="relative top-[2px] flex-auto md:w-9/12">
              <h1 className="display text-[17px]">{post.title}</h1>
            </div>
            <div className="relative top-px shrink-0 text-sm text-gray-400 md:w-3/12 md:pl-4">
              {formatDate(post.date)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
