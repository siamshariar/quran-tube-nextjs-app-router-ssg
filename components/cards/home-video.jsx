import { useRef } from "react";
import classNames from "classnames";
import videoStyles from "./Video.module.css";
import shortsStyles from "./Shorts.module.css";
import Image from "next/image";

const VideoCard = ({ handleClick, attributes, isModalOpen, isShorts, pathname, urlParams }) => {
  const isUserInteraction = useRef(false);
  const styles = isShorts ? shortsStyles : videoStyles;

  const handleVideoClick = () => {
    handleClick();
    isUserInteraction.current = true; // TODO: Why is this needed?
  };

  const getVideoUrl = (slug) => {
    urlParams.set('v', slug);
    return `${pathname}?${urlParams.toString()}`;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.media}>
            <a
                href={getVideoUrl(attributes.slug)}
                onClick={(e) => {
                  if (!isModalOpen) {
                    e.preventDefault(); // Prevent redirect
                    handleVideoClick(); // Open the modal
                  }
                }}
            >
              <div
                className={classNames(styles.thumb, { [styles.disabled]: isModalOpen })}
              >
                <img
                  src={`https://i.ytimg.com/vi/${attributes.ytVideoId}/${isShorts ? 'sddefault' : 'mqdefault'}.jpg`}
                  alt={attributes.title}
                />
                {/*<Image*/}
                {/*    unoptimized*/}
                {/*    src={`https://i.ytimg.com/vi/${attributes.ytVideoId}/${isShorts ? 'sddefault' : 'mqdefault'}.jpg`}*/}
                {/*    alt={attributes.title}*/}
                {/*    width={320}*/}
                {/*    height={180}*/}
                {/*    sizes="(max-width: 768px) 100vw, 320px"  // This ensures responsiveness*/}
                {/*/>*/}
              </div>
              <div className={styles.details}>
                {!isShorts && (
                    <div className={classNames(styles.avatar, { [styles.disabled]: isModalOpen })}>
                      {/*<img*/}
                      {/*    src={attributes.sourceLogoUrl || ""}*/}
                      {/*    alt="Source Logo"*/}
                      {/*    onClick={isModalOpen ? null : handleVideoClick}*/}
                      {/*    // onError={handleImageError}*/}
                      {/*/>*/}
                      <Image
                          unoptimized
                          src={attributes.sourceLogoUrl || ""}
                          alt="Thumbnail"
                          width={50}
                          height={50}
                      />
                    </div>
                )}
                <div className={styles.meta}>
                  <div className={styles.meta_top}>
                    <div className={styles.title}>
                      <h3>{attributes.title}</h3>
                    </div>
                  </div>
                  {/*<div className={styles.metadata}>*/}
                  {/*  <div className={styles.bottom}>*/}
                  {/*    <span>{format.date(attributes.contentPublishedAt)}</span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
