import type { Metadata } from "next";
import BlockRenderer from "@/components/BlockRenderer";
import { blogPage, metaDescription } from "@/lib/content";

export const metadata: Metadata = {
  title: blogPage.title,
  description: metaDescription(blogPage.blocks),
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <BlockRenderer blocks={blogPage.blocks} />
    </div>
  );
}
