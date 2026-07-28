import { server } from "../lib/config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/favorites", "/recents", "/search"],
    },
    sitemap: `${server}/sitemap.xml`,
  };
}
