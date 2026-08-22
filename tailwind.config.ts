import type { Config } from "tailwindcss";

// Brand palette, verified against the live site's actual computed styles
// (reallyfelawyer.online) rather than the initial WordPress extraction:
// the page is black/near-black by default (canvas/surface unchanged from the
// original extraction), and purple + gold appear as *gradients* scoped to
// specific sections/buttons, not flat colors — see backgroundImage below.
// gold is kept as a separate token from primary even though they share the
// same value: primary is the brand/CTA color, gold is the decorative accent
// used on testimonials, the map, and the FAQ icon — letting them diverge later
// without a rename.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37",
        canvas: "#0A0A0A",
        surface: "#1A1A1A",
        hairline: "#2A2A2A",
        muted: "#888888",
        body: "#CCCCCC",
        gold: "#D4AF37",
      },
      backgroundImage: {
        // CTA buttons ("Get My Free Case Review" etc.) — confirmed via computed
        // styles on the live site's primary buttons.
        "gold-gradient": "linear-gradient(120deg, #F3DA8C 0%, #B8942E 100%)",
        // Hero section background — confirmed on the live site's hero container.
        "hero-gradient": "linear-gradient(180deg, #3A1640 0%, #0A0A0A 100%)",
        // Stat bar background — confirmed on the live site's stats container.
        "stat-gradient": "linear-gradient(90deg, #3A1640 0%, #1A1A1A 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
