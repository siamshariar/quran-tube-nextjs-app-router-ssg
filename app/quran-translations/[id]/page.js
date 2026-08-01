import QuranTranslations from "../../../components/pages/QuranTranslations";
import localizationData from "../../../public/pagemenudata.json";
import { buildContentMetadata } from "../../../lib/videoShareMeta";

export async function generateMetadata({ params, searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: `/quran-translations/${params.id}`,
    fallbackTitle: "Quran Translations | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export function generateStaticParams() {
  return localizationData.data.map((locale) => ({ id: locale.attributes.code }));
}

export default function Page() {
  return <QuranTranslations />;
}
