"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";

export function SidebarNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label="Primary"
      className="overflow-x-auto px-4 pb-4 md:overflow-visible md:px-0 md:pb-0"
    >
      <div className="flex flex-row space-x-4 pr-10 md:flex-col md:space-x-0">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <div
              key={item.href}
              className="flex flex-col-reverse items-center py-1 text-sm md:flex-row"
            >
              <span
                aria-hidden="true"
                className={`mt-1 h-1 w-1 rounded-full bg-primary-500 transition-transform md:relative md:left-px md:mr-2 md:mt-0 ${
                  active ? "scale-125" : "scale-0"
                }`}
              />
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition-opacity hover:opacity-60 ${
                  active
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.label}
              </Link>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
