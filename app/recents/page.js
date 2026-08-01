import Recents from "../../components/pages/Recents";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/recents",
    fallbackTitle: "Recents | Quran Tube",
    description: "Your recently watched videos on Quran.tube",
    robots: { index: false, follow: false },
  });
}

export default function Page() {
  return <Recents />;
}
