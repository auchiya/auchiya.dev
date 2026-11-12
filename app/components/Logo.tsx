import Link from "next/link";
import { site } from "@/content/site";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className="display flex h-9 w-9 items-center justify-center rounded-full bg-accent-ink text-[12px] leading-none tracking-tight text-on-accent transition-opacity hover:opacity-80"
    >
      <span lang="ja" aria-hidden="true">
        {site.lastNameKanji}
      </span>
    </Link>
  );
}
