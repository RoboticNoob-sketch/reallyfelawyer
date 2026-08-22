"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const HIDDEN_TRANSFORM = {
  up: "opacity-0 translate-y-6",
  left: "opacity-0 translate-x-6",
} as const;

export default function RevealOnScroll({
  children,
  delayMs = 0,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  delayMs?: number;
  className?: string;
  direction?: keyof typeof HIDDEN_TRANSFORM;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : HIDDEN_TRANSFORM[direction]
      } ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
