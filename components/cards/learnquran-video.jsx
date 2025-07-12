import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import styles from "./Video.module.css";
import PlayerModal from "../pages/modal/PlayerModal";
import { format } from "../../lib/format";

const getContentId = (slug) => {
  if (!slug || typeof slug !== "string") {
    console.error("Invalid slug:", slug);
    return null;
  }
  const parts = slug.split("-");
  const lastThreeParts = parts.slice(-3);
  return lastThreeParts[1];
};

const VideoCard = ({ attributes, handleClick, isModalOpen, onModalClose }) => {
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [videoDetail, setVideoDetail] = useState(null);
  const router = useRouter();
  const isUserInteraction = useRef(false);

  const openVideo = useCallback(
    (details) => {
      const videoId = getContentId(details.slug);
      if (videoId) {
        setSelectedVideoId(videoId);
        setVideoDetail(details);
        handleClick();
        isUserInteraction.current = true;

        const videoUrl = "/learn-quran/?v=" + encodeURIComponent(details.slug);

        router.push(videoUrl, undefined, { shallow: true });

        sessionStorage.setItem("lastOpenedVideo", videoId);
      }
    },
    [handleClick, router]
  );

  const closeModal = useCallback(() => {
    onModalClose();
    setSelectedVideoId(null);
    setVideoDetail(null);

    const { v, ...updatedQuery } = router.query;
    router.replace(
      { pathname: router.pathname, query: updatedQuery },
      undefined,
      { shallow: true }
    );

    isUserInteraction.current = false;

    sessionStorage.removeItem("lastOpenedVideo");
  }, [onModalClose, router]);

  const handleVideoClick = useCallback(() => {
    openVideo(attributes);
  }, [attributes, openVideo]);

  useEffect(() => {
    if (!router.isReady) return;

    const { v } = router.query;
    const lastOpenedVideo = sessionStorage.getItem("lastOpenedVideo");

    // Check if we have a video ID from the query
    if (v && !isUserInteraction.current) {
      const videoId = getContentId(v);
      if (videoId && videoId === getContentId(attributes.slug) && lastOpenedVideo !== videoId) {
        openVideo(attributes);
      }
    }
  }, [router.isReady, router.query, attributes.slug, openVideo]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      const newQuery = new URLSearchParams(url.split("?")[1]);
      const v = newQuery.get("v");
      const lastOpenedVideo = sessionStorage.getItem("lastOpenedVideo");

      if (v && !isUserInteraction.current) {
        const videoId = getContentId(v);
        if (videoId && videoId === getContentId(attributes.slug) && lastOpenedVideo !== videoId) {
          openVideo(attributes);
        }
      }
    };

    // Subscribe to route change events
    router.events.on("routeChangeComplete", handleRouteChange);

    // Clean up the subscription on component unmount
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [attributes.slug, openVideo, router.events]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.inner}>
          <div className={styles.media}>
            <div
              className={classNames(styles.thumb, { [styles.disabled]: isModalOpen })}
              onClick={isModalOpen ? null : handleVideoClick}
            >
              <img
                src={`https://i.ytimg.com/vi/${attributes.ytVideoId}/mqdefault.jpg`}
                alt={attributes.title}
              />
            </div>
            <div className={styles.details}>
              <div className={classNames(styles.avatar, { [styles.disabled]: isModalOpen })}>
                <img
                  src={attributes.sourceLogoUrl || ""}
                  alt="Source Logo"
                  onClick={isModalOpen ? null : handleVideoClick}
                />
              </div>
              <div className={styles.meta}>
                <div className={styles.meta_top}>
                  <div className={styles.title} onClick={isModalOpen ? null : handleVideoClick}>
                    <h3>{attributes.title}</h3>
                  </div>
                </div>
                <div className={styles.metadata}>
                  <div className={styles.bottom}>
                    <span>{format.date(attributes.contentPublishedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedVideoId && (
        <PlayerModal
          open={isModalOpen}
          closer={closeModal}
          src={videoDetail?.ytVideoId}
          videoDetail={videoDetail}
          attributes={attributes}
        />
      )}
    </div>
  );
};

export default VideoCard;