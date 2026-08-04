import { server } from "../lib/config";
import localizationData from "../public/pagemenudata.json";

const staticRoutes = [
  "",
  "/quran-translations",
  "/learn-quran",
  "/dua",
  "/ruqyah",
  "/maqqa",
  "/madinah",
  "/shorts",
  "/taraweeh",
  "/taraweeh-maqqa",
  "/taraweeh-madinah",
  "/about",
  "/privacy-policy",
];

// Google's sitemap protocol caps a single file at 50,000 URLs. Chunking
// below that (instead of at it) leaves headroom for entries added within a
// single build. generateSitemaps() below splits into /sitemap/<id>.xml
// files once entries.length exceeds this, so growth to thousands of routes
// (e.g. a future per-content page) doesn't require touching this file again.
const MAX_URLS_PER_SITEMAP = 40000;

// Centralizes every route source (static + locale-driven today) so new
// sources can be appended here without changing the chunking/generateSitemaps
// logic below.
async function getAllEntries() {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${server}${route}`,
    lastModified: now,
  }));

  const localeEntries = localizationData.data.flatMap((locale) => [
    { url: `${server}/home/${locale.attributes.code}`, lastModified: now },
    {
      url: `${server}/quran-translations/${locale.attributes.code}`,
      lastModified: now,
    },
    {
      url: `${server}/learn-quran/${locale.attributes.code}`,
      lastModified: now,
    },
  ]);

  return [...staticEntries, ...localeEntries];
}

// Shared with robots.js so it can list every generated /sitemap/<id>.xml
// URL without duplicating the chunking math.
export async function getSitemapIds() {
  const entries = await getAllEntries();
  const numberOfSitemaps = Math.max(
    1,
    Math.ceil(entries.length / MAX_URLS_PER_SITEMAP)
  );
  return Array.from({ length: numberOfSitemaps }, (_, id) => id);
}

export async function generateSitemaps() {
  const ids = await getSitemapIds();
  return ids.map((id) => ({ id }));
}

export default async function sitemap({ id }) {
  const entries = await getAllEntries();
  const start = id * MAX_URLS_PER_SITEMAP;
  return entries.slice(start, start + MAX_URLS_PER_SITEMAP);
}
