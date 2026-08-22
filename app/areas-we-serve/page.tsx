import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Info } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import FaqAccordion from "@/components/FaqAccordion";
import { areasWeServe } from "@/lib/content";

export const metadata: Metadata = {
  title: areasWeServe.hub_page.title,
  description: areasWeServe.hub_page.intro,
};

export default function AreasWeServePage() {
  const { hub_page, states } = areasWeServe;

  return (
    <div>
      <section className="border-b border-hairline bg-gradient-to-b from-surface to-canvas">
        <div className="mx-auto max-w-content px-6 py-16">
          <RevealOnScroll className="max-w-2xl">
            <p className="eyebrow mb-2">Coverage Area</p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">{hub_page.title}</h1>
            <p className="mt-4 text-body">{hub_page.intro}</p>
          </RevealOnScroll>
        </div>
      </section>

      <div className="mx-auto max-w-content space-y-14 px-6 py-16">
        <section>
          <h2 className="text-2xl font-bold text-white">Choose your state</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {states.map((state, i) => (
              <RevealOnScroll key={state.slug} delayMs={i * 80}>
                <div className="group flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.25)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold transition-transform duration-300 group-hover:scale-110">
                    <MapPin className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <Link
                    href={`/areas-we-serve/${state.slug}`}
                    className="mt-3 font-bold text-white hover:text-gold"
                  >
                    {state.name}
                  </Link>
                  <ul className="mt-3 space-y-1.5">
                    {state.cities.map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/areas-we-serve/${state.slug}/${city.slug}`}
                          className="text-sm text-muted hover:text-white"
                        >
                          {city.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </section>

        <RevealOnScroll className="flex gap-3 rounded-2xl border-l-4 border-gold bg-surface px-6 py-5">
          <Info className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold">
              Honest about how we serve you
            </p>
            <p className="mt-1 text-sm leading-relaxed text-body">{hub_page.honesty_note}</p>
          </div>
        </RevealOnScroll>

        <section>
          <p className="eyebrow mb-2">Know Your Rights</p>
          <h2 className="text-2xl font-bold text-white">State law comparison</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-hairline">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-xs font-bold uppercase tracking-wide text-gold">
                <tr>
                  {hub_page.state_law_comparison_table_columns.map((col) => (
                    <th key={col} className="whitespace-nowrap px-4 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {states.map((state) => (
                  <tr
                    key={state.slug}
                    className="border-t border-hairline transition-colors hover:bg-surface/50"
                  >
                    <td className="px-4 py-3 font-semibold text-white">{state.name}</td>
                    <td className="px-4 py-3 text-body">{state.general_sol}</td>
                    <td className="px-4 py-3 text-body">{state.med_mal_specifics}</td>
                    <td className="px-4 py-3 text-body">{state.damages_cap}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">{hub_page.disclaimer}</p>
        </section>

        <section>
          <p className="eyebrow mb-2">FAQ</p>
          <h2 className="mb-6 text-2xl font-bold text-white">Frequently asked questions</h2>
          <FaqAccordion items={hub_page.faq} />
        </section>
      </div>
    </div>
  );
}
