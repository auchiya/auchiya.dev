import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-4 py-20">
      <p className="display text-4xl">404</p>
      <p className="text-muted">Page not found.</p>
      <Link href="/" className="text-sm text-accent-ink transition hover:opacity-70">
        ← Back home
      </Link>
    </div>
  );
}
