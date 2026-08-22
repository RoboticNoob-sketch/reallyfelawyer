"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Clock, UserRound, X } from "lucide-react";
import { siteConfig } from "@/lib/content";

const DISMISS_KEY = "case-review-popup-dismissed";
const SHOW_DELAY_MS = 4000;

// A one-time-per-session lead capture popup, matching the live site's
// "Start Your Free Case Review" widget. Skipped on /contact since that page
// already is the conversion action — showing it there would just be noise.
export default function CaseReviewPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/contact")) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-review-popup-heading"
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 p-4 backdrop-blur-sm animate-fade-up"
      onClick={dismiss}
    >
      <div
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-hairline shadow-2xl sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-canvas/60 text-white transition-colors hover:bg-canvas/90"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex-1 bg-surface p-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-1.5 text-xs font-bold text-muted">
            <Clock className="h-3.5 w-3.5 text-gold" strokeWidth={2} />
            Available 24/7 · Free, confidential case review
          </span>
          <h2 id="case-review-popup-heading" className="mt-4 text-2xl font-bold text-white">
            Start Your <span className="text-gold">Free Case Review</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-body">
            No fee unless we win — birth injury, malpractice &amp; accident claims across TX, OK,
            NM &amp; AZ.
          </p>
          <a
            href="/contact"
            className="mt-6 block rounded-full bg-gold-gradient px-6 py-3.5 text-center text-sm font-bold text-canvas transition-opacity hover:opacity-90"
          >
            Get My Free Case Review
          </a>
          <a
            href={siteConfig.phone_tel_link}
            className="mt-3 block text-center text-xs font-semibold text-muted hover:text-white"
          >
            or call {siteConfig.phone}
          </a>
        </div>

        <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-[linear-gradient(160deg,#3A1640,#8B3E96)] px-8 py-8 text-center sm:w-[220px]">
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gold/50 bg-white/10 text-gold">
            <UserRound className="h-9 w-9" strokeWidth={1.5} />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Larry F. Taylor, Jr.</p>
            <p className="mt-1 text-xs text-white/70">Trial Attorney — Birth Injury &amp; Malpractice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
