import styles from "./BottomNav.module.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { IonIcon, IonRouterLink, IonLabel, IonList } from "@ionic/react";
import classNames from "classnames";
import {
  home,
  homeOutline,
  explore,
  exploreOutline,
  subscription,
  subscriptionOutline,
  library,
  libraryOutline,
  ellipsisHorizontal,
  captivePortal,
  historyEdu,
} from "../../icons";
import MenuClickModal from "../pages/modal/MenuClickModal";

const pages = [
  {
    title: "Home",
    icon: "/icons/home-icon.svg",
    iconOutline: "/icons/home-icon.svg",
    url: "/",
    linkType: "internal",
  },
  {
    title: "Shorts",
    icon: "/icons/shorts-icon.svg",
    iconOutline: "/icons/shorts-icon.svg",
    url: "/shorts",
    linkType: "internal",
  },
  {
    title: "Taraweeh",
    icon: "/icons/taraweeh.svg",
    iconOutline: "/icons/taraweeh.svg",
    url: "/taraweeh",
    linkType: "internal",
  },
  {
    title: "Translations",
    icon: "/icons/translate-icon.svg",
    iconOutline: "/icons/translate-icon.svg",
    url: "/quran-translations",
    linkType: "internal",
  },
  {
    title: "More",
    icon: ellipsisHorizontal,
    iconOutline: ellipsisHorizontal,
    url: "/more",
    linkType: "internal",
  },
];

const BottomNav = () => {
  const location = useLocation();
  const [path, setPath] = useState("/");

  useEffect(() => {
    setPath(location.pathname);
  }, [location]);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className={styles.wrapper}>
      <IonList className={styles.list}>
        {pages.map((p, i) => (
          // <IonRouterLink
          //   routerLink={p.url}
          //   routerDirection="none"
          //   detail={false}
          //   lines="none"
          //   key={i}
          //   className={styles.item}
          // >
          //   {/* <div routerLink={p.url} key={i} > */}
          //   <div className={styles.inner}>
          //     <IonIcon
          //       icon={p.url === path ? p.icon : p.iconOutline}
          //       slot="start"
          //       className={styles.icon}
          //     />
          //     <IonLabel className={styles.label}>{p.title}</IonLabel>
          //   </div>
          //   {/* </div> */}
          // </IonRouterLink>

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
                <div className={styles.inner}>
                  <IonIcon
                    icon={p.url === path ? p.icon : p.iconOutline}
                    slot="start"
                    className={styles.icon}
                  />
                  <IonLabel className={styles.label}>{p.title}</IonLabel>
                </div>
              </div>
            )}
            {p.linkType == "internal" && (
                <IonRouterLink
                    routerLink={p.url}
                    routerDirection="none"
                    detail={false}
                    lines="none"
                    key={i}
                    className={styles.item}
                >
                  <div
                      className={classNames(
                          styles.inner,
                          p.url === "/"
                              ? (p.url === path || path.includes("home") ? styles.active : "")
                              : p.url === "/taraweeh"
                                  ? (p.url === path || path.includes("taraweeh") ? styles.active : "")
                                  : (p.url === path ? styles.active : "")
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
          </>
        ))}
      </IonList>
      <MenuClickModal open={modalOpen} closer={handleModalClose} />
    </div>
  );
};

export default BottomNav;
