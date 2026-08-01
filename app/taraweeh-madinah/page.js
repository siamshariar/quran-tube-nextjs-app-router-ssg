import TaraweehMadinah from "../../components/pages/TaraweehMadinah";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/taraweeh-madinah",
    fallbackTitle: "Madinah Taraweeh | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <TaraweehMadinah />;
}
