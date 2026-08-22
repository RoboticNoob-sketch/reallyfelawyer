"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Baby,
  Droplet,
  Hand,
  Brain,
  Car,
  Truck,
  HeartHandshake,
  Pill,
  Stethoscope,
  Gavel,
  type LucideIcon,
} from "lucide-react";

type CaseResult = {
  location: string;
  result_type: string;
  amount?: string;
  title: string;
  description?: string;
};

// A light keyword match on the case text picks a fitting icon for the panel;
// falls back to a generic verdict icon so it still looks right on categories
// none of the keywords cover.
function caseIcon(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes("jaundice") || t.includes("kernicterus")) return Droplet;
  if (t.includes("shoulder") || t.includes("nerve") || t.includes("brachial")) return Hand;
  if (t.includes("brain") || t.includes("head injury") || t.includes("concussion")) return Brain;
  if (t.includes("baby") || t.includes("infant") || t.includes("newborn") || t.includes("birth")) return Baby;
  if (t.includes("truck")) return Truck;
  if (t.includes("car") || t.includes("crash") || t.includes("collision")) return Car;
  if (t.includes("death") || t.includes("fatal")) return HeartHandshake;
  if (t.includes("drug") || t.includes("medication")) return Pill;
  if (t.includes("device") || t.includes("implant") || t.includes("surgical") || t.includes("surgery")) {
    return Stethoscope;
  }
  return Gavel;
}

export default function CaseResultCarousel({ items }: { items: CaseResult[] }) {
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + items.length) % items.length);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((cr, j) => {
            const Icon = caseIcon(`${cr.title} ${cr.description ?? ""}`);
            return (
              <div key={j} className="flex w-full shrink-0 flex-col gap-6 sm:flex-row">
                <div className="flex shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(145deg,#3A1640,#8B3E96)] p-10 sm:w-[34%]">
                  <div className="text-center">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-gold">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/70">
                      Featured result
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-hairline bg-surface p-8 sm:p-10">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
                    <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
                    {cr.location} · {cr.result_type}
                  </div>
                  {cr.amount && <p className="text-3xl font-extrabold text-gold">{cr.amount}</p>}
                  <h3 className="text-xl font-bold text-white">{cr.title}</h3>
                  {cr.description && (
                    <p className="text-sm leading-relaxed text-body">{cr.description}</p>
                  )}
                  <Link
                    href="/contact"
                    className="mt-2 inline-block w-fit rounded-lg border border-hairline px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-gold/50"
                  >
                    Discuss a similar case
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous result"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-white transition-colors hover:border-gold/50"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, j) => (
              <button
                key={j}
                type="button"
                onClick={() => go(j)}
                aria-label={`Slide ${j + 1}`}
                className={`h-2 w-2 rounded-full transition-colors ${
                  j === index ? "bg-gold" : "bg-white/25"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next result"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline bg-surface text-white transition-colors hover:border-gold/50"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
