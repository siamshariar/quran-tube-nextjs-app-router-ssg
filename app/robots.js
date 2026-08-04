import { server } from "../lib/config";
import { getSitemapIds } from "./sitemap";

export default async function robots() {
  const ids = await getSitemapIds();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/favorites", "/recents", "/search"],
    },
    sitemap: ids.map((id) => `${server}/sitemap/${id}.xml`),
  };
}
