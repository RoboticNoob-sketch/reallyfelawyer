"use client";

import dynamic from "next/dynamic";

const BrandSealScene = dynamic(() => import("./BrandSealScene"), { ssr: false });

export default function BrandSeal() {
  return (
    <section className="relative overflow-hidden border-y border-hairline bg-canvas py-4 sm:py-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.14), transparent 60%)",
        }}
      />
      <div className="relative mx-auto flex max-w-content flex-col items-center px-6 text-center">
        <div className="h-[280px] w-full max-w-md sm:h-[340px] lg:h-[400px]">
          <BrandSealScene />
        </div>
        <p className="-mt-6 text-xs font-bold uppercase tracking-[0.3em] text-gold sm:-mt-8">
          RealLyfe Lawyer
        </p>
        <p className="mt-2 max-w-md text-sm text-muted">
          Trial-ready representation, personally delivered.
        </p>
      </div>
    </section>
  );
}
