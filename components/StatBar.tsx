import RevealOnScroll from "./RevealOnScroll";

// Site-wide trust stats — same four facts wherever this appears (homepage,
// practice-area pages), so it's kept as one shared source instead of
// per-page content that could drift out of sync.
const TRUST_STATS = [
  { value: "20+", label: "Years of trial experience" },
  { value: "4", label: "States served — TX, OK, NM, AZ" },
  { value: "$0", label: "Fee unless we win or settle" },
  { value: "24/7", label: "Free confidential case review" },
];

export default function StatBar() {
  return (
    <section className="border-b border-hairline bg-stat-gradient">
      <div className="mx-auto grid max-w-content grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 sm:grid-cols-4 sm:gap-8 sm:divide-x sm:divide-gold/25 sm:py-12">
        {TRUST_STATS.map((stat, i) => (
          <RevealOnScroll
            key={i}
            delayMs={i * 120}
            className="text-center sm:px-6 sm:text-left first:sm:pl-0"
          >
            <p className="text-4xl font-extrabold text-gold [text-shadow:0_0_18px_rgba(212,175,55,0.55)]">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
