// Every page's content is an array of typed Blocks — extracted from the
// original WordPress/Elementor content and cleaned into this shape.
// BlockRenderer.tsx switches on `type` to render each one.

export type Block =
  | { type: "heading"; tag?: string; text: string }
  | { type: "text"; text: string }
  | { type: "button"; text: string; link: string }
  | { type: "image"; url: string; alt?: string }
  | { type: "icon-list"; items: string[] }
  | { type: "faq"; items: { q: string; a: string }[] }
  | { type: "stat"; value: string; label: string }
  | { type: "step"; number: string; title: string; text: string }
  | {
      type: "case-result";
      location: string;
      result_type: string;
      amount?: string;
      title: string;
      description?: string;
    }
  | { type: "related-links"; items: { text: string; link: string }[] }
  | { type: "review-byline"; text: string }
  | { type: "state-rules"; state: string; rules: string[] }
  | { type: "category-list"; items: string[] }
  | { type: "credentials-placeholder"; note?: string; fields: Record<string, string> }
  | { type: "award-placeholder"; year: string; title: string; description: string }
  | { type: "media-placeholder"; title: string; date: string }
  | { type: "cause-placeholder"; title: string; description: string }
  | { type: "gallery-caption"; text: string }
  | { type: "testimonial-placeholder"; rating: number; quote: string; attribution: string }
  | {
      type: "testimonial-carousel";
      note?: string;
      items: { quote: string; name: string; case_type: string; settlement: string }[];
    }
  | {
      type: "reel-marquee";
      items: { platform: string; caption: string; url: string }[];
    }
  | { type: "reel-list"; items: { platform: string; caption: string; url: string }[] }
  | {
      type: "service-area-map";
      image?: string;
      states: { name: string; url: string; cities: { name: string; url: string }[] }[];
    }
  | {
      type: "blog-teaser";
      category: string;
      read_time: string;
      title: string;
      excerpt: string;
      cta: string;
      link: string;
    }
  | {
      type: "whitepaper";
      number: string;
      title: string;
      subtitle: string;
      learn_items: string[];
      cta: string;
      cta_link: string;
    }
  | { type: "episode"; number: string; title: string; description: string; youtube_url: string }
  | { type: "byline"; text: string }
  | { type: "trust-badges"; items: string[] }
  | { type: "glossary-term"; term: string; definition: string }
  | { type: "note"; text: string }; // internal migration note — never rendered

export interface ContentPage {
  id: number;
  title: string;
  slug: string;
  parent: number;
  note?: string;
  blocks: Block[];
}
