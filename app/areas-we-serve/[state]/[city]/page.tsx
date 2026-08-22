import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { areasWeServe, getState, getCity } from "@/lib/content";

export function generateStaticParams() {
  return areasWeServe.states.flatMap((state) =>
    state.cities.map((city) => ({ state: state.slug, city: city.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const city = getCity(stateSlug, citySlug);
  return city
    ? {
        title: `${city.name} Injury, Birth Injury & Malpractice Lawyer`,
        description: `Attorney Larry F. Taylor, Jr. represents ${city.name} families in birth injury, medical malpractice, mass torts, and accident cases. Free, confidential case review — no fee unless we win.`,
      }
    : { title: "Not found" };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = getState(stateSlug);
  const city = state && getCity(stateSlug, citySlug);
  if (!state || !city) notFound();

  return (
    <div className="mx-auto max-w-content space-y-10 px-6 py-16">
      <div>
        <p className="eyebrow">Local counsel</p>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          {city.name} Injury, Birth Injury &amp; Malpractice Lawyer
        </h1>
        <p className="mt-4 max-w-2xl text-body">
          Attorney Larry F. Taylor, Jr. — the RealLyfe Lawyer, as seen on Cochran Law
          Firm, Texas — represents {city.name} families in birth injury, medical
          malpractice, mass torts, brain injury, and car and truck wreck cases. Larry
          is based in Texas and licensed across Texas, Oklahoma, New Mexico, and
          Arizona, and partners with trusted co-counsel and associates nationwide — so
          no matter where you are, real answers and real advocacy are within reach.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">
          How long do I have to file a claim in {city.name}, {state.name}?
        </h2>
        <p className="mt-3 max-w-2xl text-body">{state.deadline_summary}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white">
          Why {city.name} families choose the RealLyfe Lawyer
        </h2>
        <ul className="mt-3 space-y-2">
          {[
            "Built for the cases others walk away from — birth injury, malpractice, and catastrophic injury.",
            "No fee unless we win.",
            "Local knowledge plus a nationwide network of co-counsel.",
          ].map((item) => (
            <li key={item} className="flex gap-3 text-body">
              <span className="mt-1 text-primary">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-muted">
        General information only, not legal advice. Larry F. Taylor, Jr. works with
        locally licensed co-counsel as required by state law.
      </p>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
        {[
          {
            q: `Do you have an office in ${city.name}?`,
            a: `We serve ${city.name} clients and associate with local counsel where needed.`,
          },
          {
            q: `What kinds of cases do you take in ${city.name}?`,
            a: "Birth injury, medical malpractice, mass torts, traumatic brain injury, car and truck wrecks, and wrongful death.",
          },
        ].map((item) => (
          <details key={item.q} className="group rounded-2xl border border-hairline bg-surface p-5">
            <summary className="cursor-pointer list-none font-semibold text-white marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-body">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="rounded-2xl border border-hairline bg-surface p-8 text-center">
        <h3 className="text-xl font-bold text-white">Free {city.name} Case Review</h3>
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
