"use client";

import { useEffect, useRef } from "react";

// Scroll distance (px) over which the mark animates from its "unresolved"
// starting state to fully assembled — tuned to finish within the shared
// hero-glow band (see the h-[600px] div in layout.tsx) so it never lingers,
// half-formed, over unrelated page content.
const ASSEMBLY_DISTANCE = 480;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function BrandMarkReveal() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "0.2";
      el.style.transform = "translateX(-50%)";
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const progress = Math.min(1, Math.max(0, window.scrollY / ASSEMBLY_DISTANCE));
      const eased = easeOutCubic(progress);
      const rotate = -18 * (1 - eased);
      const scale = 0.8 + 0.2 * eased;
      const opacity = 0.07 + 0.18 * eased;
      const clip = 55 * (1 - eased);
      const parallaxY = window.scrollY * 0.16;
      el.style.transform = `translateX(-50%) translateY(${parallaxY}px) rotate(${rotate}deg) scale(${scale})`;
      el.style.opacity = String(opacity);
      el.style.clipPath = `inset(0 ${clip}% 0 0)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <img
      ref={ref}
      src="/brand/taylor-mark.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute top-[-20px] h-[380px] w-auto select-none brightness-0 invert will-change-transform sm:h-[440px] lg:h-[480px]"
      style={{ opacity: 0.07, left: "38%", transform: "translateX(-50%)" }}
    />
  );
}
