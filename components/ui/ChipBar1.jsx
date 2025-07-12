import styles from "./ChipBar.module.css";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { IonIcon, IonLabel } from "@ionic/react";
import { exploreOutline, previous as prevIcon, next as nextIcon } from "../../icons";

const ChipBar1 = ({ locales, activeId, subCatClickHandler }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter(); // Initialize useRouter

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (dir) => {
    const maxScrollLeft = contentWidth - containerWidth;
    if (dir === "left") {
      setScrollLeft((prev) => Math.min(prev + 120, maxScrollLeft));
    } else if (dir === "right") {
      setScrollLeft((prev) => Math.max(prev - 120, 0));
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
    subCatClickHandler(id, code); // Call the handler to update activeId or other state
    router.push(`/quran-translations/${encodeURIComponent(code)}`, undefined, { shallow: true }); // Update URL without page reload
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={containerRef}>
        <ul className={styles.list} ref={contentRef}>
          <li
            className={classNames(styles.item, activeId ? "" : styles.active)}
            onClick={() => handleItemClick(null, 'all')}
          >
            <IonLabel className={styles.label}>All</IonLabel>
          </li>
          {locales.map((t, i) => (
            <li
              key={i}
              className={classNames(
                styles.item,
                t.id === activeId ? styles.active : ""
              )}
              onClick={() => handleItemClick(t.id, t.attributes.code)} // Pass code here
            >
              <span className={styles.label}>{t.attributes.name}</span>
            </li>
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

export default ChipBar1;
