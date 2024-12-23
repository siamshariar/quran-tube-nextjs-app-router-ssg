import classNames from "classnames";
import styles from "./Channel.module.css";
import { server } from "../../lib/config";
import { format } from "../../lib/format";
import { IonRouterLink, IonIcon } from "@ionic/react";
import { ellipsisVertical } from "../../icons";
import { Image } from "next/image";

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

const ChannelCard = ({
  id,
  title,
  description,
  url,
  avatar,
  viewCount,
  subscriberCount,
  videoCount,
}) => {
  // const open = PopupStore.useState((s) => s.open);
  // const reference = PopupStore.useState((s) => s.reference);
  // const popupReference = useRef(null);

  // const handlePopup = (e) => {
  //   e.stopPropagation();
  //   setPopupReference(popupReference.current);
  //   setPopupVideoId(id);
  //   setPopupOpen(true);
  // };

  // useEffect(() => {
  //   if (open && reference == popupReference.current) {
  //     popupReference.current.classList.add(styles.active);
  //   } else {
  //     popupReference.current.classList.remove(styles.active);
  //   }
  // }, [open, reference]);

  // preview
  // const previewOpen = PreviewStore.useState((s) => s.open);
  // const previewReference = PreviewStore.useState((s) => s.reference);
  // const previewRef = useRef(null);

  // const [timeout, updateTimeout] = useState(null);

  // const handlePreviewOnHover = (hover) => {
  //   // e.stopPropagation();
  //   if (hover) {
  //     updateTimeout(
  //       setTimeout(() => {
  //         setPreviewReference(previewRef.current);
  //         setPreviewVideo({
  //           id,
  //           image,
  //           title,
  //           publishedAt,
  //           channelId,
  //           channelTitle,
  //           statistics,
  //           channelThumbnails,
  //         });
  //         setPreviewOpen(true);
  //       }, 1000)
  //     );
  //   } else {
  //     clearTimeout(timeout);
  //     setPreviewOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   if (previewOpen && previewReference == previewRef.current) {
  //     previewRef.current.classList.add(styles.active);
  //   } else {
  //     previewRef.current.classList.remove(styles.active);
  //   }
  // }, [previewOpen, previewReference]);

  return (
    <div className={styles.wrapper}>
      <IonRouterLink
        routerLink={`/channels/${id}`} //
        className={styles.container}
      >
        <div className={styles.content}>
          <div className={styles.profile}>
          <Image
            unoptimized
            src={avatar ? avatar : `${server}/img/youtube/youtube-default.jpg`}
            alt="User Avatar"
            width={50}  // Specify appropriate width
            height={50} // Specify appropriate height
            layout="fixed" // Optional: Choose layout based on the use case
          />
          </div>
          <div className={styles.details}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.info}>
              <div className={styles.count}>
                <div className={styles.count_item}>
                  <span>{format.count(subscriberCount)} subscribers</span>
                </div>
                <div className={styles.count_item}>
                  <span>{format.count(videoCount)} videos</span>
                </div>
              </div>
              <div className={styles.desc}>{description}</div>
            </div>
          </div>
          <div className={styles.right}>
            <IonIcon
              icon={ellipsisVertical}
              slot="start"
              className={styles.icon}
              // onClick={(e) => handlePopup(e)}
            />
          </div>
        </div>
      </IonRouterLink>
    </div>
  );
};

export default ChannelCard;
