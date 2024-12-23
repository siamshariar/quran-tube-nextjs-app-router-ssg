import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import classNames from "classnames";
import { UIStore, PopupStore } from "../../store";
import Header from "./Header";
import Nav from "./Nav";
import MiniNav from "./MiniNav";
import SideNav from "./SideNav";
import BottomNav from "./BottomNav";
import Player from "../player";
import Popup from "../utils/PopupPrimary";
import RelatedVideos from "../ui/RelatedVideos";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const isMini = UIStore.useState((s) => s.isMiniNav);
  const wrapper = useRef(null);
  const container = useRef(null);

  const location = useLocation();
  const [path, setPath] = useState("/");
  const [type, setType] = useState(null);

  const pathname = window.location.pathname;
  // Scroll to top on path change
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = 0; // Scroll the container to the top
    }
  }, [pathname]);

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  useEffect(() => {
    if (path === "/") {
      setType("type1");
    } else if (path.match("/watch")) {
      setType("type2");
    }
    // else if (path.match("/search")) {
    //   setType("type3");
    // }
    // console.log(path);
  }, [path]);

  // mobile header scroll effect
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  // const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    const instance = container.current;
    const setScroll = () => {
      setScrollTop(instance.scrollTop);
    };
    instance.addEventListener("scroll", setScroll);
    return () => {
      instance.removeEventListener("scroll", setScroll);
    };
  }, []);

  const [sidenavActive, setSidenavActive] = useState(false);

  const handleSidenav = (active) => {
    setSidenavActive(active);
  };

  // disable scroll but keep scrollbar visible
  const popupOpen = PopupStore.useState((s) => s.open);

  useEffect(() => {
    const instance = container.current; // declare first otherwise remove listener throw error
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
    if (popupOpen) {
      instance.addEventListener("wheel", preventScroll);
    }
    return () => {
      instance.removeEventListener("wheel", preventScroll);
    };
  }, [popupOpen]);

  useEffect(() => {
    if (type !== "type2" && scrollTop > lastScrollTop) {
      if (scrollTop > 98) {
        wrapper.current.classList.remove("scroll_up");
        wrapper.current.classList.add("scroll_down");
      }
    } else {
      wrapper.current.classList.remove("scroll_down");
      wrapper.current.classList.add("scroll_up");
    }
    setLastScrollTop(scrollTop);
  }, [scrollTop]);

  return (
    <IonPage>
      <Popup />
      <div className={classNames(styles.wrapper, styles[type])} ref={wrapper}>
        <div className={classNames(styles.topbar, "header")}>
          <Header
            layout={type === "type2" ? "layout2" : null}
            controller={type === "type2" ? () => handleSidenav(true) : null}
          />
        </div>

        {(type === "type1" || type === "type3") && (
          <>
            <div
              className={classNames(styles.sidebar, isMini ? styles.hide : "")}
            >
              <Nav />
            </div>
            <div
              className={classNames(
                styles.sidebar,
                styles.mini,
                isMini ? "" : styles.hide
              )}
            >
              <MiniNav />
            </div>
          </>
        )}

        {type === "type2" && (
          <div className={styles.sidebar}>
            <SideNav
              active={sidenavActive}
              controller={() => handleSidenav(false)}
            />
          </div>
        )}
        {type === "type1" && (
          <div className={styles.bottombar}>
            <BottomNav />
          </div>
        )}

        <div
          className={classNames(
            styles.container,
            isMini ? styles.mini : "",
            path == "/learn-quran-virtuoso" ? styles.virtuoso : ""
          )}
          ref={container}
        >
          <div className={styles.content}>
            <div className={styles.primary}>
              <div className={styles.player}>
                <Player layout={type} />
              </div>
              <div className={styles.page}>{children}</div>
            </div>

            <div className={styles.secondary}>
              {type === "type2" && <RelatedVideos />}
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Layout;
