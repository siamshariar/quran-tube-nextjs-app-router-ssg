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

const defaultDescription =
  "Discover the beauty of Quran recitations through videos with Quran.tube. Whether looking for heartfelt recitations by renowned Reciters, exploring various styles, or seeking Quran translations, Quran.tube has it all.";

export const metadata = {
  metadataBase: new URL(server),
  title: "Quran Tube",
  description: defaultDescription,
  icons: {
    icon: [
      { url: "/img/favicon/favicon.ico", sizes: "16x16" },
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16" },
    ],
  },
  openGraph: {
    title: "Quran Tube",
    description: defaultDescription,
    url: server,
    siteName: "Quran.tube",
    images: [{ url: "/img/logo/default_share.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quran Tube",
    description: defaultDescription,
    images: ["/img/logo/default_share.png"],
  },
};

// The app is installed to the home screen as a PWA and must behave like a
// native app: no pinch-zoom, no double-tap-zoom, no accidental zoom that the
// user then can't reset (there's no browser chrome to reset it from).
//
// `maximumScale: 1` + `userScalable: false` is what the app shipped with
// before the App Router migration; the migration dropped it, which is what
// re-enabled zooming on the home-screen app. Keep it here, in the server-
// rendered viewport export, so it applies on first paint -- a client-side
// meta tag (react-helmet) races the first render and iOS may have already
// locked in the parsed viewport by then.
//
// Matches Quran.radio, which keeps the same directives.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
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
