import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";
import Layout from "./core/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import About from "./pages/About";
import Offline from "./pages/Offline";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import QuranTranslations from "./pages/QuranTranslations";
import LearnQuran from "./pages/LearnQuran";
import Dua from "./pages/Dua";
import More from "./pages/More";
import Ruqyah from "./pages/Ruqyah";
import Maqqa from "./pages/Maqqa";
import Madinah from "./pages/Madinah";
import Shorts from "./pages/Shorts";
import React, { useEffect } from "react";
import {isMobile, isTablet} from 'react-device-detect';
import { useRouter } from "next/router";
import TestPage from "./pages/TestPage";

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addListener(async (status) => {
    try {
      await StatusBar.setStyle({
        style: status.matches ? Style.Dark : Style.Light,
      });
    } catch {}
  });

const App = () => {
  const pathname = window.location.pathname;

  useEffect(() => {
    if (isMobile || isTablet) {
      // DISABLED RIGHT CLICK/TAP ON MOBILE
      window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
      }, false);
      // DISABLED RIGHT CLICK/TAP ON MOBILE

      // TODO: Temp fix - handle mobile back button
      // window.addEventListener('load', function() {
      //   window.history.pushState({}, '')
      // })
      //
      // window.addEventListener('popstate', function() {
      //   window.history.pushState({}, '')
      // })
      // TODO: Temp fix - handle mobile back button
    }
  },[])

  const router = useRouter();
  // Handle browser back button for list pages where exists categories path, oy cause loop in the mobile app
  useEffect(() => {
    if (isMobile || isTablet) {
      let firstPathSegment = pathname.split("/")[1] || "/";
      const handlePopState = () => {
        if (firstPathSegment === "/") {
          window.history.go(-2)
          router.push("/")
        } else {
          router.push("/")
        }
        // else if(["dua", "learn-quran", "maqqa", "madinah", "about"].includes(firstPathSegment)) {
        //   router.push("/more")
        // }
      };
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [router]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" style={{ height: "100%" }}>
          <Layout>
            <IonRouterOutlet id="main" style={{ position: "relative" }}>
              <Route exact path="/" render={() => <Home />} />
            
              <Route exact path="/home" render={() => <Home />} />
              <Route exact path="/home/:id" render={props => <Home {...props} />} />
              <Route
                exact
                path="/quran-translations"
                render={() => <QuranTranslations />}
              />
              <Route
                exact
                path="/quran-translations/:id"
                render={props => <QuranTranslations {...props} />}
              />
              <Route exact path="/learn-quran" render={() => <LearnQuran />} />
              <Route 
                exact 
                path="/learn-quran/:id" 
                render={props => <LearnQuran {...props} />} />
              <Route exact path="/dua" render={() => <Dua />} />
              <Route exact path="/ruqyah" render={() => <Ruqyah />} />
              <Route exact path="/maqqa" render={() => <Maqqa />} />
              <Route exact path="/madinah" render={() => <Madinah />} />
              <Route exact path="/shorts" render={() => <Shorts />} />
              <Route exact path="/search" component={Search} />

              <Route path="/privacy-policy" exact component={PrivacyPolicy} />
              <Route path="/more" exact component={More} />
              <Route path="/about" exact component={About} />
              <Route path="/_offline" exact component={Offline} />

              {/*<Route exact path="/test-page" render={() => <TestPage />} />*/}
              {/*<Route exact path="/test-page/:id" render={props => <TestPage {...props} />} />*/}
            </IonRouterOutlet>
          </Layout>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
