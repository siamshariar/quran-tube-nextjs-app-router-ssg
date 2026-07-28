import Favorites from "../../components/pages/Favorites";

export const metadata = {
  title: "Favorites | Quran Tube",
  description: "Your favorited videos on Quran.tube",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Favorites />;
}
