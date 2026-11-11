import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <aside className="md:w-[200px] md:shrink-0">
      <div className="lg:sticky lg:top-20">
        <div className="mb-6 flex items-center gap-3 md:mb-20 md:block">
          <Logo />
          <h1 className="display text-[19px] md:hidden">
            <Link href="/">{site.name}</Link>
          </h1>
        </div>
        <SidebarNav />
      </div>
    </aside>
  );
}
