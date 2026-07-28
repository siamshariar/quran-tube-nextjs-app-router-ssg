"use client";

import styles from "./MiniNav.module.css";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { IonIcon, IonLabel, IonList } from "@ionic/react";

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
} from "../../icons";
import MenuClickModal from "../pages/modal/MenuClickModal";

const pages = [
  {
    title: "Home",
    icon: home,
    iconOutline: homeOutline,
    url: "/",
  },
  {
    title: "Explore",
    icon: explore,
    iconOutline: exploreOutline,
    url: "/explore",
  },
  {
    title: "History",
    icon: history,
    iconOutline: historyOutline,
    url: "/history",
  },
  {
    title: "Subscriptions",
    icon: subscription,
    iconOutline: subscriptionOutline,
    url: "/subscriptions",
  },
  {
    title: "Library",
    icon: library,
    iconOutline: libraryOutline,
    url: "/library",
  },
];

const MiniNav = () => {
  const path = usePathname();

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
          // <IonRouterLink //
          //   routerLink={p.url}
          //   key={i}
          // >
          <div className={styles.item} key={i} onClick={openModal}>
            <IonIcon
              icon={p.url === path ? p.icon : p.iconOutline}
              slot="start"
              className={styles.icon}
            />
            <IonLabel className={styles.label}>{p.title}</IonLabel>
          </div>
          // </IonRouterLink>
        ))}
      </IonList>
      <MenuClickModal open={modalOpen} closer={handleModalClose} />
    </div>
  );
};

export default MiniNav;
