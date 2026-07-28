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

export default function sitemap() {
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
