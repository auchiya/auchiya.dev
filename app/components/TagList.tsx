type TagListProps = {
  tags: string[];
  className?: string;
};

export function TagList({ tags, className = "" }: TagListProps) {
  return (
    <ul className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-line bg-raised px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-subtle uppercase"
        >
          {tag.replace(/-/g, " ")}
        </li>
      ))}
    </ul>
  );
}
