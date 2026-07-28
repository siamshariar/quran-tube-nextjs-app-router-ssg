import Search from "../../components/pages/Search";

export const metadata = {
  title: "Search | Quran Tube",
  description:
    "Discover the beauty of Quran recitations through videos with Quran.tube",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Search />;
}
