import Link from "next/link";
import { KeyboardShortcutsProvider } from "./KeyboardShortcuts";
import { PageTransition } from "./PageTransition";
import { RouteFocus } from "./RouteFocus";
import { Sidebar } from "./Sidebar";
import { SiteFooter } from "./SiteFooter";
import { SiteName } from "./SiteName";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardShortcutsProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteFocus />
      <div className="mx-4 mt-8 flex max-w-5xl flex-col pb-24 md:mt-20 md:flex-row md:pb-0 lg:mx-auto lg:mt-32">
        <Sidebar />
        <main id="main" tabIndex={-1} className="mt-6 flex min-w-0 flex-auto flex-col md:mt-0">
          <h1 className="display mb-20 mt-[9px] hidden text-[19px] md:block">
            <Link href="/">
              <SiteName />
            </Link>
          </h1>
          <div className="flex-auto">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter />
        </main>
      </div>
    </KeyboardShortcutsProvider>
  );
}
