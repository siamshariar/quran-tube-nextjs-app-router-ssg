import LearnQuran from "../../../components/pages/LearnQuran";
import localizationData from "../../../public/pagemenudata.json";
import { buildContentMetadata } from "../../../lib/videoShareMeta";

export async function generateMetadata({ params, searchParams }) {
  return buildContentMetadata({
    searchParams,
    path: `/learn-quran/${params.id}`,
    fallbackTitle: "Learn Quran | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  });
}

export function generateStaticParams() {
  return localizationData.data.map((locale) => ({ id: locale.attributes.code }));
}

export default function Page() {
  return <LearnQuran />;
}
