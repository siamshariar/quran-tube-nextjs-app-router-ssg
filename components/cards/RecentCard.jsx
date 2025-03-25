import PropTypes from "prop-types";
import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import styles from "./RecentCard.module.css";
import Image from "next/image";

const RecentCard = ({ item, handleRemoveRecent, urlParams, openModal }) => {
  const handleCardClick = () => {
    openModal(item.ytVideoId, item.title, item.type, item.slug, item);
  };

  const formattedDate = item.addedAt
    ? new Date(item.addedAt).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "Unknown Date";

    const getVideoUrl = () => {
      const newUrlParams = new URLSearchParams(urlParams);
      newUrlParams.set("v", item.slug);
      // Use the original path if available, otherwise fall back to /recents
      const basePath = item.pathname || '/recents';
      const videoUrl = `${basePath}?${newUrlParams.toString()}`;
      localStorage.setItem("recentVideoUrl", videoUrl);
      return videoUrl;
    };
  

    const handleLinkClick = (e) => {
      if (e.button === 1 || e.metaKey || e.ctrlKey) {
        // Middle click or cmd/ctrl click - let it open in new tab naturally
        return;
      }
  
      e.preventDefault();
      handleCardClick();
    };

  const getProgressBarWidth = () => {
    const duration = item.duration || 1;
    const currentTime = item.currentTime || 0;
    return `${(currentTime / duration) * 100}%`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <a href={getVideoUrl()} onClick={handleLinkClick}>
          <Image
            src={`https://i.ytimg.com/vi/${item.ytVideoId}/mqdefault.jpg`}
            alt={item.title}
            layout="fill"
            objectFit="cover"
            unoptimized
          />
        </a>
        <div className={styles.progressBarContainer}>
          <div
            className={styles.progressBar}
            style={{ width: getProgressBarWidth() }}
          ></div>
        </div>
      </div>
      <div className={styles.details}>
        <a href={getVideoUrl()} onClick={handleLinkClick}>
          <h3 className={styles.title}>{item.title}</h3>
        </a>
        {/* <p className={styles.date}>{formattedDate}</p> */}
        <div className={styles.actions}>
          <IonIcon
            icon={trashOutline}
            className={styles.deleteIcon}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveRecent(item.ytVideoId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

RecentCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ytVideoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    addedAt: PropTypes.string.isRequired,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
  }).isRequired,
  handleRemoveRecent: PropTypes.func.isRequired,
  urlParams: PropTypes.object.isRequired,
  openModal: PropTypes.func.isRequired,
};

export default RecentCard;