import Link from "next/link";
import { siteConfig } from "@/lib/content";

export default function AreaCtaCard({ areaName }: { areaName: string }) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-surface via-canvas to-surface p-8 text-center">
      <h3 className="text-xl font-bold text-white">Free {areaName} Case Review</h3>
      <p className="mt-2 text-sm text-body">
        No fee unless we win · Free, confidential case review · Real answers, fast
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Link
          href="/contact"
          className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-canvas transition-opacity hover:opacity-90"
        >
          Get My Free Case Review
        </Link>
        <a
          href={siteConfig.phone_tel_link}
          className="rounded-full border border-hairline px-6 py-3 text-sm font-bold text-white transition-colors hover:border-primary"
        >
          Call {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}
