import React, { useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Modal.module.css";
import Share from "../../icons/share";
import ShareIcon from '@mui/icons-material/Share';
import { useRouter } from "next/router";
import { IonIcon } from "@ionic/react";
import { shareOutline } from "../../../icons";

export default function PlayerModal({ open, closer, src, attributes = {}, videoDetail }) {
  const playerRef = useRef(null);

  const ShareIcon = () => (
		<IonIcon icon={shareOutline} slot="start" class={styles.icon} />
	);
  const router = useRouter();

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtubePlayer", {
          height: "100%",
          width: "100%",
          videoId: src, 
          playerVars: {
            modestbranding: 1,
            showinfo: 0,
            autoplay: 1,
            mute: 0,
            loop: 1, 
            playlist: src, 
            rel: 0, 
            iv_load_policy: 3,
          },
        });
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <Modal
      open={open}
      onClose={() => {}}
      className="player-modal"
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
          <div className={styles.iframe_container}>
            <iframe
              id="youtubePlayer" 
              title={attributes.title || "Video Player"}  
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${src}?modestbranding=1&showinfo=0&autoplay=1&mute=0&loop=1&playlist=${src}&rel=0&iv_load_policy=3&autohide=1`}
              allowFullScreen
            ></iframe>
          </div>

  
          <div className={styles.title_area}>
            <h2>{videoDetail.title || "Loading..."}</h2>
            <Share Icon={ShareIcon} size={86} className={styles.icon2} url={router.asPath} title={attributes.title || "Quran Radio"} />
            <span className={styles.close} onClick={closer}>
              <CloseIcon />
            </span>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}
