import Offline from "../../components/pages/Offline";

export const metadata = {
  title: "Quran Tube",
  description:
    "Discover the beauty of Quran recitations through videos with Quran.tube",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Offline />;
}
