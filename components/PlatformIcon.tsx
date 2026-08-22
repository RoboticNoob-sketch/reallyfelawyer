export type Platform = "instagram" | "tiktok" | "facebook" | "youtube";

export default function PlatformIcon({ platform }: { platform: Platform }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M13.8 8.2h1.7V5.6h-1.9c-1.9 0-3 1.1-3 3v1.9H9v2.6h1.6V19h2.7v-5.9h1.9l.3-2.6h-2.2V9c0-.5.2-.8.7-.8Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
          <path d="M10.5 9.7v4.6l4-2.3-4-2.3Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 3.5c.4 2 1.9 3.5 4 3.8v2.7c-1.5 0-2.9-.5-4-1.3v6.3a5.4 5.4 0 1 1-5.4-5.4c.3 0 .6 0 .9.1v2.8a2.6 2.6 0 1 0 1.9 2.5V3.5H15Z" />
        </svg>
      );
  }
}
