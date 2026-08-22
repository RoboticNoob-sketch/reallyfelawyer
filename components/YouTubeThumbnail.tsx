"use client";

import { useState } from "react";
import { Play } from "lucide-react";

function videoId(youtubeUrl: string): string | null {
  const match = youtubeUrl.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

// Loads a YouTube thumbnail instead of an always-on iframe — four embedded
// players on one page is a real load-time and privacy cost when a static
// thumbnail + click-to-play covers the same need.
export default function YouTubeThumbnail({
  youtubeUrl,
  title,
}: {
  youtubeUrl: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = videoId(youtubeUrl);

  if (playing && id) {
    return (
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerated-video; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block h-full w-full"
    >
      {id && (
        // eslint-disable-next-line @next/next/no-img-element -- external thumbnail, no local asset to optimize
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-canvas/30 transition-colors duration-300 group-hover:bg-canvas/10" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur transition-transform duration-300 group-hover:scale-110">
          <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" strokeWidth={0} />
        </span>
      </span>
    </button>
  );
}
