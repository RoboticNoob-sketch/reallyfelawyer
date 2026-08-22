import { Quote } from "lucide-react";
import type { ReactNode } from "react";

export default function PullQuote({
  children,
  attribution,
  className = "",
}: {
  children: ReactNode;
  attribution?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-surface via-canvas to-surface p-6 pl-7 ${className}`}
    >
      <span className="absolute bottom-0 left-0 top-0 w-1 bg-gold" />
      <Quote
        className="pointer-events-none absolute -right-2 -top-3 h-20 w-20 text-gold/10"
        fill="currentColor"
        strokeWidth={0}
      />
      <div className="relative italic text-white">{children}</div>
      {attribution && (
        <p className="relative mt-3 text-xs font-bold uppercase tracking-widest text-muted">
          {attribution}
        </p>
      )}
    </div>
  );
}
