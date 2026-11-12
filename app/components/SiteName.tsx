import { site } from "@/content/site";

export function SiteName() {
  return (
    <>
      <span className="block">{site.name}</span>
      <span
        lang="ja"
        className="mt-1 block text-[12px] font-medium tracking-[0.08em] text-subtle md:text-[13px]"
      >
        {site.nameJapanese}
      </span>
    </>
  );
}
