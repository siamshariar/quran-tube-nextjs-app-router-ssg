import Madinah from "../../components/pages/Madinah";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/madinah",
    fallbackTitle: "Madinah | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <Madinah />;
}
