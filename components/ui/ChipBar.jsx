"use client";

import styles from "./ChipBar.module.css";
import classNames from "classnames";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {IonIcon, IonLabel} from "@ionic/react";
import {next as nextIcon, previous as prevIcon} from "../../icons";
import localizationData from '../../public/pagemenudata.json';
import Link from "next/link";

const ChipBar = ({ activeId, subCatClickHandler, pathname }) => {
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

  const buildPath = (id, code) => {
    let firstPathSegment = pathname.split("/")[1] || "";
    firstPathSegment = id === null && firstPathSegment === "home" ? "" : firstPathSegment;
    firstPathSegment = id !== null && firstPathSegment === "" ? "home" : firstPathSegment;
    if (id === null) {
      return firstPathSegment ? `/${firstPathSegment}` : "/";
    }
    return `/${firstPathSegment}/${encodeURIComponent(code)}`;
  };

  const handleItemClick = (id, code) => {
    const path = buildPath(id, code);
    subCatClickHandler(id, code); // Call the handler to update activeId or other state
    router.push(path); // Update URL without page reload
  };

  const getPath = (id, code) => {
    const seg = buildPath(id, code);
    return seg !== "/" && !seg.split("/")[2] ? seg + "?t=all" : seg;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={containerRef}>
        <ul className={styles.list} ref={contentRef}>
          <Link href={getPath(null, 'all')}>
            <li
              className={classNames(styles.item, activeId ? "" : styles.active)}
            >
              <IonLabel className={styles.label}>All</IonLabel>
            </li>
          </Link>
          {locales.map((t, i) => (
            <Link key={i} href={getPath(t.id, t.attributes.code)}>
              <li
                className={classNames(
                  styles.item,
                  t.id === activeId ? styles.active : ""
                )}
              >
                <span className={styles.label}>{t.attributes.name}</span>
              </li>
            </Link>
          ))}
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

export default ChipBar;
