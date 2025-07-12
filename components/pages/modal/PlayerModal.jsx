import React, { useEffect, useState, useRef } from "react";
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
import { IonIcon } from "@ionic/react";
import { timerOutline, timer } from "ionicons/icons";
import { MoreVert } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import { share } from "../../../icons";
import TimerModal from "./TimerModal";

export default function PlayerModal({
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(null);
  const [resumingTime, setResumingTime] = useState(null);
  const [isTimerSet, setIsTimerSet] = useState(false);
  const timerRef = useRef(null);
  const handleClose = () => setAnchorEl(null);

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
      if (player && videoId && currentVideoId) {
        if (currentVideoId !== videoId && !isIOS) {
          player.loadVideoById(videoId); // Load the video
        }
        player.playVideo(); // Play the video
        player.unMute(); // Unmute the video
      }
    } catch (error) {
      if (attemptsLeft > 0) {
        setTimeout(() => attemptPlayVideo(player, videoId, attemptsLeft - 1), 500); // Retry after 500ms
      } else {
        console.error("Failed to play video after multiple attempts:", error);
      }
    }
  };

  useEffect(() => {
    if (player && videoId) {
      attemptPlayVideo(player, videoId);
    }
  }, [videoId, currentVideoId, player]);

  useEffect(() => {
    if (videoId && videoId !== currentVideoId) {
      const newVideoId = isIOS ? "p3Mrisem6ek" : videoId;
      setCurrentVideoId(newVideoId);
      setIsInitialVideo(true);
    }
  }, [videoId, isIOS, currentVideoId]);

  // const ShareIcon = () => (
  //   <IonIcon icon={shareOutline} slot="start" className={styles.icon} />
  // );

  const onReady = (e) => {
    let playerObj = e.target;
    setPlayer(playerObj);
    if (isInitialVideo) {
      setIsInitialVideo(false);
    }
  };

  const onEnd = (e) => {
    if (player) {
      player.playVideo();
    }
  };

  // CSS for hiding and showing modal
  const handleModalClose = () => {
    if (player) {
      player.stopVideo(); 
    }

    setTimerDuration(null);
    setResumingTime(null);
    // setCurrentVideoId(null); // This cause error in playing the next video
    setPlayer(null);
    setIsInitialVideo(true);
    handleClose();
    closer(); 
    setIsTimerModalOpen(false);
    setIsTimerSet(false);
  };

  const modalStyle = {
    display: open ? "block" : "none", // Toggle visibility
  };

  useEffect(() => {
    if (timerDuration !== null) {
      const endTime = Date.now() + timerDuration * 1000;
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setResumingTime(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          handleModalClose();
        }
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerDuration]);

  const handleCancelTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerDuration(null);
    setResumingTime(null);
    setIsTimerModalOpen(false);
    setIsTimerSet(false);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
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
              {currentVideoId && (
                <YouTube
                    key={currentVideoId}
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
              )}
            </div>

            <div className={styles.title_area}>
              <h2>{videoTitle}</h2>
              <div className={styles.right}>
                <div className={styles.btn}>
                  <div
                    className={styles.menuicon}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <MoreVert />
                  </div>
                </div>
                <span>
                  <Popover
                    open={Boolean(anchorEl)}
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
                            <div className={styles.menulink} onClick={handleShareClick}>
                              <div className={styles.menudetails}>
                                <span className={styles.icon}>
                                  <IonIcon icon={share} slot="start" />
                                </span>
                                <span className={styles.text}>Share</span>
                              </div>
                            </div>
                            <div className={styles.menulink} onClick={() => {
                              if (resumingTime > 0) {
                                handleCancelTimer();
                              } else {
                                setIsTimerModalOpen(true);
                              }
                              handleClose();
                            }}>
                              <div className={styles.menudetails}>
                                <span className={styles.icon} style={{ color: isTimerSet ? "#1A866D" : "" }}>
                                  <IonIcon icon={isTimerSet ? timer : timerOutline} slot="start" />
                                </span>
                                <span className={styles.text}>{resumingTime > 0 ? `Cancel Timer (${formatTime(resumingTime)})` : "Set Timer"}</span>
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
              </span>
              </div>
              <span
                  className={styles.close}
                  onClick={handleModalClose}
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
            <TimerModal
              isOpen={isTimerModalOpen}
              onClose={() => setIsTimerModalOpen(false)}
              onConfirm={(time) => {
                setTimerDuration(time);
                setResumingTime(time);
                setIsTimerModalOpen(false);
                setIsTimerSet(true);
              }}
              resumingTime={resumingTime}
              onCancelTimer={handleCancelTimer}
            />
          </div>
        </Fade>
      </Modal>
    </>
  );
}
