import styles from "./SwipeablePanel.module.css";
import classNames from "classnames";
import { useRef, useEffect, useCallback } from "react";
import { IonIcon } from "@ionic/react";
import { close } from "../../icons";

const SwipeablePanel = ({ children, title, open, controller }) => {
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const containerRef = useRef(null);
  const backdropRef = useRef(null);

  const handleClose = useCallback(() => {
    controller(false);
  }, [controller]);

  useEffect(() => {
    const headerInstance = headerRef.current;

    let currentY = 0,
      tempCurrentY = 0,
      translate = 0;

    const handleTouchStart = (event) => {
      currentY = window.innerHeight - event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
      tempCurrentY = currentY;
      currentY = window.innerHeight - event.touches[0].clientY;

      if (
        translate + tempCurrentY - currentY > 0 &&
        translate + tempCurrentY - currentY < panelRef.current.offsetHeight
      ) {
        translate = translate + tempCurrentY - currentY;
      }
      containerRef.current.style.transform = `translateY(${translate}px)`;
      backdropRef.current.style.opacity =
        1 - translate / panelRef.current.offsetHeight;
    };

    const handleTouchEnd = () => {
      if (translate > panelRef.current.offsetHeight / 3) {
        containerRef.current.style.transition = `transform 250ms ease, opacity 250ms ease`;
        backdropRef.current.style.transition = `opacity 250ms ease`;

        containerRef.current.style.transform = `translateY(100%)`;
        backdropRef.current.style.opacity = 0;

        setTimeout(() => {
          handleClose();
          translate = 0;
          containerRef.current.style.transition = "unset";
          backdropRef.current.style.transition = "unset";
          containerRef.current.style.transform = `translateY(0px)`;
          backdropRef.current.style.opacity = 1;
        }, 250);
      } else {
        containerRef.current.style.transition = `transform 250ms ease, opacity 250ms ease`;
        backdropRef.current.style.transition = `opacity 250ms ease`;

        containerRef.current.style.transform = `translateY(0px)`;
        backdropRef.current.style.opacity = 1;

        setTimeout(() => {
          translate = 0;
          containerRef.current.style.transition = "unset";
          backdropRef.current.style.transition = "unset";
        }, 250);
      }
    };

    headerInstance.addEventListener("touchstart", handleTouchStart);
    headerInstance.addEventListener("touchmove", handleTouchMove);
    headerInstance.addEventListener("touchend", handleTouchEnd);

    return () => {
      headerInstance.removeEventListener("touchstart", handleTouchStart);
      headerInstance.removeEventListener("touchmove", handleTouchMove);
      headerInstance.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleClose]); // Added handleClose to the dependency array

  return (
    <div
      className={classNames(styles.panel, open ? styles.open : "")}
      ref={panelRef}
    >
      <div className={styles.backdrop} ref={backdropRef}></div>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.header} ref={headerRef}>
          <span className={styles.header_line}></span>
          <h2 className={styles.title}>{title}</h2>
          <div className={styles.close}>
            <IonIcon
              icon={close}
              slot="start"
              className={styles.icon}
              onClick={handleClose} // Use handleClose directly
            />
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default SwipeablePanel;
