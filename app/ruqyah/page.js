import Ruqyah from "../../components/pages/Ruqyah";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/ruqyah",
    fallbackTitle: "Ruqyah | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <Ruqyah />;
}
