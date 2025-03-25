import PropTypes from "prop-types";
import { IonIcon } from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import styles from "./FavoriteCard.module.css";
import Image from "next/image";

const FavoriteCard = ({ item, handleRemoveFavorite, urlParams, openModal }) => {
  const handleCardClick = () => {
    openModal(item.ytVideoId, item.title, item.ytVideoType, item.slug);
  };

  const getVideoUrl = () => {
    const newUrlParams = new URLSearchParams(urlParams);
    newUrlParams.set("v", item.slug);
    const videoUrl = `/favorites?${newUrlParams.toString()}`;
    localStorage.setItem("currentUrl", videoUrl);
    return videoUrl;
  };

  const handleLinkClick = (e) => {
    if (e.button === 1 || e.metaKey || e.ctrlKey) {
      return; // Allow opening in a new tab
    }

    e.preventDefault(); // Prevent default behavior for normal clicks
    handleCardClick();
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
      </div>

      <div className={styles.details}>
        <a href={getVideoUrl()} onClick={handleLinkClick}>
          <h3 className={styles.title}>{item.title}</h3>
        </a>
        <p className={styles.subtitle}>{item.ytVideoType}</p>
        <div className={styles.actions}>
          <IonIcon
            icon={trashOutline}
            className={styles.deleteIcon}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFavorite(item);
            }}
          />
        </div>
      </div>
    </div>
  );
};


FavoriteCard.propTypes = {
  item: PropTypes.shape({
    ytVideoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    ytVideoType: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  handleRemoveFavorite: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  urlParams: PropTypes.instanceOf(URLSearchParams).isRequired,
};

export default FavoriteCard;