import Recents from "../../components/pages/Recents";

export const metadata = {
  title: "Recents | Quran Tube",
  description: "Your recently watched videos on Quran.tube",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Recents | Quran Tube",
    description: "Your recently watched videos on Quran.tube",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recents | Quran Tube",
    description: "Your recently watched videos on Quran.tube",
  },
};

export default function Page() {
  return <Recents />;
}
