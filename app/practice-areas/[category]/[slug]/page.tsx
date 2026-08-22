import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { practiceAreaCategories, getPracticeAreaChild, metaDescription } from "@/lib/content";

export function generateStaticParams() {
  return practiceAreaCategories.flatMap((category) =>
    category.children.map((child) => ({
      category: category.slug,
      slug: child.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const child = getPracticeAreaChild(category, slug);
  return child
    ? { title: child.title, description: metaDescription(child.blocks) }
    : { title: "Not found" };
}

export default async function PracticeAreaChildPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const child = getPracticeAreaChild(category, slug);
  if (!child) notFound();

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <BlockRenderer blocks={child.blocks} />
    </div>
  );
}
