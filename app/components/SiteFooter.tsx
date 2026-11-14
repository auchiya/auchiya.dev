import Link from "next/link";
import { site } from "@/content/site";
import { ConsentSettingsButton } from "./ConsentSettingsButton";
import { ShortcutHelpButton } from "./ShortcutHelpButton";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-subtle md:w-9/12">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span>
          © {new Date().getFullYear()} {site.name}.
        </span>
        |
        <Link href="/privacy" className="transition hover:text-muted hover:opacity-80">
          Privacy
        </Link>
        |
        <ConsentSettingsButton />
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <SocialLinks />
        <ShortcutHelpButton />
        <ThemeToggle />
      </div>
    </footer>
  );
}
