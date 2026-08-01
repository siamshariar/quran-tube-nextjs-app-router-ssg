import More from "../../components/pages/More";
import { server } from "../../lib/config";

const shareImage = `${server}/img/logo/default_share.png`;

export const metadata = {
  title: "More | Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  openGraph: {
    title: "More | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [{ url: shareImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "More | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [shareImage],
  },
};

export default function Page() {
  return <More />;
}
