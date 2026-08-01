import About from "../../components/pages/About";
import { server } from "../../lib/config";

const shareImage = `${server}/img/logo/default_share.png`;

export const metadata = {
  title: "About | Quran Tube",
  description: "Discover the beauty of Quran recitations through videos with Quran.tube",
  openGraph: {
    title: "About | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [{ url: shareImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Quran Tube",
    description: "Discover the beauty of Quran recitations through videos with Quran.tube",
    images: [shareImage],
  },
};

export default function Page() {
  return <About />;
}
