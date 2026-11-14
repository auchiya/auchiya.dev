import Link from "next/link";
import { site } from "@/content/site";
import { ConsentSettingsButton } from "./ConsentSettingsButton";
import { ShortcutHelpButton } from "./ShortcutHelpButton";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex flex-col items-center gap-4 text-center text-sm text-subtle md:w-9/12 md:flex-row md:items-center md:justify-between md:text-left">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:justify-start">
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
      <div className="flex items-center justify-center space-x-2">
        <SocialLinks />
        <ShortcutHelpButton />
        <ThemeToggle />
      </div>
    </footer>
  );
}
