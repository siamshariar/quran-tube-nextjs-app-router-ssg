"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isMobile, isTablet } from "react-device-detect";
import { IonApp, IonSplitPane } from "@ionic/react";
import { StatusBar, Style } from "@capacitor/status-bar";
import Layout from "./Layout";
import { loadFavoriteVideos } from "../../store/FavoriteVideosStore";

if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addListener(async (status) => {
      try {
        await StatusBar.setStyle({
          style: status.matches ? Style.Dark : Style.Light,
        });
      } catch {}
    });
}

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadFavoriteVideos();
  }, []);

  useEffect(() => {
    if (isMobile || isTablet) {
      // DISABLED RIGHT CLICK/TAP ON MOBILE
      window.addEventListener(
        "contextmenu",
        function (e) {
          e.preventDefault();
        },
        false
      );
    }
  }, []);

  // Handle browser back button for list pages where exists categories path, oy cause loop in the mobile app
  useEffect(() => {
    if (isMobile || isTablet) {
      let firstPathSegment = pathname.split("/")[1] || "/";
      const handlePopState = () => {
        if (firstPathSegment === "/") {
          window.history.go(-2);
          router.push("/");
        } else {
          router.push("/");
        }
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [pathname, router]);

  return (
    <IonApp>
      <IonSplitPane contentId="main" style={{ height: "100%" }}>
        <Layout>{children}</Layout>
      </IonSplitPane>
    </IonApp>
  );
};

export default AppShell;
