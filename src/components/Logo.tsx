interface Props { className?: string; showWord?: boolean; draw?: boolean }

/** Geometric emblem: an apex triangle split by an offset chevron cut. */
export function Emblem({ className = 'h-7 w-7', draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <path
        data-emblem="outer"
        d="M20 3 37.5 36.5H29L20 19.5 11 36.5H2.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="miter"
        pathLength={draw ? 1 : undefined}
        strokeDasharray={draw ? 1 : undefined}
        strokeDashoffset={draw ? 1 : undefined}
      />
      <path
        data-emblem="cut"
        d="M20 3 26.2 14.8"
        stroke="#d2581c"
        strokeWidth="2.6"
        pathLength={draw ? 1 : undefined}
        strokeDasharray={draw ? 1 : undefined}
        strokeDashoffset={draw ? 1 : undefined}
      />
      <path d="M13.5 30h13" stroke="currentColor" strokeWidth="1.4" opacity=".55" />
    </svg>
  );
}

export function Logo({ className = '', showWord = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Emblem />
      {showWord && (
        <span className="t-display t-wide text-[15px] leading-none tracking-[0.08em] sm:text-[16px]">
          APEX<span className="text-burnt"> </span>MOTORS
        </span>
      )}
    </span>
  );
}
