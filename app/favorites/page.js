import Favorites from "../../components/pages/Favorites";

export const metadata = {
  title: "Favorites | Quran Tube",
  description: "Your favorited videos on Quran.tube",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Favorites | Quran Tube",
    description: "Your favorited videos on Quran.tube",
  },
  twitter: {
    card: "summary_large_image",
    title: "Favorites | Quran Tube",
    description: "Your favorited videos on Quran.tube",
  },
};

export default function Page() {
  return <Favorites />;
}
