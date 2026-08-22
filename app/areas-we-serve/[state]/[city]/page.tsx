import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import FaqAccordion from "@/components/FaqAccordion";
import AreaCtaCard from "@/components/AreaCtaCard";
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

  const whyChooseUs = [
    "Built for the cases others walk away from — birth injury, malpractice, and catastrophic injury.",
    "No fee unless we win.",
    "Local knowledge plus a nationwide network of co-counsel.",
  ];

  const faq = [
    {
      q: `Do you have an office in ${city.name}?`,
      a: `We serve ${city.name} clients and associate with local counsel where needed.`,
    },
    {
      q: `What kinds of cases do you take in ${city.name}?`,
      a: "Birth injury, medical malpractice, mass torts, traumatic brain injury, car and truck wrecks, and wrongful death.",
    },
  ];

  return (
    <div>
      <section className="border-b border-hairline bg-gradient-to-b from-surface to-canvas">
        <div className="mx-auto max-w-content px-6 py-16">
          <RevealOnScroll className="max-w-2xl">
            <p className="eyebrow mb-2">Local Counsel</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              {city.name} Injury, Birth Injury &amp; Malpractice Lawyer
            </h1>
            <p className="mt-4 text-body">
              Attorney Larry F. Taylor, Jr. — the RealLyfe Lawyer, as seen on Cochran Law
              Firm, Texas — represents {city.name} families in birth injury, medical
              malpractice, mass torts, brain injury, and car and truck wreck cases. Larry
              is based in Texas and licensed across Texas, Oklahoma, New Mexico, and
              Arizona, and partners with trusted co-counsel and associates nationwide — so
              no matter where you are, real answers and real advocacy are within reach.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-14 px-6 py-16">
        <section>
          <h2 className="text-2xl font-bold text-white">
            How long do I have to file a claim in {city.name}, {state.name}?
          </h2>
          <p className="mt-3 max-w-2xl text-body">{state.deadline_summary}</p>
        </section>

        <section>
          <p className="eyebrow mb-2">Why Choose Us</p>
          <h2 className="text-2xl font-bold text-white">
            Why {city.name} families choose the RealLyfe Lawyer
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <RevealOnScroll
                key={item}
                delayMs={i * 100}
                className="flex gap-3 rounded-2xl border border-hairline bg-surface p-5"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.75} />
                <span className="text-sm leading-relaxed text-body">{item}</span>
              </RevealOnScroll>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted">
            General information only, not legal advice. Larry F. Taylor, Jr. works with
            locally licensed co-counsel as required by state law.
          </p>
        </section>

        <section>
          <p className="eyebrow mb-2">FAQ</p>
          <h2 className="mb-6 text-2xl font-bold text-white">Frequently asked questions</h2>
          <FaqAccordion items={faq} />
        </section>

        <AreaCtaCard areaName={city.name} />
      </div>
    </div>
  );
}
