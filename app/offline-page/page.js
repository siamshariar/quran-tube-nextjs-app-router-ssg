import Offline from "../../components/pages/Offline";
import { server } from "../../lib/config";

const shareImage = `${server}/img/logo/default_share.png`;

export const metadata = {
  title: "Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [{ url: shareImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [shareImage],
  },
};

export default function Page() {
  return <Offline />;
}
