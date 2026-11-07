export function Prose({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={["prose", className].filter(Boolean).join(" ")}>{children}</div>;
}
