import styles from "./ChipBar.module.css";
import classNames from "classnames";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {IonIcon, IonLabel, IonRouterLink} from "@ionic/react";
import {next as nextIcon, previous as prevIcon} from "../../icons";
import localizationData from '../../public/pagemenudata.json';
import Link from "next/link";

const ChipBarTaraweeh = ({ activeId, subCatClickHandler, pathname, taraweehPage }) => {
  const locales = localizationData.data;
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (dir) => {
    const maxScrollLeft = contentWidth - containerWidth;
    if (dir === "left") {
      setScrollLeft((prev) => Math.min(prev + 540, maxScrollLeft));
    } else if (dir === "right") {
      setScrollLeft((prev) => Math.max(prev - 540, 0));
    }
  };

  const setWidth = () => {
    if (containerRef.current && contentRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContentWidth(contentRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    setWidth(); // Initial setting of widths
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, []);

  useEffect(() => {
    setWidth();
  }, [locales]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollLeft, containerWidth, contentWidth]);

  const handleItemClick = (id, code) => {
    let firstPathSegment = pathname.split("/")[1] || "/";
    firstPathSegment = id === null && firstPathSegment === "home" ? "/" : firstPathSegment
    firstPathSegment = id !== null && firstPathSegment === "/" ? "/home" : firstPathSegment
    const path = id === null ? firstPathSegment : `${firstPathSegment}/${encodeURIComponent(code)}`;
    subCatClickHandler(id, code); // Call the handler to update activeId or other state
    router.push(`${path}`, undefined, { shallow: true }); // Update URL without page reload
  };

  const getPath = (id, code) => {
    // debugger;
    let firstPathSegment = pathname.split("/")[1] || "/";
    firstPathSegment = id === null && firstPathSegment === "home" ? "/" : firstPathSegment
    firstPathSegment = id !== null && firstPathSegment === "/" ? "/home" : firstPathSegment
    const seg = id === null ? firstPathSegment : `${firstPathSegment}/${encodeURIComponent(code)}`;
    return !seg.split("/")[1] && seg.length > 1 ? seg+"?t=all" : seg;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={containerRef}>
        <ul className={styles.list} ref={contentRef}>
          <IonRouterLink
              routerLink="/taraweeh"
              routerDirection="none"
              detail={false}
              lines="none"
              key={1}
          >
            <li
                className={classNames(styles.item, taraweehPage === "taraweeh" ? styles.active : "")}
            >
              <IonLabel className={styles.label}>All</IonLabel>
            </li>
          </IonRouterLink>
          <IonRouterLink
              routerLink="/taraweeh-maqqa"
              routerDirection="none"
              detail={false}
              lines="none"
              key={1}
          >
            <li
                className={classNames(styles.item, taraweehPage === "taraweeh-maqqa" ? styles.active : "")}
            >
              <IonLabel className={styles.label}>Maqqa</IonLabel>
            </li>
          </IonRouterLink>
          <IonRouterLink
              routerLink="/taraweeh-madinah"
              routerDirection="none"
              detail={false}
              lines="none"
              key={1}
          >
            <li
                className={classNames(styles.item, taraweehPage === "taraweeh-madinah" ? styles.active : "")}
            >
              <IonLabel className={styles.label}>Madinah</IonLabel>
            </li>
          </IonRouterLink>
        </ul>
      </div>
      <div
          className={classNames(
              styles.btn,
              styles.left,
              containerWidth < contentWidth && scrollLeft > 0 ? styles.show : ""
          )}
      >
        <button
          className={styles.btn_icon}
          onClick={() => handleScroll("right")}
        >
          <IonIcon icon={prevIcon} slot="start" className={styles.icon} />
        </button>
      </div>
      <div
        className={classNames(
          styles.btn,
          styles.right,
          containerWidth < contentWidth &&
            scrollLeft < contentWidth - containerWidth
            ? styles.show
            : ""
        )}
      >
        <button
          className={styles.btn_icon}
          onClick={() => handleScroll("left")}
        >
          <IonIcon icon={nextIcon} slot="start" className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default ChipBarTaraweeh;
