import React, { useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Modal.module.css";
import ShareIcon from "@mui/icons-material/Share";
import ShareModal from "./share-modal"; // Ensure the path to ShareModal is correct
import classNames from "classnames";
import {isMobile, isTablet} from 'react-device-detect';
import YouTube from 'react-youtube';

export default function PlayerModalTest({
  open,
  closer,
  attributes = {},
  videoId,
  videoTitle,
  videoType,
  metaTitle,
  metaUrl,
  isIOS,
}) {
  // const playerRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const initVideoId = isIOS ? "p3Mrisem6ek" : videoId;
  const [currentVideoId, setCurrentVideoId] = useState(initVideoId);
  const [player, setPlayer] = useState(null);
  const [isInitialVideo, setIsInitialVideo] = useState(true);

  // Handle opening the share modal
  const handleShareClick = () => {
    if ((isMobile || isTablet) && navigator.share) {
      navigator.share({
        title: metaTitle,
        url: metaUrl,
      })
      .catch((error) => console.log("Error sharing:", error));
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Close the share modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const attemptPlayVideo = (player, videoId, attemptsLeft = 3) => {
    try {
      if (player && videoId) {
        player.loadVideoById(videoId); // Load the video
        player.playVideo(); // Play the video
        player.unMute(); // Unmute the video
      }
    } catch (error) {
      if (attemptsLeft > 0) {
        setTimeout(() => attemptPlayVideo(player, videoId, attemptsLeft - 1), 500); // Retry after 500ms
      } else {
        setCurrentVideoId(videoId);
      }
    }
  };

  useEffect(() => {
    if (player && videoId) {
      attemptPlayVideo(player, videoId);
    }
  }, [videoId, currentVideoId, player]);

  // const ShareIcon = () => (
  //   <IonIcon icon={shareOutline} slot="start" className={styles.icon} />
  // );

  const onReady = (e) => {
    let playerObj = e.target;
    setPlayer(playerObj);
  };

  const onEnd = (e) => {
    if (player) {
      player.playVideo();
    }
  };

  // CSS for hiding and showing modal
  const modalStyle = {
    display: open ? "block" : "none", // Toggle visibility
  };

  return (
    <>
      <Modal
        open={true}
        onClose={null} // Disable default onClose behavior
        disableBackdropClick // Prevent closing on backdrop click
        disableEscapeKeyDown // Prevent closing on Escape key
        className="player-modal"
        style={modalStyle}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 300,
          },
        }}
      >
        <Fade in={open} timeout={100}>
          <div className={styles.modal}>
            <div
                className={classNames(
                    styles.iframe_container,
                    videoType === "Shorts" ? styles.shorts : ""
                )}
            >
              <YouTube
                  videoId={currentVideoId}
                  opts={{
                    playerVars: {
                      autoplay: 1,
                      playsinline: 1, // forbid fullscreen on ios
                      fs: 0,
                      loop: 1,
                      modestbranding: 1,
                      showinfo: 0,
                      mute: isIOS && isInitialVideo ? 1 : 0, // TODO: Add isIOS cond
                      playlist: currentVideoId,
                      rel: 0,
                      iv_load_policy: 3,
                    },
                  }}
                  onReady={onReady}
                  onEnd={onEnd}
              />
            </div>

            <div className={styles.title_area}>
              <h2>{videoTitle}</h2>
              <span className={styles.close} onClick={handleShareClick}>
                {/*<ShareIcon Icon={ShareIcon} className={styles.icon} fontSize="large" />*/}
                <ShareIcon style={{width: `26px`, height:`26px`}} />
              </span>
              <span
                  className={styles.close}
                  onClick={() => {
                    if (player) {
                      player.stopVideo(); // Stop the video
                    }
                    setCurrentVideoId(null);
                    setIsInitialVideo(false);
                    closer(); // Close the modal or perform other closing actions
                  }}
              >
                <CloseIcon />
              </span>
            </div>

            {/* Share Modal */}
            <ShareModal
              openModal={isShareModalOpen}
              closer={closeShareModal}
              url={metaUrl}
              title={metaTitle}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
}
