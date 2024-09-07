import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Layout from "./core/Layout";
// import MiniPlayer from "./player/MiniPlayer";
// import Popup from "./utils/PopupPrimary";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Channels from "./pages/channels";
import ChannelHome from "./pages/channels/Home";
import ChannelVideos from "./pages/channels/Videos";
import ChannelPlaylists from "./pages/channels/Playlists";
import ChannelAbout from "./pages/channels/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import QuranTranslations from "./pages/QuranTranslations";
import LearnQuran from "./pages/LearnQuran";
import More from "./pages/More";

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
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" style={{ height: "100%" }}>
          <Layout>
            <IonRouterOutlet id="main" style={{ position: "relative" }}>
              <Route exact path="/" render={() => <Home />} />
              <Route
                exact
                path="/quran-translations"
                render={() => <QuranTranslations />}
              />
              <Route exact path="/learn-quran" render={() => <LearnQuran />} />
              <Route exact path="/watch/:id" component={Watch} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/channels" component={Channels} />
              <Route
                exact
                path="/channels/:id/home"
                render={(props) => <ChannelHome id={props.match.params.id} />}
              />
              <Route
                exact
                path="/channels/:id/videos"
                render={(props) => <ChannelVideos id={props.match.params.id} />}
              />
              <Route
                exact
                path="/channels/:id/playlists"
                render={(props) => (
                  <ChannelPlaylists id={props.match.params.id} />
                )}
              />
              <Route
                exact
                path="/channels/:id/about"
                render={(props) => <ChannelAbout id={props.match.params.id} />}
              />
              <Route
                exact
                path="/channels/:id"
                render={(props) => (
                  <Redirect to={`/channels/${props.match.params.id}/home`} />
                )}
              />
              <Route path="/privacy-policy" exact component={PrivacyPolicy} />
              <Route path="/more" exact component={More} />
            </IonRouterOutlet>
          </Layout>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
