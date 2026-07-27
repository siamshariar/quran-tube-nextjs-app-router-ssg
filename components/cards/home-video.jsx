import { useRef, useEffect, useState } from "react";
import classNames from "classnames";
import videoStyles from "./Video.module.css";
import shortsStyles from "./Shorts.module.css";
import Image from "next/image";
import Modal from "@mui/material/Modal";
import { heartOutline, heart } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { report, share } from "../../icons";
import { MoreVert } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import ShareModal from "../pages/modal/share-modal";
import { addRecentVideo, moveVideoToTop } from "../../store/RecentVideosStore";
import { addFavoriteVideo, removeFavoriteVideo, FavoriteVideosStore } from "../../store/FavoriteVideosStore";

const VideoCard = ({ handleClick, attributes, isModalOpen, isShorts, pathname, urlParams }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const styles = isShorts ? shortsStyles : videoStyles;
  const isUserInteraction = useRef(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const closeReportModal = () => setIsReportModalOpen(false);
  const closeShareModal = () => setIsShareModalOpen(false);

  const handleVideoClick = () => {
    handleClick();
    isUserInteraction.current = true; // TODO: Why is this needed?

    const fullUrl = getFullUrl(attributes.slug)

    addRecentVideo({
      slug: attributes.slug,
      title: attributes.title,
      ytVideoId: attributes.ytVideoId,
      sourceLogoUrl: attributes.sourceLogoUrl,
      addedAt: new Date().toISOString(),
      pathname: pathname,
      fullUrl: fullUrl,
    })

    moveVideoToTop(attributes.ytVideoId);
  };

  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favorites = FavoriteVideosStore.getRawState().favoriteVideos || [];
      const isFavorite = Array.isArray(favorites) && favorites.some((video) => video.ytVideoId === attributes.ytVideoId);
      setIsFavorited(isFavorite);
    };

    checkFavoriteStatus();

    window.addEventListener("favoritesUpdated", checkFavoriteStatus);

    return () => {
      window.removeEventListener("favoritesUpdated", checkFavoriteStatus);
    };
  }, [attributes.ytVideoId]);

  const handleAddFavorite = async (e) => {
    e.stopPropagation();
    const videoDetails = {
      slug: attributes.slug,
      title: attributes.title,
      ytVideoId: attributes.ytVideoId,
      sourceLogoUrl: attributes.sourceLogoUrl,
    };

    const newFavoritedState = !isFavorited;
    const fullUrl = getFullUrl(attributes.slug);

    if (newFavoritedState) {
      await addFavoriteVideo({ ...videoDetails, fullUrl }, fullUrl)
    } else {
      await removeFavoriteVideo(attributes.ytVideoId);
    }

    setIsFavorited(newFavoritedState);
    window.dispatchEvent(new CustomEvent("favoritesUpdated", { detail: { videoId: attributes.ytVideoId } }));
  };

  const getVideoUrl = (slug) => {
    urlParams.set("v", slug);
    return `${pathname}?${urlParams.toString()}`;
  };

  const getFullUrl = (slug) => {
    const url = getVideoUrl(slug)
    if (typeof window !== "undefined" && pathname) {
      return `${window.location.origin}${url}`
    }
    return url
  }

  const open = Boolean(anchorEl);

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
            </a>
              <div className={styles.details}>
              <a
                href={getVideoUrl(attributes.slug)}
                onClick={(e) => {
                  if (!isModalOpen) {
                    e.preventDefault();
                    handleVideoClick();
                  }
                }}
              >
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
                          src={attributes.sourceLogoUrl ? attributes.sourceLogoUrl.replace("s240", "s68").replace("s176", "s68").replace("s100", "s68") : ""}
                          alt="Thumbnail"
                          width={50}
                          height={50}
                      />
                    </div>
                )}
              </a>
                <div className={styles.meta}>
                  <div className={styles.meta_top}>
                  <a
                    href={getVideoUrl(attributes.slug)}
                    onClick={(e) => {
                      if (!isModalOpen) {
                        e.preventDefault();
                        handleVideoClick();
                      }
                    }}
                  >
                    <div className={styles.title}>
                      <h3>{attributes.title}</h3>
                    </div>
                  </a>
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.btn}>
                  <div className={styles.menuicon} onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVert />
                  </div>
                  {/*<div className={styles.metadata}>*/}
                  {/*  <div className={styles.bottom}>*/}
                  {/*    <span>{format.date(attributes.contentPublishedAt)}</span>*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </div>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <div className={styles.menu}>
                    <div className={styles.menuwrapper}>
                      <div className={styles.menucontent}>
                        <div className={styles.menulist}>
                        <div className={styles.menulink} onClick={(e) => { handleAddFavorite(e); handleClose(); }}>
                          <div className={styles.menudetails}>
                            <span className={styles.icon}>
                              <IonIcon
                                icon={isFavorited ? heart : heartOutline}
                                slot="start"
                                className={isFavorited ? styles.favorite : ""}
                              />
                            </span>
                            <span className={styles.text}>
                              {isFavorited ? "Remove Favorite" : "Add Favorite"}
                            </span>
                          </div>
                        </div>
                          <div className={styles.menulink} onClick={() => {
                              setIsShareModalOpen(true);
                              handleClose();
                            }}>
                            <div className={styles.menudetails}>
                              <span className={styles.icon}>
                                <IonIcon icon={share} slot="start" />
                              </span>
                              <span className={styles.text}>Share</span>
                            </div>
                          </div>
                          {/* <div
                              className={styles.menulink}
                              onClick={() => {
                                handleReportClick();
                                handleClose();
                              }}
                            >
                            <div className={styles.menudetails}>
                              <span className={styles.icon}>
                                <IonIcon icon={report} slot="start" />
                              </span>
                              <span className={styles.text}>Report</span>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
            <ShareModal
              openModal={isShareModalOpen}
              closer={closeShareModal}
              url={getFullUrl(attributes.slug)}
              title={attributes.title}
            />
            <Modal open={isReportModalOpen} onClose={closeReportModal}>
              <div className={styles.report_modal}>
                <h2>Report Video</h2>
                <p>Please describe the issue with this video.</p>
                <textarea
                  className={styles.textarea}
                  placeholder="Describe the issue here..."
                ></textarea>
                <button onClick={closeReportModal}>Submit</button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
