import { site } from "@/content/site";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteFooter() {
  return (
    <footer className="mt-16 flex items-center justify-between text-sm text-gray-400 md:w-9/12">
      <div>
        © {new Date().getFullYear()} {site.name}.
      </div>
      <div className="flex items-center space-x-2">
        <SocialLinks />
        <ThemeToggle />
      </div>
    </footer>
  );
}
