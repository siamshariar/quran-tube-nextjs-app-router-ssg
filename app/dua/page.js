import Dua from "../../components/pages/Dua";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/dua",
    fallbackTitle: "Dua | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <Dua />;
}
