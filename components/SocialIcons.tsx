import { siteConfig } from "@/lib/content";
import PlatformIcon, { type Platform } from "./PlatformIcon";

const platforms: { key: Platform; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
];

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {platforms.map(({ key, label }) => {
        const href = siteConfig.social[key as keyof typeof siteConfig.social];
        if (!href) return null;
        return (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-body transition-colors hover:border-primary hover:text-white"
          >
            <span className="h-4 w-4">
              <PlatformIcon platform={key} />
            </span>
          </a>
        );
      })}
    </div>
  );
}
