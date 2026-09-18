import { NextResponse } from "next/server";
import fallbackData from "../../../data/fallback-videos.json";

// Serves the same shape as the external contents list API
// (api.deeniinfotech.com/api/contents), but from a static local JSON file.
// Used only as a fallback when that external API is unreachable -- see
// getVideosDataByUrl in lib/fetch.js. There is no real pagination cursor
// here, so `c` is always null to stop the infinite-scroll loadMore loop
// after this single page.
export async function GET() {
  return NextResponse.json({
    data: fallbackData.data,
    meta: { pagination: { c: null } },
  });
}
