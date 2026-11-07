import Link from "next/link";
import { site } from "@/content/site";
import { Sidebar } from "./Sidebar";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-4 mb-40 mt-8 flex max-w-5xl flex-col md:mt-20 md:flex-row lg:mx-auto lg:mt-32">
      <Sidebar />
      <main className="mt-6 flex min-w-0 flex-auto flex-col md:mt-0">
        <h1 className="display mb-20 mt-[9px] hidden text-[19px] md:block">
          <Link href="/">{site.name}</Link>
        </h1>
        <div className="flex-auto">{children}</div>
        <SiteFooter />
      </main>
    </div>
  );
}
