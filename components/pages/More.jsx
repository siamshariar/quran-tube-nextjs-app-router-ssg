"use client";

import styles from "./More.module.css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { IonIcon, IonLabel } from "@ionic/react";

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
  prayingIcon,
  historyEdu,
  kaabaIcon,
  madinahIcon,
  ruqyahIcon,
  shortsIcon,
  radioIcon,
  forestIcon,
  quranRadio, mobileApp, share, donate
} from "../../icons";

import MenuClickModal from "../pages/modal/MenuClickModal";
import {informationCircleOutline} from "ionicons/icons";

const pages1 = [
  {
    title: "Ruqyah",
    icon: "/icons/ruqya-icon.svg",
    iconOutline: "/icons/ruqya-icon.svg",
    url: "/ruqyah",
    linkType: "internal",
  },
  {
    title: "Dua",
    icon: "/icons/dua-icon.svg",
    iconOutline: "/icons/dua-icon.svg",
    url: "/dua",
    linkType: "internal",
  },
  {
    title: "Learn Quran",
    icon: "/icons/learning-quran-icon.svg",
    iconOutline: "/icons/learning-quran-icon.svg",
    url: "/learn-quran",
    linkType: "internal",
  },
  {
    title: "Maqqa",
    icon: "/icons/kaaba-icon.svg",
    iconOutline: "/icons/kaaba-icon.svg",
    url: "/maqqa",
    linkType: "internal",
  },
  {
    title: "Madinah",
    icon: "/icons/medina-icon.svg",
    iconOutline: "/icons/medina-icon.svg",
    url: "/madinah",
    linkType: "internal",
  },
  {
    title: "Favorite",
    icon: "/icons/favourites-icon.svg",
    iconOutline: "/icons/favourites-icon.svg",
    url: "/favorites",
    linkType: "internal",
  },
  {
    title: "Recents",
    icon: "/icons/recents-icon.svg",
    iconOutline: "/icons/recents-icon.svg",
    url: "/recents",
    linkType: "internal",
  }
  // {
  //   title: "Salah Recitations",
  //   icon: library,
  //   iconOutline: libraryOutline,
  //   url: "/subscriptions",
  //   linkType: "inProgress",
  // },
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
  // {
  //   title: "Quran with Nature",
  //   icon: "/icons/quran-with-nature-icon.svg",
  //   iconOutline: "/icons/quran-with-nature-icon.svg",
  //   url: "/subscriptions",
  //   linkType: "inProgress",
  // },
  
];

const pages2 = [
  {
    title: "Quran.radio",
    icon: "/icons/quran-radio-icon.svg",
    iconOutline: "/icons/quran-radio-icon.svg",
    url: "https://www.deeniinfotech.com/p/quran-radio#apps",
    linkType: "external",
  },
  // {
  //   title: "DeeniTube",
  //   icon: "/icons/deeni-tube-icon.svg",
  //   iconOutline: "/icons/deeni-tube-icon.svg",
  //   url: "https://www.deeniinfotech.com/develop-islamic-applications",
  //   linkType: "external",
  // },
];

const More = () => {
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const appLink = isIOS ? "https://apps.apple.com/vn/app/quran-tube/id6738865112" : "https://play.google.com/store/apps/details?id=com.deeniinfotech.qurantube"

  const pages3 = [
    {
      title: "About",
      icon: informationCircleOutline,
      iconOutline: informationCircleOutline,
      url: "/about",
      linkType: "internal",
    },
    {
      title: "Rate & Review App",
      icon: mobileApp,
      iconOutline: mobileApp,
      url: appLink,
      linkType: "external",
    },
    {
      title: "Share App",
      icon: share,
      iconOutline: share,
      url: "https://www.deeniinfotech.com/p/quran-tube#apps", // TODO: Share dit web app link
      linkType: "share",
    },
    {
      title: "Donate",
      icon: donate,
      iconOutline: donate,
      url: "https://www.deeniinfotech.com/donate#donation-form",
      linkType: "external",
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <MenuList pages={pages1} openModal={openModal} />
          <hr className={styles.divider} />

          {/*<MenuList pages={pages2} openModal={openModal} />*/}
          {/*<hr className={styles.divider} />*/}

          <MenuList pages={pages3} openModal={openModal} />
          <hr className={styles.divider} />

          <div className={styles.appstitle}>More Apps</div>

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
            Powered By - {" "}
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
  const path = usePathname();

  return (
    <div className={styles.list}>
      {pages.map((p, i) => (
        <div key={i}>
          {p.linkType == "inProgress" && (
            <div
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
            <Link href={p.url}>
              <div
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
            </Link>
          )}
          {p.linkType == "external" && (
            <a href={p.url} target="_blank" rel="noreferrer">
              <div className={classNames(styles.item)}>
                <IonIcon
                  icon={p.iconOutline}
                  slot="start"
                  className={styles.icon}
                />
                <IonLabel className={styles.label}>{p.title}</IonLabel>
              </div>
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default More;
