import styles from "./Previewer.module.css";
import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PreviewStore,
  setPreviewOpen,
  setPreviewReference,
  setPreviewVideo,
  PopupStore,
  setPopupOpen,
  setPopupReference,
  setPopupVideoId,
} from "../../store";
import { format } from "../../lib/format";
import { IonIcon, IonContent, IonRouterLink } from "@ionic/react";
import {
  queue,
  watchOutline,
  playlist,
  share,
  notInterested,
  notRecommend,
  report,
  ellipsisVertical,
} from "../../icons";

const Previewer = () => {
  const open = PreviewStore.useState((s) => s.open);
  const reference = PreviewStore.useState((s) => s.reference);
  const video = PreviewStore.useState((s) => s.video);
  const container = PreviewStore.useState((s) => s.container);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  const [width, setWidth] = useState(0);

  const [isOpen, setIsOpen] = useState(false);

  const PreviewRef = useRef(null);
  const mobilePreviewContentRef = useRef(null);

  useEffect(() => {
    setIsOpen(false); // reset first
    const refElem = reference?.getBoundingClientRect();
    const containerElem = container?.getBoundingClientRect();

    setPos({
      top: refElem?.top - 12,
      left:
        refElem?.left - containerElem?.left < 40 // should around 12 but 40 for security
          ? refElem?.left - 12
          : containerElem?.right - refElem?.right < 40
          ? "auto"
          : refElem?.left -
            (reference.offsetWidth * (142.29 / 100) - reference.offsetWidth) /
              2,
      right:
        containerElem?.right - refElem?.right < 40
          ? window.innerWidth - refElem?.right - 12
          : "auto",
      bottom: "auto",
    });

    setWidth(reference.offsetWidth * (142.29 / 100));

    setTimeout(() => {
      setIsOpen(open);
    }, 400);
  }, [reference, open, container]);

  useEffect(() => {
    const instanceOfPreview = PreviewRef.current;

    const addClickEventOnBody = () => {
      setPreviewOpen(false);
      // setPreviewReference(document.body);
      // setPreviewVideoId(null);
      return false;
    };

    const addClickEventOnPreview = (e) => {
      e.stopPropagation();
      return false;
    };

    document.body.addEventListener("click", addClickEventOnBody);
    instanceOfPreview.addEventListener("click", addClickEventOnPreview);

    return () => {
      document.body.removeEventListener("click", addClickEventOnBody);
      instanceOfPreview.removeEventListener("click", addClickEventOnPreview);
    };
  }, []);

  const popupOpen = PopupStore.useState((s) => s.open);
  const popupReference = PopupStore.useState((s) => s.reference);
  const popupRef = useRef(null);

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopupReference(popupRef.current);
    setPopupVideoId(video.id);
    setPopupOpen(true);
    console.log(popupOpen);
  };

  useEffect(() => {
    if (popupOpen && popupReference == popupRef.current) {
      popupRef.current.classList.add(styles.active);
    } else {
      popupRef.current.classList.remove(styles.active);
    }
  }, [popupOpen, popupReference]);

  return (
    <div
      style={{
        display: "block",
        top: pos.top,
        left: pos.left,
        right: pos.right,
        bottom: pos.bottom,
        width: width,
      }}
      className={classNames(styles.preview, isOpen ? styles.open : "")}
      ref={PreviewRef}
      onMouseEnter={() => setPreviewOpen(true)}
      onMouseLeave={() => setPreviewOpen(false)}
    >
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.player}>
            <iframe
              frameBorder="0"
              // allowFullScreen="1"
              // allow="accelerometer; autoplay; encrypted-media; gyroscope; fullscreen; picture-in-picture"
              // title={title}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video.id}?modestbranding=1&showinfo=0&autoplay=1&mute=1&enablejsapi=1&showsearch=0&rel=0&iv_load_policy=3&autohide=1`}
            ></iframe>
            <div className={styles.player_wrapper}>
              <IonRouterLink
                routerLink={`/watch/${video.id}`} //
                className={styles.player_link}
              >
                <span>Nothing</span>
              </IonRouterLink>
            </div>
          </div>

          <div className={styles.details}>
            <IonRouterLink
              routerLink={`/watch/${video.id}`} //
              className={styles.avatar}
            >
              <Image
                unoptimized
                src={video.channelThumbnails ? video.channelThumbnails[video.channelId] : ""}
                alt=""
                width={100}  
                height={100} 
                layout="responsive" 
              />
            </IonRouterLink>
            <div className={styles.meta}>
              <div className={styles.meta_top}>
                <IonRouterLink
                  routerLink={`/watch/${video.id}`}
                  className={styles.title}
                >
                  <h3>{video.title}</h3>
                </IonRouterLink>
                <div className={styles.popup_button} ref={popupRef}>
                  <IonIcon
                    icon={ellipsisVertical}
                    slot="start"
                    className={styles.icon}
                    onClick={(e) => handlePopup(e)}
                  />
                </div>
              </div>

              <div className={styles.metadata}>
                <div className={styles.top}>{video.channelTitle}</div>
                <div className={styles.bottom}>
                  <span>
                    {video.statistics
                      ? format.count(video.statistics[video.id])
                      : ""}{" "}
                    views
                  </span>
                  <span>{format.date(video.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Previewer;
