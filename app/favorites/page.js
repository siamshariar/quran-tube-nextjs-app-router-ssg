import Favorites from "../../components/pages/Favorites";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/favorites",
    fallbackTitle: "Favorites | Quran Tube",
    description: "Your favorited videos on Quran.tube",
    robots: { index: false, follow: false },
  });
}

export default function Page() {
  return <Favorites />;
}
