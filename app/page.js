import Home from "../components/pages/Home";
import { buildContentMetadata } from "../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/",
    fallbackTitle: "Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <Home />;
}
