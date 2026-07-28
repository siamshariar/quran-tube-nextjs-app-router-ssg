import QuranTranslations from "../../../components/pages/QuranTranslations";
import localizationData from "../../../public/pagemenudata.json";

export const metadata = {
  title: "Quran Translations | Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  openGraph: {
    title: "Quran Translations | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Translations | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
};

export function generateStaticParams() {
  return localizationData.data.map((locale) => ({ id: locale.attributes.code }));
}

export default function Page() {
  return <QuranTranslations />;
}
