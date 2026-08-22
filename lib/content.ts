import type { Block, ContentPage } from "./types";

import homeJson from "@/content/home.json";
import topLevelJson from "@/content/top-level.json";
import aboutJson from "@/content/about.json";
import practiceAreasJson from "@/content/practice-areas.json";
import resourcesJson from "@/content/resources.json";
import areasWeServeJson from "@/content/areas-we-serve.json";
import designTokensJson from "@/content/design-tokens.json";
import formsJson from "@/content/forms.json";

export const home = homeJson as unknown as ContentPage;
export const topLevelPages = topLevelJson as unknown as ContentPage[];
export const aboutPages = aboutJson as unknown as ContentPage[];
export const practiceAreaPages = practiceAreasJson as unknown as ContentPage[];
export const resourcePages = resourcesJson as unknown as ContentPage[];
export const siteConfig = designTokensJson;
export const contactForm = formsJson.free_case_review_form;

// ---- About ----
// About hub is id 18; every other row in about.json is a subpage of it.
export const aboutHub = aboutPages.find((p) => p.id === 18)!;
export const aboutSubpages = aboutPages.filter((p) => p.id !== 18);
export function getAboutSubpage(slug: string) {
  return aboutSubpages.find((p) => p.slug === slug);
}

// ---- Legal / top-level ----
export function getTopLevelPage(slug: string) {
  return topLevelPages.find((p) => p.slug === slug);
}

// ---- Practice Areas ----
// practice-areas.json is a flat array; id 27 is the hub, everything else nests
// by WordPress `parent` id. Top-level categories have parent === 27; a few
// categories (birth-injury, medical-malpractice, mass-torts) have their own children.
export const practiceAreasHub = practiceAreaPages.find((p) => p.id === 27)!;

export interface PracticeAreaNode extends ContentPage {
  children: ContentPage[];
}

export const practiceAreaCategories: PracticeAreaNode[] = practiceAreaPages
  .filter((p) => p.parent === 27)
  .map((cat) => ({
    ...cat,
    children: practiceAreaPages.filter((p) => p.parent === cat.id),
  }));

export function getPracticeAreaCategory(slug: string) {
  return practiceAreaCategories.find((c) => c.slug === slug);
}

export function getPracticeAreaChild(categorySlug: string, childSlug: string) {
  const category = getPracticeAreaCategory(categorySlug);
  return category?.children.find((c) => c.slug === childSlug);
}

// ---- Resources ----
// resources.json contains the hub (id 43) plus subpages. Blog lives at the
// top level (/blog/) per the live nav; the rest sit under /resources/.
export const resourcesHub = resourcePages.find((p) => p.id === 43)!;
export const blogPage = resourcePages.find((p) => p.slug === "blog")!;
export const resourceSubpages = resourcePages.filter(
  (p) => p.id !== 43 && p.slug !== "blog"
);
export function getResourceSubpage(slug: string) {
  return resourceSubpages.find((p) => p.slug === slug);
}

// ---- Areas We Serve ----
interface StateData {
  id: number;
  name: string;
  slug: string;
  general_sol: string;
  med_mal_specifics: string;
  damages_cap: string;
  deadline_summary: string;
  notes_extra: string[];
  cities: { id: number; name: string; slug: string }[];
}

interface AreasWeServeData {
  hub_page: {
    id: number;
    title: string;
    slug: string;
    intro: string;
    honesty_note: string;
    faq: { q: string; a: string }[];
    state_law_comparison_table_columns: string[];
    disclaimer: string;
  };
  city_page_template: Record<string, unknown>;
  state_page_template: Record<string, unknown>;
  states: StateData[];
}

export const areasWeServe = areasWeServeJson as unknown as AreasWeServeData;

export function getState(slug: string) {
  return areasWeServe.states.find((s) => s.slug === slug);
}

export function getCity(stateSlug: string, citySlug: string) {
  const state = getState(stateSlug);
  return state?.cities.find((c) => c.slug === citySlug);
}

// ---- SEO helper ----
// Pulls the first `text` block as a meta description fallback, trimmed to a
// search-friendly length. Every content page has at least one intro paragraph
// as its first or second block, so this reliably finds real copy rather than
// leaving descriptions blank.
export function metaDescription(blocks: Block[], maxLength = 155): string {
  const first = blocks.find((b): b is Extract<Block, { type: "text" }> => b.type === "text");
  if (!first) return "";
  return first.text.length > maxLength
    ? `${first.text.slice(0, maxLength - 1).trimEnd()}…`
    : first.text;
}

// ---- Primary navigation ----
// Hand-built rather than derived from the content trees: nav labels are
// shorter than page titles ("Results" vs. "Verdicts & Settlements") and the
// order/grouping matches the live site's header + footer nav, not JSON order.
export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const primaryNav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Larry F. Taylor Bio", href: "/about/larry-f-taylor" },
      { label: "Results", href: "/about/results" },
      { label: "Awards", href: "/about/awards" },
      { label: "Media", href: "/about/media" },
      { label: "Community", href: "/about/community" },
      { label: "Our Process", href: "/about/our-process" },
      { label: "Reviews", href: "/about/reviews" },
      { label: "Editorial Policy", href: "/about/editorial-policy" },
    ],
  },
  {
    label: "Practice Areas",
    href: "/practice-areas",
    children: [
      { label: "Birth Injury", href: "/practice-areas/birth-injury" },
      { label: "Medical Malpractice", href: "/practice-areas/medical-malpractice" },
      { label: "Mass Torts", href: "/practice-areas/mass-torts" },
      { label: "Traumatic Brain Injury", href: "/practice-areas/traumatic-brain-injury" },
      { label: "Car Accidents", href: "/practice-areas/car-accidents" },
      { label: "Truck Accidents", href: "/practice-areas/truck-accidents" },
      { label: "Wrongful Death", href: "/practice-areas/wrongful-death" },
    ],
  },
  {
    label: "Areas We Serve",
    href: "/areas-we-serve",
    children: [
      { label: "Texas", href: "/areas-we-serve/texas" },
      { label: "Oklahoma", href: "/areas-we-serve/oklahoma" },
      { label: "New Mexico", href: "/areas-we-serve/new-mexico" },
      { label: "Arizona", href: "/areas-we-serve/arizona" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Whitepapers", href: "/resources/whitepapers" },
      { label: "Podcast", href: "/resources/podcast" },
      { label: "FAQs", href: "/resources/faqs" },
      { label: "Glossary", href: "/resources/glossary" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "About",
    links: primaryNav[0].children!,
  },
  {
    title: "Practice Areas",
    links: primaryNav[1].children!,
  },
  {
    title: "Areas We Serve",
    links: primaryNav[2].children!,
  },
  {
    title: "Resources",
    links: primaryNav[3].children!,
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
];

// ---- Link normalization ----
// Content was extracted from WordPress, where every internal URL has a
// trailing slash (/contact/). Next.js routes don't, so left as-is every
// internal link would 308-redirect on click. Strip it once here rather than
// editing trailing slashes out of every content JSON file.
export function normalizeHref(href: string): string {
  if (href === "/") return href;
  if (href.startsWith("/") && href.endsWith("/")) {
    return href.slice(0, -1);
  }
  return href;
}
