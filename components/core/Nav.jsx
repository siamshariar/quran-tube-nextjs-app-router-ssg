import styles from "./Nav.module.css";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { IonIcon, IonLabel, IonRouterLink } from "@ionic/react";

import {
  home,
  homeOutline,
  explore,
  exploreOutline,
  subscription,
  subscriptionOutline,
  library,
  libraryOutline,
  history,
  historyOutline,
  watch,
  watchOutline,
  like,
  likeOutline,
  settingsOutline,
  captivePortal,
  historyEdu,
  radioIcon,
  forestIcon,
} from "../../icons";
import MenuClickModal from "../pages/modal/MenuClickModal";

const pages1 = [
  {
    title: "Home",
    icon: home,
    iconOutline: homeOutline,
    url: "/",
    linkType: "internal",
  },
  {
    title: "Quran Translations",
    icon: captivePortal,
    iconOutline: captivePortal,
    url: "/quran-translations",
    linkType: "internal",
  },
  {
    title: "Learn Quran",
    icon: historyEdu,
    iconOutline: historyEdu,
    url: "/learn-quran",
    linkType: "internal",
  },
  {
    title: "Salah Recitations",
    icon: library,
    iconOutline: libraryOutline,
    url: "/subscriptions",
    linkType: "inProgress",
  },
  // {
  //   title: "Recitations in Makkah",
  //   icon: library,
  //   iconOutline: libraryOutline,
  //   url: "/subscriptions",
  // linkType: "internal"
  // },
  // {
  //   title: "Recitations in Madinah",
  //   icon: library,
  //   iconOutline: libraryOutline,
  //   url: "/subscriptions",
  // linkType: "internal"
  // },
  {
    title: "Quran with Nature",
    icon: library,
    iconOutline: forestIcon,
    url: "/subscriptions",
    linkType: "inProgress",
  },
];

const pages2 = [
  {
    title: "Quran.radio",
    icon: library,
    iconOutline: radioIcon,
    url: "https://www.quran.radio",
    linkType: "external",
  },
  {
    title: "DeeniTube",
    icon: library,
    iconOutline: libraryOutline,
    url: "https://www.deeniinfotech.com/develop-islamic-applications",
    linkType: "external",
  },
];

const pages3 = [
  {
    title: "Settings",
    icon: settingsOutline,
    iconOutline: settingsOutline,
    url: "/settings",
    linkType: "inProgress",
  },
  {
    title: "Library",
    icon: library,
    iconOutline: libraryOutline,
    url: "/library",
    linkType: "inProgress",
  },
];

const Nav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <MenuList pages={pages1} openModal={openModal} />
          <hr className={styles.divider} />

          {/*<MenuList pages={pages2} openModal={openModal} />*/}
          {/*<hr className={styles.divider} />*/}

          {/*<MenuList pages={pages3} openModal={openModal} />*/}
          {/*<hr className={styles.divider} />*/}

          <div className={styles.title}>More Apps</div>

          <MenuList pages={pages2} openModal={openModal} />
          <hr className={styles.divider} />
        </div>
        <div className={styles.footer}>
          {/* <div className={styles.links}>
              <a href="#">About</a>
              <a href="#">Press</a>
              <a href="#">Contact us</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div> */}
          {/* <div className={styles.links}>
              <a href="#">About</a>
              <a href="#">Press</a>
              <a href="#">Contact us</a>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
            </div> */}
          <p className={styles.copyright}>
            &copy; 2024{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://deeniinfotech.com/"
              style={{ color: `#2d898c` }}
            >
              Deeni Info Tech
            </a>
          </p>
        </div>
      </div>
      <MenuClickModal open={modalOpen} closer={handleModalClose} />
    </>
  );
};

const MenuList = ({ pages, openModal }) => {
  const location = useLocation();
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  return (
    <div className={styles.list}>
      {pages.map((p, i) => (
        <>
          {p.linkType == "inProgress" && (
            <div
              key={i}
              className={classNames(
                styles.item,
                p.url === path ? styles.active : ""
              )}
              onClick={openModal}
            >
              <IonIcon
                icon={p.url === path ? p.icon : p.iconOutline}
                slot="start"
                className={styles.icon}
              />
              <IonLabel className={styles.label}>{p.title}</IonLabel>
            </div>
          )}
          {p.linkType == "internal" && (
            <IonRouterLink
              routerLink={p.url}
              routerDirection="none"
              detail={false}
              lines="none"
              key={i}
            >
              <div
                key={i}
                className={classNames(
                  styles.item,
                  p.url === path ? styles.active : ""
                )}
              >
                <IonIcon
                  icon={p.url === path ? p.icon : p.iconOutline}
                  slot="start"
                  className={styles.icon}
                />
                <IonLabel className={styles.label}>{p.title}</IonLabel>
              </div>
            </IonRouterLink>
          )}
          {p.linkType == "external" && (
            <a href={p.url} target="_blank" rel="noreferrer">
              <div key={i} className={classNames(styles.item)}>
                <IonIcon
                  icon={p.iconOutline}
                  slot="start"
                  className={styles.icon}
                />
                <IonLabel className={styles.label}>{p.title}</IonLabel>
              </div>
            </a>
          )}
        </>
      ))}
    </div>
  );
};

export default Nav;
