import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, Scale, MapPin } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatBar from "@/components/StatBar";
import AreaCtaCard from "@/components/AreaCtaCard";
import { PRACTICE_AREA_ICONS } from "@/components/PracticeAreaIcon";
import { areasWeServe, getState } from "@/lib/content";

export function generateStaticParams() {
  return areasWeServe.states.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getState(stateSlug);
  return state
    ? {
        title: `${state.name} Birth Injury, Malpractice & Injury Lawyer`,
        description: `Attorney Larry F. Taylor, Jr. represents ${state.name} families in birth injury, medical malpractice, mass torts, and accident cases. Free, confidential case review — no fee unless we win.`,
      }
    : { title: "Not found" };
}

const CASES_HANDLED = [
  "Birth injury (cerebral palsy, HIE, kernicterus, shoulder dystocia, placental abruption)",
  "Medical malpractice (misdiagnosis, surgical errors)",
  "Mass torts",
  "Traumatic brain injury, car wrecks, truck wrecks, and wrongful death",
];

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Birth Injury", href: "/practice-areas/birth-injury" },
  { label: "Medical Malpractice", href: "/practice-areas/medical-malpractice" },
  { label: "Car Accidents", href: "/practice-areas/car-accidents" },
  { label: "Truck Accidents", href: "/practice-areas/truck-accidents" },
];

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const state = getState(stateSlug);
  if (!state) notFound();

  const cityList = state.cities.map((c) => c.name).join(", ");

  return (
    <div>
      <section className="border-b border-hairline bg-gradient-to-b from-surface to-canvas">
        <div className="mx-auto max-w-content px-6 py-16">
          <RevealOnScroll className="max-w-2xl">
            <p className="eyebrow mb-2">{state.name}</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {state.name} Birth Injury, Malpractice &amp; Injury Lawyer
            </h1>
            <p className="mt-4 text-body">
              Attorney Larry F. Taylor, Jr. — the RealLyfe Lawyer, as seen on Cochran Law
              Firm, Texas — represents {state.name} families in birth injury, medical
              malpractice, mass torts, traumatic brain injury, and car and truck wreck
              cases. Larry is based in Texas and licensed across Texas, Oklahoma, New
              Mexico, and Arizona, and partners with trusted co-counsel and associates
              nationwide — so no matter where you are, real answers and real advocacy are
              within reach.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <StatBar />

      <div className="mx-auto max-w-content space-y-14 px-6 py-16">
        <section>
          <p className="eyebrow mb-2">What We Handle</p>
          <h2 className="text-2xl font-bold text-white">
            {state.name} injury and malpractice cases we handle
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CASES_HANDLED.map((item, i) => (
              <RevealOnScroll
                key={item}
                delayMs={i * 80}
                className="flex gap-3 rounded-2xl border border-hairline bg-surface p-5"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                <span className="text-sm leading-relaxed text-body">{item}</span>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow mb-2">Know the Rules</p>
          <h2 className="text-2xl font-bold text-white">Filing deadlines &amp; rules</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Clock, title: "General injury deadline", text: state.general_sol },
              { icon: FileText, title: "Medical malpractice specifics", text: state.med_mal_specifics },
              { icon: Scale, title: "Damages caps", text: state.damages_cap },
            ].map(({ icon: Icon, title, text }, i) => (
              <RevealOnScroll
                key={title}
                delayMs={i * 100}
                className="rounded-2xl border border-hairline bg-surface p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{text}</p>
              </RevealOnScroll>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-body">{state.deadline_summary}</p>
          {state.notes_extra.map((note) => (
            <p key={note} className="mt-2 text-sm text-muted">
              {note}
            </p>
          ))}
          <p className="mt-4 text-xs text-muted">
            General information only, not legal advice. Deadlines can be shorter for
            claims involving governmental entities, and may be tolled for minors.
            Confirm specifics with an attorney.
          </p>
        </section>

        <section>
          <p className="eyebrow mb-2">Local Coverage</p>
          <h2 className="text-2xl font-bold text-white">Cities we serve in {state.name}</h2>
          <p className="mt-2 max-w-2xl text-body">
            We help injured people throughout {state.name}, including {cityList}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {state.cities.map((city) => (
              <Link
                key={city.slug}
                href={`/areas-we-serve/${state.slug}/${city.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm text-body transition-colors hover:border-gold/50 hover:text-white"
              >
                <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white">Related practice areas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {QUICK_LINKS.map(({ label, href }) => {
              const Icon = PRACTICE_AREA_ICONS[label];
              return (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm text-white transition-colors hover:border-gold/50"
                >
                  {Icon && <Icon className="h-3.5 w-3.5 text-gold" strokeWidth={2} />}
                  {label}
                </Link>
              );
            })}
          </div>
        </section>

        <AreaCtaCard areaName={state.name} />
      </div>
    </div>
  );
}
