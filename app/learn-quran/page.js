import LearnQuran from "../../components/pages/LearnQuran";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/learn-quran",
    fallbackTitle: "Learn Quran | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <LearnQuran />;
}
