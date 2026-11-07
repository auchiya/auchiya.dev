import Link from "next/link";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { SidebarNav } from "./SidebarNav";

export function Sidebar() {
  return (
    <aside className="-mx-4 md:mx-0 md:w-[200px] md:shrink-0">
      <div className="lg:sticky lg:top-20">
        <div className="mb-2 flex flex-col items-start px-4 md:mb-20 md:flex-row md:px-0">
          <Logo />
          <h1 className="display mt-6 text-[19px] md:hidden">
            <Link href="/">{site.name}</Link>
          </h1>
        </div>
        <SidebarNav />
      </div>
    </aside>
  );
}
