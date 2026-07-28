import Recents from "../../components/pages/Recents";

export const metadata = {
  title: "Recents | Quran Tube",
  description: "Your recently watched videos on Quran.tube",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Recents />;
}
