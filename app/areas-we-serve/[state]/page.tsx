import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
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
    <div className="mx-auto max-w-content space-y-10 px-6 py-16">
      <div>
        <p className="eyebrow">{state.name}</p>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          {state.name} Birth Injury, Malpractice &amp; Injury Lawyer
        </h1>
        <p className="mt-4 max-w-2xl text-body">
          Attorney Larry F. Taylor, Jr. — the RealLyfe Lawyer, as seen on Cochran Law
          Firm, Texas — represents {state.name} families in birth injury, medical
          malpractice, mass torts, traumatic brain injury, and car and truck wreck
          cases. Larry is based in Texas and licensed across Texas, Oklahoma, New
          Mexico, and Arizona, and partners with trusted co-counsel and associates
          nationwide — so no matter where you are, real answers and real advocacy are
          within reach.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          ["20+", "Years of trial experience"],
          ["4+", "States served — TX, OK, NM, AZ + more"],
          ["$0", "Fee unless we win or settle"],
          ["24/7", "Free confidential case review"],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="text-3xl font-bold text-primary">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">
          {state.name} injury and malpractice cases we handle
        </h2>
        <ul className="mt-3 space-y-2">
          {[
            "Birth injury (cerebral palsy, HIE, kernicterus, shoulder dystocia, placental abruption)",
            "Medical malpractice (misdiagnosis, surgical errors)",
            "Mass torts",
            "Traumatic brain injury, car wrecks, truck wrecks, and wrongful death",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-body">
              <span className="mt-1 text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-hairline bg-surface p-6">
          <h3 className="font-bold text-white">General injury deadline</h3>
          <p className="mt-2 text-sm text-body">{state.general_sol}</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface p-6">
          <h3 className="font-bold text-white">Medical malpractice specifics</h3>
          <p className="mt-2 text-sm text-body">{state.med_mal_specifics}</p>
        </div>
        <div className="rounded-2xl border border-hairline bg-surface p-6">
          <h3 className="font-bold text-white">Damages caps</h3>
          <p className="mt-2 text-sm text-body">{state.damages_cap}</p>
        </div>
      </div>

      <p className="text-body">{state.deadline_summary}</p>
      {state.notes_extra.map((note) => (
        <p key={note} className="text-sm text-muted">
          {note}
        </p>
      ))}

      <div>
        <h2 className="text-2xl font-bold text-white">Cities we serve in {state.name}</h2>
        <p className="mt-2 text-body">
          We help injured people throughout {state.name}, including {cityList}.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {state.cities.map((city) => (
            <Link
              key={city.slug}
              href={`/areas-we-serve/${state.slug}/${city.slug}`}
              className="rounded-full border border-hairline px-4 py-2 text-sm text-body hover:border-primary hover:text-white"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted">
        General information only, not legal advice. Deadlines can be shorter for claims
        involving governmental entities, and may be tolled for minors. Confirm
        specifics with an attorney.
      </p>

      <div className="flex flex-wrap gap-3">
        {[
          ["Birth Injury", "/practice-areas/birth-injury"],
          ["Medical Malpractice", "/practice-areas/medical-malpractice"],
          ["Car Accidents", "/practice-areas/car-accidents"],
          ["Truck Accidents", "/practice-areas/truck-accidents"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-hairline px-4 py-2 text-sm text-white hover:border-primary"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-hairline bg-surface p-8 text-center">
        <h3 className="text-xl font-bold text-white">Free {state.name} Case Review</h3>
        <p className="mt-2 text-sm text-body">
          No fee unless we win · Free, confidential case review · Real answers, fast
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-canvas hover:opacity-90"
          >
            Get My Free Case Review
          </Link>
          <a
            href="tel:+18665836763"
            className="rounded-full border border-hairline px-6 py-3 text-sm font-bold text-white hover:border-primary"
          >
            Call +1 (866) LT FOR ME
          </a>
        </div>
      </div>
    </div>
  );
}
