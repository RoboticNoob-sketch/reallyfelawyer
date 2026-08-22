import Link from "next/link";
import Image from "next/image";
import {
  Scale,
  ShieldCheck,
  MessagesSquare,
  Gavel,
  HandCoins,
  BadgeCheck,
  PhoneCall,
  FileSearch,
  Swords,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import BlockRenderer, { CTAButton } from "@/components/BlockRenderer";
import RevealOnScroll from "@/components/RevealOnScroll";
import PlatformIcon, { type Platform } from "@/components/PlatformIcon";
import PullQuote from "@/components/PullQuote";
import StatBar from "@/components/StatBar";
import { PRACTICE_AREA_ICONS } from "@/components/PracticeAreaIcon";
import { home, practiceAreaCategories, normalizeHref } from "@/lib/content";
import type { Block } from "@/lib/types";

const CHOOSE_US_ICONS: LucideIcon[] = [ShieldCheck, MessagesSquare, Gavel, HandCoins];
const STEP_ICONS: LucideIcon[] = [PhoneCall, FileSearch, Swords, Trophy];

// content/home.json's block order, by index — the homepage is one flat block
// array extracted from Elementor, but the live site lays several sections out
// as grids/two-column splits rather than the vertical flow BlockRenderer gives
// generic content pages. Slicing by index here lets each section get its own
// bespoke layout while everything still comes from the same content file.
//  0-2    eyebrow, h1, intro copy        -> hero left column
//  3-4    the two CTA buttons            -> hero left column, side by side
//  5      portrait image                 -> hero right column
//  6-7    name + title (unused — replaced by a hardcoded client-provided tagline)
//  8-15   4 stat pairs (value + label)   -> full-width stat bar below the hero
//  16-17  eyebrow + h2                   -> practice areas heading
//  18-38  7x (h3, text, "Learn more →")  -> practice area cards
//  39-40  "View all" title + subtitle    -> 8th card, links to /practice-areas
//  41-45  image, eyebrow, h2, text, cta  -> meet-the-attorney split
//  46-47  eyebrow + h2                   -> why-choose-us heading (left column)
//  48-55  4x (h3, text)                  -> why-choose-us feature list (right column)
//  56-60  eyebrow, h2, text, carousel, cta -> testimonials (BlockRenderer already grids this)
//  61-62  eyebrow + h2                   -> follow-along heading
//  63-66  4 follow/subscribe buttons     -> icon-link row
//  67     reel-marquee                   -> horizontal reel scroller
//  68-69  eyebrow + h2                   -> how-it-works heading
//  70-85  4x (number, h3, text, cta)     -> step cards
//  86-91  eyebrow, h2, map, eyebrow, h2, faq -> BlockRenderer already handles these well
//  92-95  h3, text, 2 buttons            -> closing CTA band, buttons side by side
const heroText = home.blocks.slice(0, 3);
const heroButtons = onlyButtons(home.blocks.slice(3, 5));
const portrait = home.blocks[5];

const practiceHeader = home.blocks.slice(16, 18);
const practiceAreaHrefByTitle = new Map(
  practiceAreaCategories.map((c) => [c.title, `/practice-areas/${c.slug}`])
);
const practiceCards = [18, 21, 24, 27, 30, 33, 36]
  .map((i) => {
    const title = home.blocks[i];
    const description = home.blocks[i + 1];
    if (title?.type !== "heading" || description?.type !== "text") return null;
    return {
      title: title.text,
      description: description.text,
      href: practiceAreaHrefByTitle.get(title.text) ?? "/practice-areas",
    };
  })
  .filter((c): c is NonNullable<typeof c> => c !== null);
const viewAllTitle = home.blocks[39];
const viewAllSubtitle = home.blocks[40];

const attorneyPhoto = home.blocks[41];
const attorneyCopy = home.blocks.slice(42, 46);

const chooseHeader = home.blocks.slice(46, 48);
const chooseFeatures = [48, 50, 52, 54]
  .map((i) => {
    const title = home.blocks[i];
    const text = home.blocks[i + 1];
    if (title?.type !== "heading" || text?.type !== "text") return null;
    return { title: title.text, text: text.text };
  })
  .filter((f): f is NonNullable<typeof f> => f !== null);

const testimonialBlocks = home.blocks.slice(56, 61);

const followHeader = home.blocks.slice(61, 63);
const followLinks = onlyButtons(home.blocks.slice(63, 67));
const reelBlock = home.blocks.slice(67, 68);

const stepsHeader = home.blocks.slice(68, 70);
const steps = [70, 74, 78, 82]
  .map((i) => {
    const number = home.blocks[i];
    const title = home.blocks[i + 1];
    const text = home.blocks[i + 2];
    const cta = home.blocks[i + 3];
    if (
      number?.type !== "heading" ||
      title?.type !== "heading" ||
      text?.type !== "text" ||
      cta?.type !== "button"
    )
      return null;
    return { number: number.text, title: title.text, text: text.text, cta: cta.text, link: cta.link };
  })
  .filter((s): s is NonNullable<typeof s> => s !== null);

const serviceAreaBlocks = home.blocks.slice(86, 89);
const faqBlocks = home.blocks.slice(89, 92);

const finalCtaHeading = home.blocks.slice(92, 94);
const finalCtaButtons = onlyButtons(home.blocks.slice(94, 96));

function onlyButtons(blocks: Block[]) {
  return blocks.filter((b): b is Extract<Block, { type: "button" }> => b.type === "button");
}

function SectionHeading({ blocks }: { blocks: Block[] }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <BlockRenderer blocks={blocks} />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline bg-hero-gradient">
        <div className="mx-auto max-w-content px-6 py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-12">
            <div className="animate-fade-up text-center lg:text-left">
              <BlockRenderer blocks={heroText} />
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                {heroButtons.map((b, i) => (
                  <CTAButton key={i} text={b.text} link={b.link} />
                ))}
              </div>
            </div>

            {portrait?.type === "image" && (
              <div className="animate-fade-up mx-auto w-full max-w-xs text-center [animation-delay:150ms] lg:mx-0 lg:max-w-sm lg:text-left">
                <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-gold/30">
                  <Image
                    src="/hero/attorney-hero.jpg"
                    alt="A parent gently holding their newborn's hand"
                    fill
                    sizes="(min-width: 1024px) 380px, 320px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/85 via-canvas/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-full border border-gold/40 bg-canvas/70 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur">
                    <Scale className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    Birth Injury &amp; Malpractice Advocates
                  </div>
                </div>
                <PullQuote attribution="— Larry F. Taylor, Jr." className="mt-5">
                  <p className="text-xl font-bold">
                    It&rsquo;s not about <span className="text-gold">&ldquo;I,&rdquo;</span> it&rsquo;s
                    about <span className="text-gold">&ldquo;You!&rdquo;</span>
                  </p>
                </PullQuote>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stat bar */}
      <StatBar />

      <div className="mx-auto max-w-content space-y-16 px-6 py-14 sm:space-y-20 sm:py-20 lg:space-y-24">
        {/* Practice areas */}
        <section>
          <SectionHeading blocks={practiceHeader} />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {practiceCards.map((card) => {
              const Icon = PRACTICE_AREA_ICONS[card.title];
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-xl border border-gold/45 bg-surface p-8 transition-colors hover:border-gold"
                >
                  {Icon && (
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-canvas text-gold transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6 group-hover:scale-110 group-hover:border-gold group-hover:text-primary group-hover:shadow-[0_0_16px_rgba(212,175,55,0.45)]">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                  )}
                  <h3 className="font-bold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-body">{card.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-gold">
                    Learn more →
                  </span>
                </Link>
              );
            })}
            {viewAllTitle?.type === "heading" && viewAllSubtitle?.type === "text" && (
              <Link
                href="/practice-areas"
                className="group flex flex-col justify-center rounded-xl border border-hairline bg-canvas p-8 transition-colors hover:border-primary"
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-surface text-primary transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_16px_rgba(212,175,55,0.35)]">
                  <Scale className="h-6 w-6" strokeWidth={1.75} />
                </span>
                <h3 className="font-bold text-white">{viewAllTitle.text}</h3>
                <p className="mt-2 text-sm text-body">{viewAllSubtitle.text}</p>
              </Link>
            )}
          </div>
        </section>

        {/* Meet your attorney */}
        <section className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {attorneyPhoto?.type === "image" && (
            <RevealOnScroll className="relative pb-6">
              <div className="pointer-events-none absolute -inset-4 bottom-2 rounded-[2rem] bg-gold/20 blur-2xl" />
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/40">
                <Image
                  src={attorneyPhoto.url}
                  alt={attorneyPhoto.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute bottom-0 left-6 flex items-center gap-2 rounded-full border border-gold/50 bg-canvas px-4 py-2 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <BadgeCheck className="h-4 w-4 text-gold" strokeWidth={2} />
                <span className="text-xs font-bold text-white">20+ Years Trial Experience</span>
              </div>
            </RevealOnScroll>
          )}
          <RevealOnScroll delayMs={150}>
            <BlockRenderer blocks={attorneyCopy} />
          </RevealOnScroll>
        </section>

        {/* Why families choose us */}
        <section className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <RevealOnScroll>
            <BlockRenderer blocks={chooseHeader} />
          </RevealOnScroll>
          <div className="divide-y divide-hairline">
            {chooseFeatures.map((feature, i) => {
              const Icon = CHOOSE_US_ICONS[i];
              return (
                <RevealOnScroll
                  key={i}
                  direction="left"
                  delayMs={i * 100}
                  className={`group flex gap-4 ${i === 0 ? "pb-6" : "py-6"}`}
                >
                  {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-surface text-gold transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_14px_rgba(212,175,55,0.4)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                  )}
                  <div className="relative flex-1 pl-4">
                    <span className="absolute left-0 top-1 h-0 w-px bg-gold transition-all duration-500 group-hover:h-[calc(100%-0.25rem)]" />
                    <h3 className="font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-body">{feature.text}</p>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <BlockRenderer blocks={testimonialBlocks} />
        </section>

        {/* Follow along */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <BlockRenderer blocks={followHeader} />
            <div className="flex flex-wrap gap-3">
              {followLinks.map((link, i) => {
                const isInternal = link.link.startsWith("/");
                const platform = (["instagram", "tiktok", "youtube", "facebook"] as Platform[]).find(
                  (p) => link.text.toLowerCase().includes(p)
                );
                const className =
                  "flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-xs font-semibold text-body transition-colors hover:border-primary hover:text-white";
                const content = (
                  <>
                    {platform && (
                      <span className="h-3.5 w-3.5 text-gold">
                        <PlatformIcon platform={platform} />
                      </span>
                    )}
                    {link.text}
                  </>
                );
                return isInternal ? (
                  <Link key={i} href={normalizeHref(link.link)} className={className}>
                    {content}
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="mt-8">
            <BlockRenderer blocks={reelBlock} />
          </div>
        </section>

        {/* How it works */}
        <section>
          <SectionHeading blocks={stepsHeader} />
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[i];
              const isLast = i === steps.length - 1;
              return (
                <RevealOnScroll key={i} delayMs={i * 120} className="relative">
                  {!isLast && (
                    <span className="absolute top-11 -right-5 hidden h-px w-5 bg-gold/40 lg:block" />
                  )}
                  <div
                    className={`group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 ease-out hover:-translate-y-1 ${
                      isLast
                        ? "border-gold/60 bg-gradient-to-br from-gold/15 via-surface to-surface hover:border-gold hover:shadow-[0_12px_30px_-8px_rgba(212,175,55,0.4)]"
                        : "border-hairline bg-surface hover:border-gold/50 hover:shadow-[0_12px_24px_-10px_rgba(212,175,55,0.25)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-110 ${
                            isLast
                              ? "border-gold bg-gold/20 text-gold"
                              : "border-gold/40 bg-canvas text-gold group-hover:border-gold"
                          }`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">{step.number}</span>
                    </div>
                    <h3 className="mt-3 font-bold text-white">{step.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-body">{step.text}</p>
                    <Link
                      href={normalizeHref(step.link)}
                      className="mt-4 text-sm font-semibold text-primary"
                    >
                      {step.cta} →
                    </Link>
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </section>

        {/* Service area */}
        <section>
          <BlockRenderer blocks={serviceAreaBlocks} />
        </section>

        {/* FAQ */}
        <section>
          <BlockRenderer blocks={faqBlocks} />
        </section>

        {/* Closing CTA */}
        <section className="rounded-2xl border border-hairline bg-surface px-6 py-10 text-center sm:px-8 sm:py-14">
          <div className="mx-auto max-w-xl">
            <BlockRenderer blocks={finalCtaHeading} />
          </div>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {finalCtaButtons.map((b, i) => (
              <CTAButton key={i} text={b.text} link={b.link} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
