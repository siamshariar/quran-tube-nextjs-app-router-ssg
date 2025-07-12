import classNames from "classnames";
import styles from "./Video.module.css";
import { server } from "../../lib/config";
import { format } from "../../lib/format";
import { IonRouterLink, IonIcon } from "@ionic/react";
import { ellipsisVertical } from "../../icons";
import { useRef, useEffect } from "react";
import Image from "next/image";
import {
  PopupStore,
  setPopupOpen,
  setPopupReference,
  setPopupVideoId,
} from "../../store";

const VideoCard = ({
  id,
  image,
  title,
  publishedAt,
  channelId,
  channelTitle,
  statistics,
  channelThumbnails,
}) => {
  const open = PopupStore.useState((s) => s.open);
  const reference = PopupStore.useState((s) => s.reference);
  const popupReference = useRef(null);

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopupReference(popupReference.current);
    setPopupVideoId(id);
    setPopupOpen(true);
  };

  useEffect(() => {
    if (open && reference == popupReference.current) {
      popupReference.current.parentElement.classList.add(styles.active);
    } else {
      popupReference.current.parentElement.classList.remove(styles.active);
    }
  }, [open, reference]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.media}>
            <IonRouterLink
              routerLink={`/watch/${id}`} //
              className={styles.thumb}
            >
              <Image
                unoptimized
                src={
                  image
                    ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg`
                    : `${server}/img/youtube/youtube-default.jpg`
                }
                alt="YouTube Thumbnail"  
                width={320}  
                height={180} 
                layout="responsive"  
              />
            </IonRouterLink>

            <div className={styles.details}>
              <div className={styles.meta}>
                <div className={styles.meta_top}>
                  <IonRouterLink
                    routerLink={`/watch/${id}`}
                    className={styles.title}
                  >
                    <h3>{title}</h3>
                  </IonRouterLink>
                  <div className={styles.popup_button}>
                    <IonIcon
                      icon={ellipsisVertical}
                      slot="start"
                      className={styles.icon}
                      onClick={(e) => handlePopup(e)}
                    />
                    <div
                      className={styles.popup_ref}
                      ref={popupReference}
                    ></div>
                  </div>
                </div>

                <div className={styles.metadata}>
                  <div className={styles.top}>
                    <a
                      href={`https://www.youtube.com/channel/${channelId}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.avatar}
                    >
                      <Image
                        unoptimized
                        src={
                          channelThumbnails && channelThumbnails[channelId] 
                            ? channelThumbnails[channelId] 
                            : "/path/to/placeholder.jpg"  
                        }
                        alt="Channel Thumbnail" 
                        width={100}   
                        height={100}  
                        layout="fixed"  
                      />

                    </a>
                    <span>{channelTitle}</span>
                  </div>
                  <div className={styles.bottom}>
                    <span>
                      {statistics ? format.count(statistics[id]) : ""} views
                    </span>
                    <span>{format.date(publishedAt)}</span>
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
