import type { MetadataRoute } from "next";
import {
  practiceAreaCategories,
  aboutSubpages,
  resourceSubpages,
  areasWeServe,
} from "@/lib/content";

const BASE_URL = "https://reallyfelawyer.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/practice-areas",
    "/areas-we-serve",
    "/resources",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/disclaimer",
    "/terms-of-use",
    "/accessibility",
    "/sitemap",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const aboutRoutes = aboutSubpages.map((p) => ({
    url: `${BASE_URL}/about/${p.slug}`,
    lastModified: new Date(),
  }));

  const practiceAreaRoutes = practiceAreaCategories.flatMap((category) => [
    { url: `${BASE_URL}/practice-areas/${category.slug}`, lastModified: new Date() },
    ...category.children.map((child) => ({
      url: `${BASE_URL}/practice-areas/${category.slug}/${child.slug}`,
      lastModified: new Date(),
    })),
  ]);

  const areasRoutes = areasWeServe.states.flatMap((state) => [
    { url: `${BASE_URL}/areas-we-serve/${state.slug}`, lastModified: new Date() },
    ...state.cities.map((city) => ({
      url: `${BASE_URL}/areas-we-serve/${state.slug}/${city.slug}`,
      lastModified: new Date(),
    })),
  ]);

  const resourceRoutes = resourceSubpages.map((p) => ({
    url: `${BASE_URL}/resources/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...aboutRoutes,
    ...practiceAreaRoutes,
    ...areasRoutes,
    ...resourceRoutes,
  ];
}
