import { Phone } from "lucide-react";
import { siteConfig } from "@/lib/content";

// Persistent tap-to-call + case-review bar for mobile — injury law leads
// convert heavily on mobile one-tap-call, and without this the only CTAs
// are in the hero, which scrolls out of view immediately. No client
// interactivity needed, so this stays a plain server component.
export default function MobileCtaBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-hairline bg-canvas/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={siteConfig.phone_tel_link}
        className="flex flex-1 items-center justify-center gap-2 border-r border-hairline py-3.5 text-sm font-bold text-white"
      >
        <Phone className="h-4 w-4" strokeWidth={2} />
        Call Now
      </a>
      <a
        href="/contact"
        className="flex flex-1 items-center justify-center bg-gold-gradient py-3.5 text-sm font-bold text-canvas"
      >
        Free Case Review
      </a>
    </div>
  );
}
