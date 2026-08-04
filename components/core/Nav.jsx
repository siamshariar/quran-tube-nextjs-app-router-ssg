"use client";

import styles from "./Nav.module.css";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import InlineIcon from "./InlineIcon";

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
  quranRadio
} from "../../icons";

import MenuClickModal from "../pages/modal/MenuClickModal";

const pages1 = [
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
    title: "Ruqyah",
    icon: "/icons/ruqya-icon.svg",
    iconOutline: "/icons/ruqya-icon.svg",
    url: "/ruqyah",
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
  }
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

const pages4 = [
  {
    title: "Favorites",
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
          <MenuList pages={pages4} openModal={openModal} />
          <div className={styles.appstitle}>More Apps</div>

          <MenuList pages={pages2} openModal={openModal} />
          {/*<hr className={styles.divider} />*/}
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
            {/*&copy; 2024{" "}*/}
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
              <span className={styles.icon}>
                <InlineIcon icon={p.url === path ? p.icon : p.iconOutline} />
              </span>
              <span className={styles.label}>{p.title}</span>
            </div>
          )}
          {p.linkType == "internal" && (
            <Link href={p.url}>
              <div
                className={classNames(
                  styles.item,
                  p.url === "/"
                      ? (p.url === path || path.includes("home") ? styles.active : "")
                      : p.url === "/taraweeh"
                          ? (p.url === path || path.includes("taraweeh") ? styles.active : "")
                          : (p.url === path ? styles.active : "")
                )}
              >
                <span className={styles.icon}>
                  <InlineIcon icon={p.url === path ? p.icon : p.iconOutline} />
                </span>
                <span className={styles.label}>{p.title}</span>
              </div>
            </Link>
          )}
          {p.linkType == "external" && (
            <a href={p.url} target="_blank" rel="noreferrer">
              <div className={classNames(styles.item)}>
                <span className={styles.icon}>
                  <InlineIcon icon={p.iconOutline} />
                </span>
                <span className={styles.label}>{p.title}</span>
              </div>
            </a>
          )}
        </div>
      ))}
    </div>
  );
};

export default Nav;
