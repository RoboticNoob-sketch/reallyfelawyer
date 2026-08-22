import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { resourceSubpages, getResourceSubpage, metaDescription } from "@/lib/content";

export function generateStaticParams() {
  return resourceSubpages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getResourceSubpage(slug);
  return page
    ? { title: page.title, description: metaDescription(page.blocks) }
    : { title: "Not found" };
}

export default async function ResourceSubpage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getResourceSubpage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <BlockRenderer blocks={page.blocks} />
    </div>
  );
}
