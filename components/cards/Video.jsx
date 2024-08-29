import classNames from "classnames";
import styles from "./Video.module.css";
import { server } from "../../lib/config";
import { format } from "../../lib/format";
import { IonRouterLink, IonIcon, IonButton } from "@ionic/react";
import { ellipsisVertical } from "../../icons";
import { useRef, useEffect, useState } from "react";
import {
  PopupStore,
  setPopupOpen,
  setPopupReference,
  setPopupVideoId,
  PreviewStore,
  setPreviewOpen,
  setPreviewReference,
  setPreviewVideo,
} from "../../store";

const VideoCard = ({ attributes, handleClick }) => {
  const open = PopupStore.useState((s) => s.open);
  const reference = PopupStore.useState((s) => s.reference);
  const popupReference = useRef(null);

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopupReference(popupReference.current);
    setPopupVideoId(attributes.ytVideoId);
    setPopupOpen(true);
  };

  // useEffect(() => {
  //   if (open && reference == popupReference.current) {
  //     popupReference.current.classList.add(styles.active);
  //   } else {
  //     popupReference.current.classList.remove(styles.active);
  //   }
  // }, [open, reference]);

  // preview
  const previewOpen = PreviewStore.useState((s) => s.open);
  const previewReference = PreviewStore.useState((s) => s.reference);
  const previewRef = useRef(null);

  const [timeout, updateTimeout] = useState(null);

  const handlePreviewOnHover = (hover) => {
    // e.stopPropagation();
    if (hover) {
      updateTimeout(
        setTimeout(() => {
          setPreviewReference(previewRef.current);
          setPreviewVideo({
            id,
            image,
            title,
            publishedAt,
            channelId,
            channelTitle,
            statistics,
            channelThumbnails,
          });
          setPreviewOpen(true);
        }, 1000)
      );
    } else {
      clearTimeout(timeout);
      setPreviewOpen(false);
    }
  };

  useEffect(() => {
    if (previewOpen && previewReference == previewRef.current) {
      previewRef.current.classList.add(styles.active);
    } else {
      previewRef.current.classList.remove(styles.active);
    }
  }, [previewOpen, previewReference]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.media}>
            <div
              className={styles.thumb}
              onClick={() => handleClick(attributes.ytVideoId)}
            >
              <img
                // src={
                //   image
                //     ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
                //     : `${server}/img/youtube/youtube-default.jpg`
                // }
                src={`https://i.ytimg.com/vi/${attributes.ytVideoId}/mqdefault.jpg`}
                alt=""
                ref={previewRef}
                // onMouseEnter={() => handlePreviewOnHover(true)}
                // onMouseLeave={() => handlePreviewOnHover(false)}
              />
            </div>

            <div className={styles.details}>
              <div
                className={styles.avatar}
                onClick={() => handleClick(attributes.ytVideoId)}
              >
                <img
                  src={attributes.sourceLogoUrl ? attributes.sourceLogoUrl : ""} //
                  alt=""
                />
              </div>
              <div className={styles.meta}>
                <div className={styles.meta_top}>
                  <div
                    onClick={() => handleClick(attributes.ytVideoId)}
                    className={styles.title}
                  >
                    <h3>{attributes.title}</h3>
                  </div>
                  {/*<div className={styles.popup_button} ref={popupReference}>*/}
                  {/*  <IonIcon*/}
                  {/*    icon={ellipsisVertical}*/}
                  {/*    slot="start"*/}
                  {/*    className={styles.icon}*/}
                  {/*    onClick={(e) => handlePopup(e)}*/}
                  {/*  />*/}
                  {/*</div>*/}
                </div>

                <div className={styles.metadata}>
                  {/* <div className={styles.top}>{channelTitle}</div> */}
                  <div className={styles.bottom}>
                    {/* <span>
                      {statistics ? format.count(statistics[id]) : ""} views
                    </span> */}
                    <span>{format.date(attributes.contentPublishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
