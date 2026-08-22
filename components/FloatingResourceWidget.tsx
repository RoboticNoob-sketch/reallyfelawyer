"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, FileText, Newspaper, Mic, Phone, X, type LucideIcon } from "lucide-react";

const DISMISS_KEY = "resource-widget-dismissed";
const SHOW_DELAY_MS = 7000;
const ROTATE_MS = 6000;

const SLIDES: { icon: LucideIcon; eyebrow: string; title: string; text: string; cta: string; href: string }[] = [
  {
    icon: FileText,
    eyebrow: "Free Guide",
    title: "Legal Whitepapers",
    text: "In-depth guides on birth injury, malpractice & accident claims — free to download.",
    cta: "Get the Guide",
    href: "/resources/whitepapers",
  },
  {
    icon: Newspaper,
    eyebrow: "Latest Articles",
    title: "The RealLyfe Blog",
    text: "Plain-English articles on birth injury, malpractice, mass torts & accident law.",
    cta: "Read the Blog",
    href: "/blog",
  },
  {
    icon: Mic,
    eyebrow: "Watch Now",
    title: "Taylor Made Conversations",
    text: "Larry talks with guests across generations about law, life & relationships.",
    cta: "Watch Episodes",
    href: "/resources/podcast",
  },
  {
    icon: Phone,
    eyebrow: "Free Consultation",
    title: "Talk to Larry Directly",
    text: "No fee unless we win — get a free, confidential case review.",
    cta: "Get Started",
    href: "/contact",
  },
];

// A small persistent corner widget, separate from the full-screen
// CaseReviewPopup — it rotates through the site's resource pages rather
// than blocking the page, so it can stay up without competing for attention
// the way a modal does. Delayed slightly later than the popup so the two
// don't appear on top of each other on first load.
export default function FloatingResourceWidget() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (pathname?.startsWith("/contact")) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [visible]);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  function go(i: number) {
    setIndex((i + SLIDES.length) % SLIDES.length);
  }

  if (!visible) return null;

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <div className="animate-fade-up fixed bottom-20 right-4 z-40 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-gold/40 bg-canvas p-4 shadow-2xl md:bottom-6 md:right-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-gold">{slide.eyebrow}</p>
          <p className="mt-0.5 font-bold text-white">{slide.title}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:text-white"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-body">{slide.text}</p>
      <a
        href={slide.href}
        className="mt-2 inline-block text-sm font-bold text-gold underline-offset-2 hover:text-white hover:underline"
      >
        {slide.cta} →
      </a>
      <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, j) => (
            <button
              key={j}
              type="button"
              onClick={() => go(j)}
              aria-label={`Slide ${j + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                j === index ? "bg-gold" : "bg-hairline"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-hairline text-white transition-colors hover:border-gold/50"
          >
            <ChevronLeft className="h-3 w-3" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next"
            className="flex h-6 w-6 items-center justify-center rounded-full border border-hairline text-white transition-colors hover:border-gold/50"
          >
            <ChevronRight className="h-3 w-3" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
