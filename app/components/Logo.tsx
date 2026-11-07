import Link from "next/link";
import { site } from "@/content/site";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className="display flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-[13px] tracking-widest text-white transition-opacity hover:opacity-80 dark:bg-primary-500 dark:text-gray-900"
    >
      {site.monogram}
    </Link>
  );
}
