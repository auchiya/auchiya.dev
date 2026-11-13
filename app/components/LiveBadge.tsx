type LiveBadgeProps = {
  className?: string;
};

export function LiveBadge({ className = "" }: LiveBadgeProps) {
  return (
    <span
      className={`live-badge inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-accent-ink uppercase ${className}`}
    >
      <span className="live-badge-dot size-1.5 rounded-full bg-accent" aria-hidden="true" />
      Live
    </span>
  );
}
