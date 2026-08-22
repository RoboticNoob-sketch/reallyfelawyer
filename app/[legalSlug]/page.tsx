import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { topLevelPages, getTopLevelPage, metaDescription } from "@/lib/content";

// Static routes (/about, /contact, /blog, etc.) always take priority over this
// dynamic segment in the Next.js App Router, so this only ever matches the
// legal pages below.
const LEGAL_SLUGS = [
  "privacy-policy",
  "disclaimer",
  "terms-of-use",
  "accessibility",
  "sitemap",
];

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ legalSlug: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ legalSlug: string }>;
}): Promise<Metadata> {
  const { legalSlug } = await params;
  const page = getTopLevelPage(legalSlug);
  return page
    ? { title: page.title, description: metaDescription(page.blocks) }
    : { title: "Not found" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ legalSlug: string }>;
}) {
  const { legalSlug } = await params;
  if (!LEGAL_SLUGS.includes(legalSlug)) notFound();
  const page = topLevelPages.find((p) => p.slug === legalSlug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
