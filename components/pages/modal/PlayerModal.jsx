import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
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
import { heartOutline, heart, timerOutline, timer } from "ionicons/icons";
import { MoreVert } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import { share, report } from "../../../icons";
import { addFavoriteVideo, removeFavoriteVideo, FavoriteVideosStore } from "../../../store/FavoriteVideosStore";
import { updateVideoProgress } from "../../../store/RecentVideosStore";
import TimerModal from "./TimerModal";

// A short, embeddable public video used as the always-running muted
// background player on iOS -- never actually watched, just kept "hot" so
// that a card tap can swap it to the real video from directly inside that
// tap's own synchronous click handler.
const DUMMY_VIDEO_ID = "p3Mrisem6ek";

const PlayerModal = forwardRef(function PlayerModal({
  open,
  closer,
  attributes = {},
  videoId,
  videoTitle,
  videoType,
  metaTitle,
  metaUrl,
  isIOS,
}, ref) {
  // const playerRef = useRef(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // --- iOS autoplay handling ---------------------------------------------
  // iOS Safari only honors programmatic unMute() when it runs synchronously
  // inside a direct user-gesture handler (e.g. a card's own onClick) --
  // never from onReady, onStateChange, or any other async player-API
  // callback, no matter how quickly that fires after the tap.
  //
  // So the muted dummy player is mounted unconditionally on iOS the moment
  // this component mounts (not gated on `open`), and kept running in the
  // background even while the modal is closed. When a video card is
  // tapped, ContentPage calls playVideoRequest() (exposed via this
  // component's ref) *directly inside that tap's click handler* --
  // loadVideoById()/unMute()/playVideo() all run there, synchronously,
  // inside the real gesture, which is the one thing iOS actually honors.
  const [currentVideoId, setCurrentVideoId] = useState(isIOS ? DUMMY_VIDEO_ID : null);
  const [player, setPlayer] = useState(null);
  // loadVideoById() starts an async load; an unMute() called immediately
  // after (in the same synchronous tick, still inside the tap gesture)
  // can land on the player before the new video has actually finished
  // loading, and get reset back to muted once it does. This flag says
  // "we just asked to unmute as part of a real gesture" so onStateChange
  // can re-apply unMute() once the swapped-in video actually starts
  // buffering/playing -- not a new gesture, just re-confirming one that's
  // already in flight from the original tap.
  const pendingUnmuteRef = useRef(false);
  // Same idea as pendingUnmuteRef, but for resuming a previously-watched
  // video's saved position: loadVideoById({ startSeconds }) can silently
  // ignore that startSeconds while the video is still in its initial
  // unstarted/cueing state (right when attemptSwap runs, inside the tap).
  // Holds the target second to seek to once onStateChange sees the video
  // actually reach a loaded state; cleared once applied.
  const pendingSeekSecondsRef = useRef(null);
  // Tracks a pending retry of the swap call below, so it can be cancelled
  // if the modal closes (tearing the player down) before it fires --
  // otherwise it would throw trying to call methods on a destroyed player.
  const retryTimeoutRef = useRef(null);
  // If a card is tapped before the background dummy player has fired
  // onReady yet (e.g. a page like Recents/Favorites was just mounted and
  // the click lands within the first moment), playVideoRequest() has no
  // player to call yet. Without this, that tap is silently dropped and
  // the dummy video is left playing instead of the requested one. This
  // records the request so the onReady handler below can apply it as soon
  // as the player becomes available.
  const pendingVideoIdRef = useRef(null);
  // Paired with pendingVideoIdRef -- the resumeSeconds passed alongside it
  // to playVideoRequest(), replayed together once the player is ready.
  const pendingVideoResumeSecondsRef = useRef(undefined);
  const [isFavorited, setIsFavorited] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [timerDuration, setTimerDuration] = useState(null);
  const [resumingTime, setResumingTime] = useState(null);
  const [isTimerSet, setIsTimerSet] = useState(false);
  const timerRef = useRef(null);
  const closeReportModal = () => setIsReportModalOpen(false);
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

  useEffect(() => {
    const checkFavoriteStatus = () => {
      const favorites = FavoriteVideosStore.getRawState().favoriteVideos || [];
      const isVideoFavorited = Array.isArray(favorites) && favorites.some((video) => video.ytVideoId === videoId);
      setIsFavorited(isVideoFavorited);
    };

    checkFavoriteStatus();

    window.addEventListener('favoritesUpdated', checkFavoriteStatus);

    return () => {
      window.removeEventListener('favoritesUpdated', checkFavoriteStatus);
    };
  }, [videoId]);

  const handleAddFavorite = async () => {
    const videoDetails = {
      slug: attributes.slug,
      title: videoTitle || attributes.title,
      ytVideoId: videoId || attributes.ytVideoId,
      sourceLogoUrl: attributes.sourceLogoUrl,
      addedAt: new Date().toISOString()
    };

    const newFavoritedState = !isFavorited;
    const fullUrl = window.location.href;

    if (newFavoritedState) {
      await addFavoriteVideo(videoDetails, fullUrl);
    } else {
      await removeFavoriteVideo(videoId || attributes.ytVideoId);
    }

    setIsFavorited(newFavoritedState);
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { videoId: videoId || attributes.ytVideoId } }));
  };

  // Exposed to ContentPage so it can call this *directly inside* a video
  // card's own onClick handler -- that's the one place a call to
  // loadVideoById()/unMute()/playVideo() runs synchronously inside a real
  // user gesture, which is what iOS actually requires. Returns true if it
  // handled the swap itself (so the caller doesn't also need to); false
  // means the dummy player isn't ready yet and the normal
  // open+videoId-driven effect below should just load the video normally.
  // Attempts the actual swap; retried briefly on failure since the YouTube
  // widget API can throw "Cannot read properties of null" when called
  // while the player is still mid-flight from a very recent previous
  // loadVideoById() (e.g. switching to a second video shortly after the
  // first started) -- its internal iframe reference is momentarily
  // unavailable, not permanently broken. The first attempt still runs
  // synchronously inside the tap that triggered it; only failed retries
  // are delayed.
  const attemptSwap = (playerObj, targetVideoId, attemptsLeft = 4, resumeSeconds = attributes.currentTime) => {
    try {
      // Resume a previously-watched video's saved progress. This used to
      // be the opts.playerVars.start prop instead, but that has to stay
      // pinned at 0 on iOS now (see the opts comment below) so it can't be
      // used for this. A separate seekTo() call right after loadVideoById()
      // doesn't work either -- the YouTube widget can silently ignore a
      // seek while the newly-loaded video is still in its initial
      // unstarted/cueing state, which is exactly when this runs. Passing
      // startSeconds as part of the loadVideoById() call itself is the
      // supported way to start a freshly loaded video partway through.
      // resumeSeconds defaults to the attributes prop for callers where
      // that's already current (the sync-effect fallback and onReady's
      // pending-request replay both run after modalData/attributes has
      // been committed) -- playVideoRequest() instead passes it explicitly
      // since it runs *before* that prop update lands.
      const startSeconds = targetVideoId !== DUMMY_VIDEO_ID && resumeSeconds
        ? Math.floor(resumeSeconds)
        : undefined;
      playerObj.loadVideoById({ videoId: targetVideoId, startSeconds });
      if (startSeconds) {
        pendingSeekSecondsRef.current = startSeconds;
      }
      playerObj.unMute();
      playerObj.playVideo();
      // loadVideoById() starts an async load -- the unMute() above can
      // land before that finishes and get reset back to muted once it
      // does. Mark that an unmute is in flight so onStateChange can
      // re-apply it once the new video actually starts
      // buffering/playing; this doesn't need a fresh gesture, it's
      // just re-confirming the one already granted by this tap.
      pendingUnmuteRef.current = true;
      // Record the swap in state so the videoId-sync effect below sees
      // currentVideoId === videoId and skips its own fallback
      // loadVideoById() call -- without this, that effect keeps re-firing
      // this same swap on every render (its currentVideoId check never
      // matched because nothing ever updated currentVideoId), calling
      // loadVideoById() a second time back-to-back with this one and
      // racing it, which is what caused the intermittent
      // "Cannot read properties of null" failures on a second video tap.
      setCurrentVideoId(targetVideoId);
    } catch (error) {
      if (attemptsLeft > 0) {
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null;
          attemptSwap(playerObj, targetVideoId, attemptsLeft - 1, resumeSeconds);
        }, 150);
      } else {
        console.error("attemptSwap failed after retries:", error);
      }
    }
  };

  useImperativeHandle(ref, () => ({
    // resumeSeconds is optional and, when passed, takes priority over the
    // attributes prop inside attemptSwap -- callers invoke this before
    // updating the state that feeds that prop (see the comment at each
    // call site), so the prop is still last render's value at this point.
    playVideoRequest: (requestedVideoId, resumeSeconds) => {
      if (!isIOS) return false;
      if (player && currentVideoId !== requestedVideoId) {
        attemptSwap(player, requestedVideoId, undefined, resumeSeconds);
        return true;
      }
      // Player not ready yet (e.g. tapped a card right after this page
      // mounted, before the dummy player's onReady fired) -- stash the
      // request so onReady can apply it the moment the player exists,
      // instead of silently dropping it and leaving the dummy playing.
      if (!player) {
        pendingVideoIdRef.current = requestedVideoId;
        pendingVideoResumeSecondsRef.current = resumeSeconds;
        return true;
      }
      return false;
    },
  }), [isIOS, player, currentVideoId]);

  // Safety net: cancel any pending swap retry if this component unmounts
  // directly (bypassing handleModalClose), so it can never fire against a
  // torn-down player.
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      pendingVideoIdRef.current = null;
      pendingVideoResumeSecondsRef.current = undefined;
      pendingSeekSecondsRef.current = null;
    };
  }, []);

  // Keeps currentVideoId in sync with what's actually loaded. On iOS the
  // dummy player is already running in the background (mounted at initial
  // state above) and playVideoRequest() above does the real swap+unmute
  // synchronously inside the card's click handler -- this effect only
  // needs to record that swap in state, or handle the (non-iOS, or iOS
  // fallback) case where nothing swapped it yet.
  useEffect(() => {
    if (!open || !videoId) return;

    if (currentVideoId === videoId) return;

    if (!isIOS) {
      setCurrentVideoId(videoId);
      return;
    }

    // iOS: playVideoRequest() should have already swapped the dummy player
    // over during the click handler (and already called setCurrentVideoId
    // itself, so this effect wouldn't even get this far for that swap).
    // This only runs as a fallback for the rare case where that didn't
    // happen (e.g. the dummy player wasn't ready yet on the very first
    // open) -- reuses the same retrying swap so it doesn't race a second,
    // competing loadVideoById() call against one already in flight. Won't
    // reliably unmute, since it's no longer inside the original click's
    // synchronous gesture, but keeps the correct video showing.
    if (player) {
      attemptSwap(player, videoId);
    }
  }, [open, videoId, isIOS, currentVideoId, player]);

  const onReady = (e) => {
    setPlayer(e.target);

    if (pendingVideoIdRef.current) {
      const requestedVideoId = pendingVideoIdRef.current;
      const resumeSeconds = pendingVideoResumeSecondsRef.current;
      pendingVideoIdRef.current = null;
      pendingVideoResumeSecondsRef.current = undefined;
      attemptSwap(e.target, requestedVideoId, undefined, resumeSeconds);
    }
  };

  const onError = (e) => {
    console.error("YouTube player error:", e.data);
  };

  const onStateChange = (e) => {
    // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused,
    // 3 buffering, 5 video cued. Once the swapped-in video actually
    // starts loading, re-apply unMute() -- if the first call (right after
    // loadVideoById()) landed before the new video finished loading, the
    // player can silently reset back to muted once it does.
    if (pendingUnmuteRef.current && (e.data === window.YT?.PlayerState?.PLAYING || e.data === 1 || e.data === 3 || e.data === 5)) {
      pendingUnmuteRef.current = false;
      try {
        e.target.unMute();
        e.target.playVideo();
      } catch (error) {
        console.error("re-confirm unMute failed:", error);
      }
    }

    // Same re-confirm idea for resuming a saved position: loadVideoById()'s
    // own startSeconds can get silently dropped if it landed while the
    // video was still unstarted/cueing. Unlike the unmute re-confirm above,
    // a seekTo() fired as soon as BUFFERING (3) is reached still isn't
    // reliable -- the media pipeline hasn't caught up yet at that point, so
    // the position visibly lands for an instant and then snaps back to 0 as
    // buffering continues. Only PLAYING (1) is actually safe to seek on.
    if (pendingSeekSecondsRef.current !== null && (e.data === window.YT?.PlayerState?.PLAYING || e.data === 1)) {
      const seconds = pendingSeekSecondsRef.current;
      pendingSeekSecondsRef.current = null;
      try {
        e.target.seekTo(seconds, true);
      } catch (error) {
        console.error("re-confirm seekTo failed:", error);
      }
    }
  };

  const onEnd = (e) => {
    if (!player) return;

    // Defensive: the background dummy player (running while the modal is
    // closed, or right after resetting back to it) should never end up
    // audibly playing. loop:1 + playlist normally keeps it looping without
    // ever firing onEnd, but if it ever does, re-mute before replaying so
    // it can't slip into an unmuted state on its own.
    if (isIOS && currentVideoId === DUMMY_VIDEO_ID) {
      player.mute();
      player.playVideo();
      return;
    }

    if (open) {
      player.playVideo();
    }
  };

  // CSS for hiding and showing modal
  const handleModalClose = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (player) {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      updateVideoProgress(videoId, currentTime, duration);

      // On iOS, swap back to the muted dummy and keep it playing in the
      // background (instead of tearing the player down) so the next card
      // tap has an already-running, already-unlocked player to swap again
      // -- tearing it down here would mean starting cold (and muted-only)
      // next time. Non-iOS just stops, no background player to maintain.
      if (isIOS) {
        try {
          player.loadVideoById(DUMMY_VIDEO_ID);
          player.mute();
          player.playVideo();
        } catch (error) {
          console.error("reset-to-dummy failed:", error);
        }
        setCurrentVideoId(DUMMY_VIDEO_ID);
      } else {
        player.stopVideo();
        setCurrentVideoId(null);
        setPlayer(null);
      }
    }

    setTimerDuration(null);
    setResumingTime(null);
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
                    // Keep the same player instance across every video swap
                    // on iOS (remounting would create a fresh iframe, even
                    // less likely to carry over any autoplay state).
                    key={isIOS ? "ios-player" : currentVideoId}
                    // On iOS, this must NEVER change after mount: react-youtube
                    // watches its own `videoId` prop and calls its own
                    // internal loadVideoById() whenever it changes (see
                    // react-youtube's updateVideo()/componentDidUpdate) --
                    // racing against our manual loadVideoById()/unMute()/
                    // playVideo() in playVideoRequest() and silently
                    // breaking the swap (confirmed via a
                    // "Cannot read properties of null" error from
                    // youtube's widget API when both calls landed close
                    // together). So on iOS the prop stays pinned to the
                    // dummy id forever; playVideoRequest()'s manual player
                    // API calls are the *only* thing that ever changes what
                    // video is actually loaded. Non-iOS has no such
                    // conflict and keeps following currentVideoId normally.
                    videoId={isIOS ? DUMMY_VIDEO_ID : currentVideoId}
                    opts={{
                      playerVars: {
                        autoplay: 1,
                        playsinline: 1, // forbid fullscreen on ios
                        fs: 0,
                        // loop:1 + playlist would keep this player looping
                        // back to the dummy video forever -- fine while
                        // it's just the background dummy, but on iOS this
                        // videoId prop never changes (see the comment
                        // below), so that config would stay in effect even
                        // after playVideoRequest() swaps in a real video
                        // via the player API, and YouTube can silently
                        // re-sync back to its own playlist (the dummy)
                        // while the swapped-in video is still buffering.
                        // The dummy's own looping is instead handled
                        // manually in onEnd below, so this isn't needed on
                        // iOS at all; non-iOS has no swap-in-place setup so
                        // looping back to the same single video is fine.
                        ...(isIOS ? {} : { loop: 1, playlist: currentVideoId }),
                        modestbranding: 1,
                        showinfo: 0,
                        // Only matters at initial mount -- runtime mute/
                        // unmute afterwards goes through player.mute()/
                        // unMute() calls instead.
                        mute: isIOS ? 1 : 0,
                        rel: 0,
                        iv_load_policy: 3,
                        // On iOS this must stay pinned at 0, like videoId
                        // above -- react-youtube's own componentDidUpdate
                        // (shouldUpdateVideo) compares opts.playerVars.start
                        // across renders and, if it differs (e.g. a
                        // previously-watched recent video's saved
                        // currentTime vs. 0 for the dummy), fires its own
                        // loadVideoById() using the videoId *prop*, which is
                        // permanently DUMMY_VIDEO_ID on iOS -- silently
                        // reloading the dummy right after our manual swap in
                        // attemptSwap(). Resuming a real video's saved
                        // progress on iOS is instead done with player
                        // .seekTo() inside attemptSwap.
                        start: isIOS ? 0 : Math.floor(attributes.currentTime || 0),
                      },
                    }}
                    onReady={onReady}
                    onEnd={onEnd}
                    onError={onError}
                    onStateChange={onStateChange}
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
                            <div
                             className={styles.menulink} onClick={async () => { await handleAddFavorite(); handleClose(); }}>
                              <div className={styles.menudetails}>
                                <span className={styles.icon}>
                                  <IonIcon
                                    icon={isFavorited ? heart : heartOutline}
                                    slot="start"
                                    className={isFavorited ? styles.favorite : ""}
                                  />
                                </span>
                                <span className={styles.text}>{isFavorited ? "Remove Favourite" : "Add Favourite"}</span>
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
        </Fade>
      </Modal>
    </>
  );
});

export default PlayerModal;
