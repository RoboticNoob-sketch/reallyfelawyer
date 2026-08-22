"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Scale } from "lucide-react";
import { PRACTICE_AREA_ICONS } from "./PracticeAreaIcon";

const ROTATE_MS = 5000;

export default function HeroImageCarousel({
  slides,
}: {
  slides: { slug: string; title: string; image: string }[];
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[index];
  const Icon = PRACTICE_AREA_ICONS[slide.title] ?? Scale;

  return (
    <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-gold/30">
      {slides.map((s, i) => (
        <Image
          key={s.slug}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 380px, 320px"
          className={`object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/85 via-canvas/10 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full border border-gold/40 bg-canvas/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur">
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
        {slide.title} Advocates
      </div>
      {slides.length > 1 && (
        <div className="absolute right-4 top-4 flex gap-1.5">
          {slides.map((s, i) => (
            <span
              key={s.slug}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-gold" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
