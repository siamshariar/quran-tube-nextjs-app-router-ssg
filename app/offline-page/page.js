import Offline from "../../components/pages/Offline";

export const metadata = {
  title: "Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  },
};

export default function Page() {
  return <Offline />;
}
