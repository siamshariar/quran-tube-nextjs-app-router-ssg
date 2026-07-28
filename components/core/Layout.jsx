"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { IonPage } from "@ionic/react";
import classNames from "classnames";
import { UIStore, PopupStore } from "../../store";
import Header from "./Header";
import Nav from "./Nav";
import MiniNav from "./MiniNav";
import BottomNav from "./BottomNav";
import Popup from "../utils/PopupPrimary";
import styles from "./Layout.module.css";

const Layout = ({ children }) => {
  const isMini = UIStore.useState((s) => s.isMiniNav);
  const wrapper = useRef(null);
  const container = useRef(null);
  const pathname = usePathname();

  // Scroll to top on path change
  useEffect(() => {
    if (container.current) {
      container.current.scrollTop = 0; // Scroll the container to the top
    }
  }, [pathname]);

  // mobile header scroll effect
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

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
    if (scrollTop > lastScrollTop) {
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
      <div className={classNames(styles.wrapper, styles.type1)} ref={wrapper}>
        <div className={classNames(styles.topbar, "header")}>
          <Header />
        </div>

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

        <div className={styles.bottombar}>
          <BottomNav />
        </div>

        <div
          className={classNames(styles.container, isMini ? styles.mini : "")}
          ref={container}
        >
          <div className={styles.content}>
            <div className={styles.primary}>
              <div className={styles.page}>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Layout;
