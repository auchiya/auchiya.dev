import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4 py-20">
      <p className="display text-4xl">404</p>
      <p className="text-gray-500 dark:text-gray-400">Page not found.</p>
      <Link
        href="/"
        className="text-sm text-primary-600 transition hover:opacity-70 dark:text-primary-400"
      >
        ← Back home
      </Link>
    </div>
  );
}
