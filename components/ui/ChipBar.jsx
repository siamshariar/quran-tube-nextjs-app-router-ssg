"use client";

import styles from "./ChipBar.module.css";
import classNames from "classnames";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {IonIcon} from "@ionic/react";
import {next as nextIcon, previous as prevIcon} from "../../icons";
import localizationData from '../../public/pagemenudata.json';
import Link from "next/link";

// Selecting a category navigates to a new dynamic route segment, which
// remounts ChipBar -- persisting the scroll offset here (outside React
// state) is what keeps the selected chip in view across that remount,
// instead of the list snapping back to the start ("All").
const SCROLL_STORAGE_KEY = "chipbar_scroll_left";

const getStoredScrollLeft = () => {
  if (typeof window === "undefined") return 0;
  try {
    return Number(window.sessionStorage.getItem(SCROLL_STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
};

const storeScrollLeft = (value) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, String(value));
  } catch {}
};

const ChipBar = ({ activeId, subCatClickHandler, pathname }) => {
  const locales = localizationData.data;
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const router = useRouter();

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  // "All" sits at the very start of the list, so whenever it's the active
  // selection the list should always open showing the beginning -- only
  // restore the persisted offset when landing on a specific category.
  const [scrollLeft, setScrollLeft] = useState(() => (activeId == null ? 0 : getStoredScrollLeft()));
  // Only the arrow buttons should animate; restoring the persisted
  // position after a remount must be instant (see CSS `.content`'s
  // scroll-behavior: smooth, which would otherwise animate every restore).
  const smoothScrollRef = useRef(false);

  const handleScroll = (dir) => {
    smoothScrollRef.current = true;
    const maxScrollLeft = contentWidth - containerWidth;
    if (dir === "left") {
      setScrollLeft((prev) => Math.min(prev + 540, maxScrollLeft));
    } else if (dir === "right") {
      setScrollLeft((prev) => Math.max(prev - 540, 0));
    }
  };

  const handleNativeScroll = (e) => {
    storeScrollLeft(e.target.scrollLeft);
  };

  // Captures the scroll offset at the exact moment of click, before
  // navigation/remount, so nothing (e.g. a browser focus-into-view nudge)
  // can shift the persisted position in between.
  const handleChipClick = () => {
    if (containerRef.current) {
      storeScrollLeft(containerRef.current.scrollLeft);
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

  // useLayoutEffect (not useEffect) so the restored offset is applied
  // before the browser paints -- otherwise the freshly-mounted container's
  // native scrollLeft:0 flashes on screen for a frame first.
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.scrollBehavior = smoothScrollRef.current ? "smooth" : "auto";
      containerRef.current.scrollLeft = scrollLeft;
      smoothScrollRef.current = false;
    }
    // Don't let "All" forcing its own view to 0 clobber a specific
    // category's saved offset -- only persist while a category is active.
    if (activeId != null) {
      storeScrollLeft(scrollLeft);
    }
  }, [scrollLeft, containerWidth, contentWidth, activeId]);

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

  const isAllActive = activeId == null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} ref={containerRef} onScroll={handleNativeScroll}>
        <ul className={styles.list} ref={contentRef}>
          <Link href={getPath(null, 'all')} onClick={handleChipClick}>
            <li
              className={classNames(styles.item, isAllActive ? styles.active : "")}
            >
              <span className={styles.label}>All</span>
            </li>
          </Link>
          {locales.map((t, i) => (
            <Link key={i} href={getPath(t.id, t.attributes.code)} onClick={handleChipClick}>
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
