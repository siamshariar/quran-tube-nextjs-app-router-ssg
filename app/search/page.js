import Search from "../../components/pages/Search";

export const metadata = {
  title: "Search | Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Search | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
};

export default function Page() {
  return <Search />;
}
