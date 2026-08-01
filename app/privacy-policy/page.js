import PrivacyPolicy from "../../components/pages/PrivacyPolicy";
import { server } from "../../lib/config";

const shareImage = `${server}/img/logo/default_share.png`;

export const metadata = {
  title: "Privacy Policy | Quran Tube",
  description: "Privacy Policy",
  openGraph: {
    title: "Privacy Policy | Quran Tube",
    description: "Privacy Policy",
    images: [{ url: shareImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Quran Tube",
    description: "Privacy Policy",
    images: [shareImage],
  },
};

export default function Page() {
  return <PrivacyPolicy />;
}
