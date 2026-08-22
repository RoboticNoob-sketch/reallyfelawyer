import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { resourcesHub, metaDescription } from "@/lib/content";

export const metadata: Metadata = {
  title: resourcesHub.title,
  description: metaDescription(resourcesHub.blocks),
};

// First 2 blocks (h1, intro) form the hero — this page has no eyebrow label.
const HERO_BLOCK_COUNT = 2;

// The reel section's TikTok thumbnails come from a signed, expiring CDN URL
// (see components/ReelThumbnail.tsx) — revalidating hourly keeps a
// statically-built page from shipping a thumbnail link that's gone stale by
// the time someone visits.
export const revalidate = 3600;

export default function ResourcesPage() {
  const heroBlocks = resourcesHub.blocks.slice(0, HERO_BLOCK_COUNT);
  const bodyBlocks = resourcesHub.blocks.slice(HERO_BLOCK_COUNT);

  return (
    <>
      <section className="border-b border-hairline bg-gradient-to-b from-surface to-canvas">
        <div className="mx-auto max-w-content px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <BlockRenderer blocks={heroBlocks} />
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-content space-y-12 px-6 py-16">
        <BlockRenderer blocks={bodyBlocks} />
      </div>
    </>
  );
}
