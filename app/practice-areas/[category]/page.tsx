import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { AlertTriangle, ClipboardList, Info, type LucideIcon } from "lucide-react";
import BlockRenderer, { CTAButton } from "@/components/BlockRenderer";
import RevealOnScroll from "@/components/RevealOnScroll";
import StatBar from "@/components/StatBar";
import { PRACTICE_AREA_ICONS } from "@/components/PracticeAreaIcon";
import { practiceAreaCategories, getPracticeAreaCategory, metaDescription } from "@/lib/content";
import { PRACTICE_AREA_HERO_IMAGES } from "@/lib/practiceAreaImages";
import type { Block } from "@/lib/types";

export function generateStaticParams() {
  return practiceAreaCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getPracticeAreaCategory(categorySlug);
  return category
    ? { title: category.title, description: metaDescription(category.blocks) }
    : { title: "Not found" };
}

// Every category page follows the same shape: an h2 opens a section, and
// what follows is either a repeating (h3, text) list (conditions handled,
// warning signs, injury types...), or a block type BlockRenderer already
// knows how to grid (case-result, step, faq, state-rules). Splitting on h2
// and labeling each section with a short eyebrow — derived from the h2 text
// itself, so it needs no per-category content — turns every category page
// into the same polished template with zero page-specific code.
type HeadingBlock = Extract<Block, { type: "heading" }>;

function splitSections(blocks: Block[]): { heading: HeadingBlock; body: Block[] }[] {
  const sections: { heading: HeadingBlock; body: Block[] }[] = [];
  for (const block of blocks) {
    if (block.type === "heading" && block.tag === "h2") {
      sections.push({ heading: block, body: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].body.push(block);
    }
  }
  return sections;
}

function leadingPairs(body: Block[]): { pairs: { title: string; text: string }[]; rest: Block[] } {
  const pairs: { title: string; text: string }[] = [];
  let i = 0;
  while (i + 1 < body.length) {
    const a = body[i];
    const b = body[i + 1];
    if (a.type === "heading" && a.tag === "h3" && b.type === "text") {
      pairs.push({ title: a.text, text: b.text });
      i += 2;
    } else {
      break;
    }
  }
  return { pairs, rest: body.slice(i) };
}

function sectionEyebrow(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("frequently asked")) return "FAQ";
  if (t.includes("case outcome")) return "Featured Results";
  if (t.includes("how the reallyfe lawyer helps") || t.includes("how a mass tort works")) return "How It Works";
  if (t.includes("negligence") || t.includes("warning") || t.includes("signs of")) return "Warning Signs";
  if (t.includes("deadline") || t.includes("rules by state") || t.includes("who may file")) return "Know the Rules";
  if (t.includes("we handle") || t.includes("types of") || t.includes("causes of") || t.includes("claims we handle"))
    return "What We Handle";
  if (t.includes("do i have") || t.includes("do i qualify")) return "Check Your Case";
  if (t.includes("what to do") || t.includes("first days")) return "Next Steps";
  return null;
}

function sectionIcon(title: string): LucideIcon {
  const t = title.toLowerCase();
  if (t.includes("negligence") || t.includes("warning") || t.includes("signs of") || t.includes("deadline")) {
    return AlertTriangle;
  }
  return ClipboardList;
}

function FeatureGrid({
  pairs,
  icon: Icon,
}: {
  pairs: { title: string; text: string }[];
  icon: LucideIcon;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {pairs.map((item, j) => (
        <RevealOnScroll
          key={j}
          delayMs={j * 60}
          className="rounded-2xl border border-hairline bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h3 className="mt-4 font-bold text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-body">{item.text}</p>
        </RevealOnScroll>
      ))}
    </div>
  );
}

function PracticeAreaSection({
  heading,
  body,
  index,
}: {
  heading: HeadingBlock;
  body: Block[];
  index: number;
}) {
  const { pairs, rest } = leadingPairs(body);
  const eyebrow = sectionEyebrow(heading.text);
  const Icon = sectionIcon(heading.text);
  const isGrid = pairs.length >= 2;
  const trailingNote = rest.length === 1 && rest[0].type === "text" ? rest[0] : null;

  return (
    <section className={index > 0 ? "border-t border-hairline pt-14" : ""}>
      <RevealOnScroll>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="text-3xl font-bold text-white">{heading.text}</h2>
      </RevealOnScroll>

      {isGrid ? (
        <div className="mt-8">
          <FeatureGrid pairs={pairs} icon={Icon} />
        </div>
      ) : (
        <div className="mt-8">
          <BlockRenderer blocks={body} />
        </div>
      )}

      {isGrid && trailingNote && (
        <div className="mt-6 flex gap-3 rounded-2xl border-l-4 border-gold bg-surface px-6 py-5">
          <Info className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gold">Please Note</p>
            <p className="mt-1 text-sm leading-relaxed text-body">{trailingNote.text}</p>
          </div>
        </div>
      )}
      {isGrid && rest.length > 0 && !trailingNote && (
        <div className="mt-6">
          <BlockRenderer blocks={rest} />
        </div>
      )}
    </section>
  );
}

export default async function PracticeAreaCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const category = getPracticeAreaCategory(categorySlug);
  if (!category) notFound();

  const heroImage = PRACTICE_AREA_HERO_IMAGES[categorySlug];
  const Icon = PRACTICE_AREA_ICONS[category.title];
  const [h1, intro, ...rest] = category.blocks;

  // The CTA button sits right after the intro on some category pages, but
  // on most it only appears once, in the closing band further down — so the
  // hero borrows whichever case-review/phone buttons exist anywhere on the
  // page rather than requiring a fixed position. Any button pulled in from
  // right after the intro (birth-injury's shape) sits before the first h2
  // and would never render on its own — splitSections drops anything before
  // the first section heading — so reusing it here doesn't duplicate it;
  // buttons that live inside a real section (the closing band, on every
  // other category) stay there too, so the hero just echoes the same CTA.
  const isButton = (b: Block): b is Extract<Block, { type: "button" }> => b.type === "button";
  const primaryButton = rest.find((b) => isButton(b) && !b.link.startsWith("tel:")) as
    | Extract<Block, { type: "button" }>
    | undefined;
  const phoneButton = rest.find((b) => isButton(b) && b.link.startsWith("tel:")) as
    | Extract<Block, { type: "button" }>
    | undefined;

  if (heroImage && h1?.type === "heading" && intro?.type === "text" && primaryButton) {
    return (
      <div>
        <section className="relative overflow-hidden border-b border-hairline">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="animate-hero-zoom object-cover motion-reduce:animate-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/80 to-canvas/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-canvas/95 via-canvas/50 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-content px-6 py-28 sm:py-36">
            <RevealOnScroll className="max-w-2xl">
              {Icon && (
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-canvas/70 text-gold backdrop-blur">
                  <Icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
              )}
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
                {h1.text}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-body">{intro.text}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <CTAButton text={primaryButton.text} link={primaryButton.link} />
                {phoneButton && <CTAButton text={phoneButton.text} link={phoneButton.link} />}
              </div>
            </RevealOnScroll>
          </div>
        </section>
        <StatBar />
        <div className="mx-auto max-w-content px-6 py-16">
          {splitSections(rest).map((section, i) => (
            <PracticeAreaSection key={i} heading={section.heading} body={section.body} index={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <BlockRenderer blocks={category.blocks} />
    </div>
  );
}
