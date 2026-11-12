"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import { PREFIX } from "@/app/lib/shortcuts";

export function SidebarNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:border-0 md:bg-transparent md:pb-0 md:backdrop-blur-none"
    >
      <div className="flex items-stretch justify-around px-2 md:flex-col md:justify-start md:px-0 md:pr-10">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex flex-1 flex-col items-center gap-1 py-2.5 text-xs transition-colors md:flex-none md:flex-row md:gap-0 md:py-1 md:text-sm md:transition-opacity md:hover:opacity-60 ${
                active ? "text-accent-ink" : "text-muted"
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-1 w-1 rounded-full bg-accent transition-transform md:mr-2 ${
                  active ? "scale-125" : "scale-0"
                }`}
              />
              <span>{item.label}</span>
              <span
                aria-hidden="true"
                className="ml-2 hidden font-mono text-[10px] tracking-tight text-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:inline"
              >
                {PREFIX} {item.shortcut}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
