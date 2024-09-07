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
    icon: home,
    iconOutline: homeOutline,
    url: "/",
    linkType: "internal",
  },
  {
    title: "Translations",
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
                <div className={styles.inner}>
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
