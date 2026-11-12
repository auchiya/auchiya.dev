import type { Metadata } from "next";
import Link from "next/link";
import { misc } from "@/content/misc";

export const metadata: Metadata = {
  title: "Misc",
  description: "Recipes, notes, and other things I enjoy.",
};

export default function MiscPage() {
  return (
    <div data-keynav-list className="-mt-[14px] flex flex-col divide-y divide-line">
      {misc.map((entry) => (
        <Link
          key={entry.slug}
          href={`/misc/${entry.slug}`}
          data-keynav-item
          className="text-ink transition-all hover:text-ink/70"
        >
          <div className="flex flex-col items-start pb-4 pt-3 md:flex-row md:pb-2">
            <div className="relative top-[2px] flex-auto md:w-9/12">
              <h1 className="display text-[17px]">{entry.title}</h1>
            </div>
            <div className="relative top-px shrink-0 text-sm text-subtle md:w-3/12 md:pl-4">
              {entry.note}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
