import Search from "../../components/pages/Search";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/search",
    fallbackTitle: "Search | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    robots: { index: false, follow: false },
  });
}

export default function Page() {
  return <Search />;
}
