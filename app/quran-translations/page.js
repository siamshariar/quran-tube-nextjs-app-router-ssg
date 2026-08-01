import QuranTranslations from "../../components/pages/QuranTranslations";
import { buildContentMetadata } from "../../lib/videoShareMeta";

export async function generateMetadata({ searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: "/quran-translations",
    fallbackTitle: "Quran Translations | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export default function Page() {
  return <QuranTranslations />;
}
