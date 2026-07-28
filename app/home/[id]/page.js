import Home from "../../../components/pages/Home";
import localizationData from "../../../public/pagemenudata.json";

export const metadata = {
  title: "Quran Tube",
  description:
    "Discover the beauty of Quran recitations through videos with Quran.tube",
};

export function generateStaticParams() {
  return localizationData.data.map((locale) => ({ id: locale.attributes.code }));
}

export default function Page() {
  return <Home />;
}
