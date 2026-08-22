import type { Metadata } from "next";
import Link from "next/link";
import { areasWeServe } from "@/lib/content";

export const metadata: Metadata = {
  title: areasWeServe.hub_page.title,
  description: areasWeServe.hub_page.intro,
};

export default function AreasWeServePage() {
  const { hub_page, states } = areasWeServe;

  return (
    <div className="mx-auto max-w-content space-y-12 px-6 py-16">
      <div>
        <h1 className="text-4xl font-bold text-white sm:text-5xl">{hub_page.title}</h1>
        <p className="mt-4 max-w-2xl text-body">{hub_page.intro}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {states.map((state) => (
          <div key={state.slug} className="rounded-2xl border border-hairline bg-surface p-6">
            <Link href={`/areas-we-serve/${state.slug}`} className="font-bold text-white hover:text-primary">
              {state.name}
            </Link>
            <ul className="mt-3 space-y-1">
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
        ))}
      </div>

      <p className="text-body">{hub_page.honesty_note}</p>

      <div>
        <h2 className="text-2xl font-bold text-white">State law comparison</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                {hub_page.state_law_comparison_table_columns.map((col) => (
                  <th key={col} className="px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {states.map((state) => (
                <tr key={state.slug} className="border-t border-hairline">
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
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white">Frequently asked questions</h2>
        {hub_page.faq.map((item) => (
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
    </div>
  );
}
