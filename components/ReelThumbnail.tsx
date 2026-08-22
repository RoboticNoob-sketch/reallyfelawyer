import { Image as ImageIcon } from "lucide-react";

// Real thumbnails where a free, keyless source exists:
// - YouTube: stable public CDN URL derived straight from the video ID.
// - TikTok: the public oEmbed endpoint returns one, but it's a *signed,
//   expiring* CDN URL — fine to fetch per-request, never safe to bake into
//   content data. `cache: "no-store"` keeps it live; pages that render this
//   need ISR (see `revalidate` exports on the pages that use it) so a
//   statically-built page doesn't ship a URL that 404s by the time anyone
//   visits.
// - Instagram: Meta retired public oEmbed thumbnails years ago — fetching
//   one now requires a Graph API app token we don't have, so this stays a
//   placeholder rather than silently failing or faking a photo.
async function tiktokThumbnail(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: unknown };
    return typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
}

function youtubeThumbnail(url: string): string | null {
  const id = url.match(/[?&]v=([^&]+)/)?.[1] ?? url.match(/\/shorts\/([^/?]+)/)?.[1];
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export default async function ReelThumbnail({
  platform,
  url,
  gradientClass,
}: {
  platform: "tiktok" | "instagram" | "youtube" | "facebook";
  url: string;
  gradientClass: string;
}) {
  const thumb = platform === "youtube" ? youtubeThumbnail(url) : platform === "tiktok" ? await tiktokThumbnail(url) : null;

  if (thumb) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external, per-request thumbnail; no local asset to optimize
      <img src={thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
    );
  }

  return (
    <div
      className={`absolute inset-0 border-b-2 border-dashed border-gold/30 bg-gradient-to-br ${gradientClass}`}
    >
      <span className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wide text-white/50">
        <ImageIcon className="h-3 w-3" strokeWidth={1.5} />
        Needs thumbnail
      </span>
    </div>
  );
}
