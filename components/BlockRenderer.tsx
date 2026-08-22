import Link from "next/link";
import Image from "next/image";
import {
  Quote,
  Star,
  UserRound,
  Play,
  Image as ImageIcon,
  FileText,
  UserCheck,
  HandCoins,
  Lock,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import ServiceAreaGlobe from "./ServiceAreaGlobe";
import RevealOnScroll from "./RevealOnScroll";
import PlatformIcon, { type Platform } from "./PlatformIcon";
import FaqAccordion from "./FaqAccordion";
import CaseResultCarousel from "./CaseResultCarousel";
import YouTubeThumbnail from "./YouTubeThumbnail";
import type { Block } from "@/lib/types";
import { normalizeHref } from "@/lib/content";

const REEL_THUMBNAIL_STYLES: Record<Platform, string> = {
  tiktok: "from-cyan-400/25 via-canvas to-canvas",
  instagram: "from-fuchsia-500/20 via-orange-400/10 to-canvas",
  youtube: "from-red-500/25 via-canvas to-canvas",
  facebook: "from-blue-500/20 via-canvas to-canvas",
};

// A light keyword match on the badge text picks a fitting icon; falls back
// to a generic trust icon for wording these keywords don't cover.
function trustBadgeIcon(text: string): LucideIcon {
  const t = text.toLowerCase();
  if (t.includes("attorney") || t.includes("written") || t.includes("reviewed")) return UserCheck;
  if (t.includes("cost") || t.includes("free") || t.includes("fee")) return HandCoins;
  if (t.includes("sell") || t.includes("privacy") || t.includes("confidential")) return Lock;
  if (t.includes("cite") || t.includes("source") || t.includes("medical") || t.includes("legal")) {
    return BookOpen;
  }
  return UserCheck;
}

function reelPlatformKey(platform: string): Platform {
  const key = platform.toLowerCase();
  return key === "tiktok" || key === "instagram" || key === "youtube" || key === "facebook"
    ? key
    : "youtube";
}

export function CTAButton({ text, link }: { text: string; link: string }) {
  const isTel = link.startsWith("tel:");
  const isInternal = link.startsWith("/");
  const href = isInternal ? normalizeHref(link) : link;
  const primary = !isTel;

  const classes = primary
    ? "inline-block rounded-full bg-gold-gradient px-6 py-3 text-sm font-bold text-canvas transition-opacity hover:opacity-90"
    : "inline-block rounded-full border border-hairline px-6 py-3 text-sm font-bold text-white transition-colors hover:border-primary";

  if (isInternal) {
    return (
      <Link href={href} className={classes}>
        {text}
      </Link>
    );
  }
  return (
    <a href={href} className={classes}>
      {text}
    </a>
  );
}

function Heading({ tag, text }: { tag?: string; text: string }) {
  const safeTag = tag && ["h1", "h2", "h3", "h4"].includes(tag) ? tag : null;

  if (tag === "span") {
    return <p className="eyebrow mb-2">{text}</p>;
  }
  if (safeTag === "h1") {
    return (
      <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">{text}</h1>
    );
  }
  if (safeTag === "h2") {
    return <h2 className="text-3xl font-bold text-white">{text}</h2>;
  }
  if (safeTag === "h3") {
    return <h3 className="text-xl font-bold text-white">{text}</h3>;
  }
  // div / unknown tags from Elementor markup — render as a mid-weight label
  return <p className="text-lg font-bold text-white">{text}</p>;
}

type GalleryCaptionBlock = Extract<Block, { type: "gallery-caption" }>;
type ButtonBlock = Extract<Block, { type: "button" }>;
type StatBlock = Extract<Block, { type: "stat" }>;
type StepBlock = Extract<Block, { type: "step" }>;
type CaseResultBlock = Extract<Block, { type: "case-result" }>;
type BlogTeaserBlock = Extract<Block, { type: "blog-teaser" }>;
type WhitepaperBlock = Extract<Block, { type: "whitepaper" }>;
type EpisodeBlock = Extract<Block, { type: "episode" }>;

type BlockGroup =
  | Block
  | { kind: "gallery"; items: GalleryCaptionBlock[] }
  | { kind: "buttons"; items: ButtonBlock[] }
  | { kind: "stats"; items: StatBlock[] }
  | { kind: "steps"; items: StepBlock[] }
  | { kind: "case-results"; items: CaseResultBlock[] }
  | { kind: "blog-teasers"; items: BlogTeaserBlock[] }
  | { kind: "whitepapers"; items: WhitepaperBlock[] }
  | { kind: "episodes"; items: EpisodeBlock[] };

// Several block types only make sense laid out alongside their neighbors of
// the same type — as individual blocks in the space-y-6 flow they either
// collide (stat: inline-block siblings with no horizontal gap) or waste
// space stacking full-width when a grid reads far better (step, case-result,
// gallery-caption, button). Grouping consecutive same-type blocks here lets
// each one render as a single grid/row instead of one cramped or oversized
// block at a time.
function groupBlocks(blocks: Block[]): BlockGroup[] {
  const grouped: BlockGroup[] = [];
  for (const block of blocks) {
    const last = grouped[grouped.length - 1];
    const lastKind = last && typeof last === "object" && "kind" in last ? last.kind : undefined;
    if (block.type === "gallery-caption") {
      if (lastKind === "gallery") (last as { items: GalleryCaptionBlock[] }).items.push(block);
      else grouped.push({ kind: "gallery", items: [block] });
    } else if (block.type === "button") {
      if (lastKind === "buttons") (last as { items: ButtonBlock[] }).items.push(block);
      else grouped.push({ kind: "buttons", items: [block] });
    } else if (block.type === "stat") {
      if (lastKind === "stats") (last as { items: StatBlock[] }).items.push(block);
      else grouped.push({ kind: "stats", items: [block] });
    } else if (block.type === "step") {
      if (lastKind === "steps") (last as { items: StepBlock[] }).items.push(block);
      else grouped.push({ kind: "steps", items: [block] });
    } else if (block.type === "case-result") {
      if (lastKind === "case-results") (last as { items: CaseResultBlock[] }).items.push(block);
      else grouped.push({ kind: "case-results", items: [block] });
    } else if (block.type === "blog-teaser") {
      if (lastKind === "blog-teasers") (last as { items: BlogTeaserBlock[] }).items.push(block);
      else grouped.push({ kind: "blog-teasers", items: [block] });
    } else if (block.type === "whitepaper") {
      if (lastKind === "whitepapers") (last as { items: WhitepaperBlock[] }).items.push(block);
      else grouped.push({ kind: "whitepapers", items: [block] });
    } else if (block.type === "episode") {
      if (lastKind === "episodes") (last as { items: EpisodeBlock[] }).items.push(block);
      else grouped.push({ kind: "episodes", items: [block] });
    } else {
      grouped.push(block);
    }
  }
  return grouped;
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {groupBlocks(blocks).map((item, i) => {
        if (typeof item === "object" && item !== null && "kind" in item) {
          if (item.kind === "gallery") {
            return (
              <div key={i} className="grid grid-cols-3 gap-3">
                {item.items.map((caption, j) => (
                  <div
                    key={j}
                    className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gold/50 bg-surface p-3 text-center"
                  >
                    <ImageIcon className="h-6 w-6 text-gold/60" strokeWidth={1.5} />
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gold">
                      Needs data
                    </p>
                    <p className="text-xs font-semibold text-muted">{caption.text}</p>
                  </div>
                ))}
              </div>
            );
          }
          if (item.kind === "buttons") {
            return (
              <div key={i} className="flex flex-wrap items-center gap-3">
                {item.items.map((btn, j) => (
                  <CTAButton key={j} text={btn.text} link={btn.link} />
                ))}
              </div>
            );
          }

          if (item.kind === "stats") {
            return (
              <div key={i} className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {item.items.map((stat, j) => (
                  <div key={j}>
                    <p className="text-3xl font-extrabold text-gold [text-shadow:0_0_14px_rgba(212,175,55,0.4)]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            );
          }

          if (item.kind === "steps") {
            return (
              <div key={i} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {item.items.map((step, j) => {
                  const isLast = j === item.items.length - 1;
                  return (
                    <RevealOnScroll key={j} delayMs={j * 120} className="relative">
                      {!isLast && (
                        <span className="absolute top-9 -right-5 hidden h-px w-5 bg-gold/40 lg:block" />
                      )}
                      <div className="group flex h-full flex-col gap-4 rounded-2xl border border-hairline bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.25)]">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-canvas text-lg font-bold text-gold transition-all duration-300 group-hover:scale-110 group-hover:border-gold">
                          {step.number}
                        </span>
                        <div>
                          <h3 className="font-bold text-white">{step.title}</h3>
                          <p className="mt-1 text-sm text-body">{step.text}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  );
                })}
              </div>
            );
          }

          // Single-slide carousel with a gradient icon panel + prev/next/dot
          // navigation, matching the live site's featured-result widget.
          if (item.kind === "case-results") {
            return <CaseResultCarousel key={i} items={item.items} />;
          }

          // Blog card grid — each teaser gets an image slot up top (the live
          // site uses a "replace with photo" placeholder here too, since the
          // real post photography doesn't exist yet) rather than stacking
          // full-width excerpt blocks.
          if (item.kind === "blog-teasers") {
          return (
            <div key={i} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {item.items.map((teaser, j) => (
                <RevealOnScroll key={j} delayMs={j * 80}>
                  <Link
                    href={normalizeHref(teaser.link)}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.25)]"
                  >
                    <div className="flex aspect-video items-center justify-center border-b border-dashed border-gold/30 bg-canvas">
                      <ImageIcon className="h-8 w-8 text-gold/40" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold">
                        {teaser.category}
                        <span className="h-1 w-1 shrink-0 rounded-full bg-gold/40" />
                        <span className="font-semibold normal-case text-muted">
                          {teaser.read_time}
                        </span>
                      </p>
                      <h3 className="mt-3 font-bold text-white transition-colors group-hover:text-gold">
                        {teaser.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-body">{teaser.excerpt}</p>
                      <p className="mt-4 text-sm font-bold text-primary">{teaser.cta}</p>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          );
          }

          // Whitepaper guide card — a two-panel layout (content + a gradient
          // "guide number" panel with a document icon), matching the live
          // site's download-guide widget instead of a single flat card.
          if (item.kind === "whitepapers") {
          return (
            <div key={i} className="flex flex-col gap-6">
              {item.items.map((wp, j) => (
                <RevealOnScroll
                  key={j}
                  delayMs={j * 100}
                  className="flex flex-col overflow-hidden rounded-2xl border border-hairline sm:flex-row"
                >
                  <div className="flex flex-1 flex-col gap-3 bg-surface p-8">
                    <h3 className="text-xl font-bold text-white">{wp.title}</h3>
                    <p className="text-sm text-body">{wp.subtitle}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-muted">
                      What you&rsquo;ll learn
                    </p>
                    <ul className="space-y-1.5">
                      {wp.learn_items.map((learnItem, k) => (
                        <li key={k} className="flex gap-2 text-sm text-body">
                          <span className="text-primary">✓</span>
                          {learnItem}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <CTAButton text={wp.cta} link={wp.cta_link} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,#3A1640,#8B3E96)] px-10 py-8 sm:w-[220px]">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                      Guide {wp.number}
                    </p>
                    <FileText className="h-10 w-10 text-gold" strokeWidth={1.5} />
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          );
          }

          // Podcast episode grid — a click-to-play YouTube thumbnail instead
          // of an always-on iframe, so four embedded players don't all load
          // at once on page visit.
          return (
            <div key={i} className="grid gap-6 sm:grid-cols-2">
              {item.items.map((ep, j) => (
                <RevealOnScroll
                  key={j}
                  delayMs={j * 100}
                  className="overflow-hidden rounded-2xl border border-hairline bg-surface"
                >
                  <div className="aspect-video">
                    <YouTubeThumbnail youtubeUrl={ep.youtube_url} title={ep.title} />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-gold">
                      Episode {ep.number}
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-white">{ep.title}</h3>
                    <p className="mt-1 text-sm text-body">{ep.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          );
        }

        const block = item;
        switch (block.type) {
          case "note":
            return null; // internal migration note, never rendered

          case "heading":
            // h2 marks a new section on these long content-block pages — give it
            // a visible break so it reads as a section start, not just another
            // line in the uniform space-y-6 rhythm. h1/h3/span stay flush.
            return (
              <div
                key={i}
                className={
                  block.tag === "h2" && i > 0
                    ? "border-t border-hairline pt-10"
                    : undefined
                }
              >
                <Heading tag={block.tag} text={block.text} />
              </div>
            );

          case "text":
            return (
              <p key={i} className="max-w-3xl text-base leading-relaxed text-body">
                {block.text}
              </p>
            );

          case "image":
            // Original extraction didn't capture intrinsic width/height, so we
            // use `fill` inside a fixed-aspect container rather than guessing
            // dimensions — safer than layout shift from a wrong aspect ratio.
            return (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-hairline sm:aspect-video"
              >
                <Image
                  src={block.url}
                  alt={block.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 1100px, 100vw"
                  className="object-cover"
                />
              </div>
            );

          case "icon-list":
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-body">
                    <span className="mt-1 text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "related-links":
            return (
              <div key={i} className="flex flex-wrap gap-3">
                {block.items.map((item, j) => (
                  <Link
                    key={j}
                    href={normalizeHref(item.link)}
                    className="rounded-full border border-hairline px-4 py-2 text-sm text-body hover:border-primary hover:text-white"
                  >
                    {item.text}
                  </Link>
                ))}
              </div>
            );

          case "review-byline":
            return (
              <p key={i} className="text-xs italic text-muted">
                {block.text}
              </p>
            );

          case "state-rules":
            return (
              <div key={i} className="rounded-2xl border border-hairline bg-surface p-6">
                <h3 className="font-bold text-white">{block.state}</h3>
                <ul className="mt-2 space-y-1">
                  {block.rules.map((rule, j) => (
                    <li key={j} className="text-sm text-body">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "category-list":
            return (
              <div key={i} className="flex flex-wrap gap-2">
                {block.items.map((item, j) => (
                  <span
                    key={j}
                    className="rounded-full border border-hairline px-3 py-1 text-xs text-body"
                  >
                    {item}
                  </span>
                ))}
              </div>
            );

          case "credentials-placeholder":
            return (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gold/50 bg-surface p-6"
              >
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gold">
                  Needs real data
                </p>
                <dl className="space-y-1 text-sm text-body">
                  {Object.entries(block.fields).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <dt className="capitalize text-muted">{k.replace(/_/g, " ")}:</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            );

          case "award-placeholder":
            return (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gold/50 bg-surface p-6"
              >
                <p className="text-xs font-bold text-gold">{block.year}</p>
                <h3 className="mt-1 font-bold text-white">{block.title}</h3>
                <p className="mt-1 text-sm text-body">{block.description}</p>
              </div>
            );

          case "media-placeholder":
            return (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gold/50 bg-surface p-6"
              >
                <h3 className="font-bold text-white">{block.title}</h3>
                <p className="mt-1 text-sm text-muted">{block.date}</p>
              </div>
            );

          case "cause-placeholder":
            return (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gold/50 bg-surface p-6"
              >
                <h3 className="font-bold text-white">{block.title}</h3>
                <p className="mt-1 text-sm text-body">{block.description}</p>
              </div>
            );

          case "testimonial-placeholder":
            return (
              <div key={i} className="rounded-2xl border border-hairline bg-surface p-6">
                <div className="text-gold">{"★".repeat(block.rating)}</div>
                <p className="mt-3 italic text-body">&ldquo;{block.quote}&rdquo;</p>
                <p className="mt-3 text-sm font-bold text-white">{block.attribution}</p>
              </div>
            );

          case "testimonial-carousel":
            return (
              <div key={i}>
                {block.note && (
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">
                    {block.note}
                  </p>
                )}
                <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
                  {block.items.map((t, j) => (
                    <RevealOnScroll
                      key={j}
                      delayMs={j * 120}
                      className="group relative w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border border-dashed border-gold/40 bg-surface p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-solid hover:border-gold hover:shadow-[0_12px_30px_-8px_rgba(212,175,55,0.35)] sm:w-auto"
                    >
                      <Quote
                        className="pointer-events-none absolute -right-3 -top-3 h-24 w-24 text-gold/10 transition-colors duration-300 group-hover:text-gold/15"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                      <div className="relative flex items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold">
                          <UserRound className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                        <div>
                          <div className="flex gap-0.5 text-gold">
                            {Array.from({ length: 5 }).map((_, k) => (
                              <Star key={k} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                            ))}
                          </div>
                          <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-gold">
                            {t.settlement} · {t.case_type}
                          </span>
                        </div>
                      </div>
                      <p className="relative mt-4 text-sm italic text-body">&ldquo;{t.quote}&rdquo;</p>
                      <p className="relative mt-4 text-sm font-bold text-white">— {t.name}</p>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            );

          case "reel-marquee":
          case "reel-list":
            return (
              <div key={i} className="relative">
                <div className="[scrollbar-width:none] [-ms-overflow-style:none] flex items-stretch snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                  {block.items.map((reel, j) => {
                    const platform = reelPlatformKey(reel.platform);
                    return (
                      <RevealOnScroll
                        key={j}
                        delayMs={j * 80}
                        className="w-56 shrink-0 snap-start"
                      >
                        <a
                          href={reel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.3)]"
                        >
                          <div
                            className={`relative flex aspect-[9/12] shrink-0 items-center justify-center bg-gradient-to-br ${REEL_THUMBNAIL_STYLES[platform]}`}
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
                              <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" strokeWidth={0} />
                            </span>
                            <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur">
                              <span className="h-3 w-3">
                                <PlatformIcon platform={platform} />
                              </span>
                              {reel.platform}
                            </span>
                          </div>
                          <p className="flex-1 p-5 text-sm text-white">{reel.caption}</p>
                        </a>
                      </RevealOnScroll>
                    );
                  })}
                </div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-canvas to-transparent" />
              </div>
            );

          case "service-area-map":
            return (
              <div key={i}>
                <div
                  className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-hairline bg-canvas sm:aspect-[21/9]"
                  role="img"
                  aria-label="Rotating globe highlighting Texas, Oklahoma, New Mexico and Arizona — the states RealLyfe Lawyer serves"
                >
                  <ServiceAreaGlobe />
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {block.states.map((state, j) => (
                    <div
                      key={j}
                      className="rounded-2xl border border-hairline bg-surface p-6 text-center"
                    >
                      <Link
                        href={normalizeHref(state.url)}
                        className="font-bold text-white hover:text-primary"
                      >
                        {state.name}
                      </Link>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        {state.cities.map((city, k) => (
                          <Link
                            key={k}
                            href={normalizeHref(city.url)}
                            className="rounded-full border border-hairline px-3 py-1 text-xs text-body hover:border-primary hover:text-white"
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "byline":
            return (
              <p key={i} className="text-sm font-semibold text-muted">
                {block.text}
              </p>
            );

          case "trust-badges":
            return (
              <div key={i} className="flex flex-wrap gap-3">
                {block.items.map((item, j) => {
                  const Icon = trustBadgeIcon(item);
                  return (
                    <span
                      key={j}
                      className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface py-2 pl-2.5 pr-4 text-sm font-semibold text-white"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                      {item}
                    </span>
                  );
                })}
              </div>
            );

          case "glossary-term":
            return (
              <div key={i} className="border-b border-hairline pb-4">
                <h3 className="font-bold text-white">{block.term}</h3>
                <p className="mt-1 text-sm text-body">{block.definition}</p>
              </div>
            );

          case "faq":
            return <FaqAccordion key={i} items={block.items} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
