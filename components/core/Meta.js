"use client";

// import Head from "next/head"; // Using Helmet instead of Head
import { useEffect, useState } from "react";
import { server } from "../../lib/config";
import { Helmet } from 'react-helmet';

export default function Meta(props) {
    // react-helmet touches `document` during render, which doesn't exist
    // during Next.js's server-side prerender of this client component.
    // Real crawlable metadata now comes from each route's generateMetadata;
    // Helmet only needs to run once mounted in the browser, for the
    // dynamic per-video title/OG updates while the player modal is open.
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const domain = server || "https://www.quran.tube";
    const commonTitle = "Quran.tube";
    const title = props.title !== "" ? props.title + " | " + commonTitle : "Quran Tube | " + commonTitle;
    const description = "Discover the beauty of Quran recitations through videos with Quran.tube. Whether looking for heartfelt recitations by renowned Reciters, exploring various styles, or seeking Quran translations, Quran.tube has it all.";
    const imageUrl = props.imageUrl || `${domain}/img/logo/default_share.png`;
    const pageUrl = props.url || domain;
    const statusBarColor = (props.statusBarColor !== null || props.statusBarColor !== "") ? props.statusBarColor : "#ffffff";

    if (!mounted) return null;

    return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, uc-fitscreen=yes, viewport-fit=cover"
      />

      <meta name="mobile-wep-app-capable" content="yes" />
      <meta name="apple-mobile-wep-app-capable" content="yes" />

      <meta name="description" content={description} />
      <meta name="author" content="" />
      <meta name="keywords" content="Quran.tube" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

      {/* Android phone */}
      <meta name="theme-color" content={statusBarColor} />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* iOS phone */}
      <meta name="apple-mobile-web-app-title" content="Quran.tube" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content={statusBarColor} />

      {/* Windows phone */}
      <meta name="msapplication-navbutton-color" content={statusBarColor} />
      <meta name="msapplication-TileColor" content={statusBarColor} />
      {/* <meta name="msapplication-TileImage" content="ms-icon-144x144.png" /> */}
      {/* <meta name="msapplication-config" content="browserconfig.xml" /> */}

      {/* Pinned Sites */}
      <meta name="application-name" content="Quran.tube" />
      <meta name="msapplication-tooltip" content="Tooltip Text" />
      <meta name="msapplication-starturl" content="/" />

      {/* Tap highlighting */}
      <meta name="msapplication-tap-highlight" content="no" />

      {/* UC Mobile Browser */}
      <meta name="full-screen" content="yes" />
      <meta name="browsermode" content="application" />

      {/* Disable night mode for this page */}
      <meta name="nightmode" content="disable" />

      {/* Layout mode - content="fitscreen/standard" */}
      <meta name="layoutmode" content="fitscreen" />

      {/* imagemode - show image even in text only mode */}
      <meta name="imagemode" content="force" />

      {/* Orientation */}
      <meta name="screen-orientation" content="portrait" />

      {/* format-detection */}
      <meta name="format-detection" content="telephone=no" />

      {/* meta information for facebook */}
      <meta property="og:title" content={title} key="ogtitle" />
      <meta property="og:url" content={pageUrl} key="ogurl" />
      <meta property="og:image" content={imageUrl} key="ogimage" />
      <meta property="og:type" content={props.type || "website"} key="ogtype" />
      <meta
        property="og:description"
        content={description}
        key="ogdesc"
      />
      <meta property="og:locale" content="" key="oglocale" />
      <meta property="og:site_name" content="Quran.tube/" key="ogsitename" />

      {/* meta information for twitter */}
      <meta name="twitter:card" content="Quran.tube" key="twcard" />
      <meta name="twitter:site" content="@Quran.tube" key="twsite" />
      <meta name="twitter:url" content={pageUrl} key="twurl" />
      <meta name="twitter:title" content={title} key="twtitle" />
      <meta
        name="twitter:description"
        content={description}
        key="twdesc"
      />
      <meta name="twitter:image" content={imageUrl} key="twimage" />

      {/* favicon */}
      {/* Main Link Tags */}
      <link
        href={`${domain}/img/favicon/Favicon.png`}
        rel="icon"
        type="image/png"
        sizes="16x16"
      />
      <link
        href={`${domain}/img/favicon/Favicon.png`}
        rel="icon"
        type="image/png"
        sizes="32x32"
      />
      <link
        href={`${domain}/img/favicon/Favicon.png`}
        rel="icon"
        type="image/png"
        sizes="48x48"
      />

      {/* iOS */}
      <link
        href={`${domain}/img/app/App_Logo_384.png`}
        rel="apple-touch-icon"
      />
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="apple-touch-icon"
        sizes="76x76"
      />
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="apple-touch-icon"
        sizes="120x120"
      />
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="apple-touch-icon"
        sizes="152x152"
      />
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="apple-touch-icon"
        sizes="180x180"
      />

      {/* Startup Image */}
      <link
        href={`${domain}/img/app/App_Logo_384.png`}
        rel="apple-touch-startup-image"
      />

      {/* Pinned Tab */}
      <link href={`${domain}/img/app/App_Logo_192.png`} rel="mask-icon" size="any" color="red" />

      {/* Android */}
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="icon"
        sizes="192x192"
      />
      <link
        href={`${domain}/img/app/App_Logo_192.png`}
        rel="icon"
        sizes="128x128"
      />

      {/* UC Browser */}
      <link
        href={`${domain}/img/favicon/favicon.ico`}
        rel="apple-touch-icon-precomposed"
        sizes="57x57"
      />
      <link
        href={`${domain}/img/favicon/favicon.ico`}
        rel="apple-touch-icon"
        sizes="72x72"
      />

      {/* Others */}
      <link
        href={`${domain}/img/favicon/Favicon.png`}
        rel="shortcut icon"
        type="image/x-icon"
      />

      {/* page title */}
      <title>{title}</title>

      <link rel="manifest" href={`${domain}/manifest.webmanifest`} />
      <script
        async
        src="https://cdn.jsdelivr.net/npm/pwacompat"
        crossOrigin="anonymous"
      ></script>

      {/*Manifest.json*/}
      <link href={`${domain}/manifest.json`} rel="manifest" />

      {/* material icons - Icon Library */}
      {/* <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> */}
      <link
        href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp"
        rel="stylesheet"
      />
    </Helmet>
  );
}
