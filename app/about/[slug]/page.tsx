import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import BlockRenderer, { CTAButton } from "@/components/BlockRenderer";
import RevealOnScroll from "@/components/RevealOnScroll";
import PullQuote from "@/components/PullQuote";
import { aboutSubpages, getAboutSubpage, metaDescription } from "@/lib/content";

export function generateStaticParams() {
  return aboutSubpages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getAboutSubpage(slug);
  return page
    ? { title: page.title, description: metaDescription(page.blocks) }
    : { title: "Not found" };
}

export default async function AboutSubpage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAboutSubpage(slug);
  if (!page) notFound();

  // The bio page's content starts with an image + eyebrow/h1/intro/credentials/CTA
  // group extracted from the original site's two-column hero (portrait left, bio
  // right) — matching that split here instead of letting the generic flow stack
  // the portrait full-width above the heading.
  if (slug === "larry-f-taylor") {
    const [portrait, eyebrow, heading, intro, credentials, cta, ...rest] = page.blocks;
    if (portrait?.type === "image" && cta?.type === "button") {
      return (
        <div className="mx-auto max-w-content px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <RevealOnScroll>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/30">
                <Image
                  src={portrait.url}
                  alt={portrait.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="object-cover"
                />
              </div>
            </RevealOnScroll>
            <RevealOnScroll delayMs={150}>
              <BlockRenderer blocks={[eyebrow, heading, intro, credentials]} />
              <div className="mt-6">
                <CTAButton text={cta.text} link={cta.link} />
              </div>
            </RevealOnScroll>
          </div>
          {(() => {
            const [cap1, cap2, cap3, storyHeading, p1, p2, p3, storyImage, quote, attribution, ...remainder] =
              rest;
            return (
              <>
                <div className="mt-16">
                  <BlockRenderer blocks={[cap1, cap2, cap3]} />
                </div>

                <section className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start">
                  <div className="space-y-6">
                    <BlockRenderer blocks={[storyHeading, p1, p2, p3]} />
                    {quote?.type === "text" && (
                      <PullQuote
                        attribution={attribution?.type === "text" ? attribution.text : undefined}
                      >
                        <p className="text-lg font-semibold">{quote.text}</p>
                      </PullQuote>
                    )}
                  </div>
                  {storyImage?.type === "image" && (
                    <RevealOnScroll
                      delayMs={150}
                      className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold/30 lg:sticky lg:top-24"
                    >
                      <Image
                        src={storyImage.url}
                        alt={storyImage.alt ?? ""}
                        fill
                        sizes="(min-width: 1024px) 400px, 100vw"
                        className="object-cover"
                      />
                    </RevealOnScroll>
                  )}
                </section>

                {(() => {
                  const [credHeading, credList, focusHeading, focusList, ...faqAndRest] = remainder;
                  const cards = [
                    { heading: credHeading, list: credList },
                    { heading: focusHeading, list: focusList },
                  ];
                  return (
                    <>
                      <div className="mt-16 grid gap-6 sm:grid-cols-2">
                        {cards.map(({ heading: cardHeading, list }, k) =>
                          list?.type === "icon-list" ? (
                            <RevealOnScroll
                              key={k}
                              delayMs={k * 100}
                              className="rounded-2xl border border-hairline bg-surface p-6"
                            >
                              {cardHeading?.type === "heading" && (
                                <h3 className="text-xl font-bold text-white">{cardHeading.text}</h3>
                              )}
                              <ul className="mt-4 space-y-3">
                                {list.items.map((entry, j) => (
                                  <li key={j} className="flex items-start gap-2.5 text-sm text-body">
                                    <CircleCheck
                                      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                                      strokeWidth={2}
                                    />
                                    <span>{entry}</span>
                                  </li>
                                ))}
                              </ul>
                            </RevealOnScroll>
                          ) : null
                        )}
                      </div>
                      <div className="mt-16">
                        <BlockRenderer blocks={faqAndRest} />
                      </div>
                    </>
                  );
                })()}
              </>
            );
          })()}
        </div>
      );
    }
  }

  // The results page's own hero is centered on the live site (this template's
  // default is left-aligned), and "A closer look at three cases" is a
  // horizontal carousel there — not a static grid. Matching both here.
  if (slug === "results") {
    const [eyebrow, heading, intro, cta, stat1, stat2, stat3, disclaimer, ...rest] = page.blocks;
    if (cta?.type === "button") {
      const [featuredEyebrow, featuredHeading, case1, case2, case3, ...remainder] = rest;
      const featuredCases = [case1, case2, case3].filter(
        (b): b is Extract<(typeof page.blocks)[number], { type: "case-result" }> =>
          b?.type === "case-result"
      );
      return (
        <div className="mx-auto max-w-content px-6 py-16">
          <RevealOnScroll className="mx-auto max-w-2xl text-center">
            <BlockRenderer blocks={[eyebrow, heading, intro]} />
            <div className="mt-6 flex justify-center">
              <CTAButton text={cta.text} link={cta.link} />
            </div>
            <div className="mt-10">
              <BlockRenderer blocks={[stat1, stat2, stat3]} />
            </div>
            <div className="mt-6">
              <BlockRenderer blocks={[disclaimer]} />
            </div>
          </RevealOnScroll>

          {featuredCases.length > 0 && (
            <section className="mt-16">
              <div className="mx-auto max-w-2xl text-center">
                <BlockRenderer blocks={[featuredEyebrow, featuredHeading]} />
              </div>
              <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                {featuredCases.map((cr, j) => (
                  <RevealOnScroll
                    key={j}
                    delayMs={j * 100}
                    className="w-[85%] shrink-0 snap-center sm:w-[380px]"
                  >
                    <div className="flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6">
                      <p className="text-xs font-bold uppercase tracking-wide text-white/60">
                        Featured result
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold">
                        <span>{cr.location}</span>
                        <span>·</span>
                        <span>{cr.result_type}</span>
                        {cr.amount && (
                          <span className="ml-auto rounded-full border border-gold/40 px-3 py-1 normal-case text-gold">
                            {cr.amount}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 font-bold text-white">{cr.title}</h3>
                      {cr.description && (
                        <p className="mt-2 flex-1 text-sm text-body">{cr.description}</p>
                      )}
                      <Link
                        href="/contact"
                        className="mt-4 text-sm font-semibold text-gold hover:text-white"
                      >
                        Discuss a similar case →
                      </Link>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          )}

          <div className="mt-16">
            <BlockRenderer blocks={remainder} />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
