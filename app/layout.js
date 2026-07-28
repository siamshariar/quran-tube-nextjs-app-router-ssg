import Script from "next/script";

import "tailwindcss/tailwind.css";
import "@ionic/react/css/core.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "../styles/fonts.css";
import "../styles/variables.css";
import "../styles/utils.css";
import "../styles/global.css";

import { server } from "../lib/config";
import { GA_TRACKING_ID } from "../lib/gtag";
import AppShell from "../components/core/AppShell";

export const metadata = {
  metadataBase: new URL(server),
  title: "Quran Tube",
  description:
    "Discover the beauty of Quran recitations through videos with Quran.tube. Whether looking for heartfelt recitations by renowned Reciters, exploring various styles, or seeking Quran translations, Quran.tube has it all.",
  icons: {
    icon: [
      { url: "/img/favicon/favicon.ico", sizes: "16x16" },
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
