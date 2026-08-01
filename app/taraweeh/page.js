import Taraweeh from "../../components/pages/Taraweeh";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/taraweeh",
    fallbackTitle: "Taraweeh | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <Taraweeh />;
}
