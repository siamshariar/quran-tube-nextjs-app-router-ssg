import jwt from "jwt-simple";
import moment from "moment-timezone";
import { server, constants } from "./config";

// Same slug format used by lib/fetch.js's client-side getContentId: the
// content id is the middle element of the slug's last 3 hyphen-separated
// parts (e.g. "some-title-<idA>-<id>-<idB>").
const getContentIdFromSlug = (slug) => {
  if (!slug || typeof slug !== "string") return null;
  const parts = slug.split("-");
  const lastThreeParts = parts.slice(-3);
  return lastThreeParts[1] || null;
};

// Mirrors lib/fetch.js's ct(), but that one reads navigator.userAgent, which
// doesn't exist in this server-only module. The API only uses this header as
// a basic anti-scraping signature, not to validate a real device, so a fixed
// string is fine here.
const buildAuthToken = () => {
  const timestamp = moment().tz("America/New_York").valueOf();
  const payload = {
    userAgent: "QuranTube-Server-Metadata/1.0",
    timestamp,
    random: Math.floor(Math.random() * 1000000000),
  };
  return jwt.encode(payload, process.env.NEXT_PUBLIC_NP_AS);
};

// Fetches the video behind a share slug so a shared link's og:title/og:image
// show the actual video, not the generic page default. Used from
// generateMetadata, which is why it needs its own server-safe fetch instead
// of lib/fetch.js's getVideosDataByUrl (browser-only via navigator).
export const getVideoShareMeta = async (slug) => {
  const id = getContentIdFromSlug(slug);
  if (!id) return null;

  try {
    const res = await fetch(`${constants.API_URL}/contents/${id}`, {
      headers: { p: buildAuthToken() },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data || !data.ytVideoId || !data.title) return null;

    return {
      title: data.title,
      image: `https://i.ytimg.com/vi/${data.ytVideoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error("getVideoShareMeta failed:", error);
    return null;
  }
};

// Builds a generateMetadata() return value for a ContentPage-backed route:
// falls back to the route's own static title/description/image, or swaps in
// the shared video's title/thumbnail when the URL carries ?v=<slug>.
export const buildContentMetadata = async ({
  searchParams,
  path,
  fallbackTitle,
  description,
  robots,
}) => {
  const slug = searchParams?.v;
  const shareMeta = slug ? await getVideoShareMeta(slug) : null;

  const title = shareMeta ? `${shareMeta.title} | Quran Tube` : fallbackTitle;
  const image = shareMeta
    ? shareMeta.image
    : `${server}/img/logo/default_share.png`;
  const url = `${server}${path}${slug ? `?v=${encodeURIComponent(slug)}` : ""}`;

  return {
    title,
    description,
    ...(robots ? { robots } : {}),
    openGraph: {
      title,
      description,
      url,
      siteName: "Quran.tube",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};
