import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { practiceAreasHub, metaDescription } from "@/lib/content";

export const metadata: Metadata = {
  title: practiceAreasHub.title,
  description: metaDescription(practiceAreasHub.blocks),
};

// First 3 blocks (eyebrow, h1, intro) form the hero; the rest is body content.
const HERO_BLOCK_COUNT = 3;

export default function PracticeAreasPage() {
  const heroBlocks = practiceAreasHub.blocks.slice(0, HERO_BLOCK_COUNT);
  const bodyBlocks = practiceAreasHub.blocks.slice(HERO_BLOCK_COUNT);

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
