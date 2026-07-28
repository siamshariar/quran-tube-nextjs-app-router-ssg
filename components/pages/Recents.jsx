"use client";

import { useEffect, useState } from "react";
import RecentCard from "../cards/RecentCard";
import PlayerModal from "./modal/PlayerModal";
import Meta from "../core/Meta";
import styles from "./Recents.module.css";
import { server } from "../../lib/config";
import { RecentVideosStore, loadRecentVideos, removeRecentVideo, moveVideoToTop } from "../../store/RecentVideosStore";
import { useStoreState } from "pullstate";

const Recents = () => {
  const recentVideos = useStoreState(RecentVideosStore, (s) => s.recentVideos);
  const [metaData, setMetaData] = useState({
    title: "Recents",
    url: "",
    image: "",
    statusBarColor: "#ffffff",
  });
  const [modalData, setModalData] = useState({
    open: false,
    videoId: null,
    videoTitle: null,
    videoType: null,
    attributes: {},
    fullUrl: null,
  });
  const [isVideosLoaded, setIsVideosLoaded] = useState(false);
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  useEffect(() => {
    const loadVideos = async () => {
      await loadRecentVideos()
      setIsVideosLoaded(true);

    const urlParams = new URLSearchParams(window.location.search);
    const videoSlug = urlParams.get("v");

    if (videoSlug) {
      const video = recentVideos.find((v) => v.slug === videoSlug);

      if (video) {
        openModal(video.ytVideoId, video.title, video.type, video.slug, video.pathname, video, video.fullUrl);
      } else {
        console.error("Video not found for slug:", videoSlug);
      }
    }
  }

    loadVideos()
  }, [])

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const openModal = (ytVideoId, title, videoType, slug, pathname, attributes, fullUrl) => {
    const recent = recentVideos.find(video => video.ytVideoId === ytVideoId);
    const finalFullUrl = fullUrl || (recent ? recent.fullUrl : `${server}/recents?v=${slug || ytVideoId}`);
  
    // Check if this is a new tab scenario
    if (window.opener) {
      window.location.href = finalFullUrl;
      return;
    }
  
    setModalData({
      open: true,
      videoId: ytVideoId,
      videoTitle: title,
      videoType,
      attributes,
      fullUrl: finalFullUrl,
    });
  
    window.history.replaceState(null, "", finalFullUrl);
  
    setMetaData({
      title,
      url: finalFullUrl,
      image: `https://i.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`,
      statusBarColor: "#000000",
    });
  
    moveVideoToTop(ytVideoId);
  };

  const handleModalClose = () => {
    setModalData({
      open: false,
      videoId: null,
      videoTitle: null,
      videoType: null,
      attributes: {},
      fullUrl: null,
    });

    const newUrl = `/recents`;
    window.history.replaceState(null, "", newUrl);

    setMetaData({
      title: "Recents",
      url: newUrl,
      image: "",
      statusBarColor: "#ffffff",
    });
  };

  const handleRemoveRecent = async (ytVideoId) => {
    console.log(`Removing video with ytVideoId: ${ytVideoId}`);
    await removeRecentVideo(ytVideoId);
  };

  const groupVideosByDate = (videos) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const grouped = {
      today: [],
      yesterday: [],
      older: {},
    };

    videos.forEach((video) => {
      const addedDate = new Date(video.addedAt);
      if (!isNaN(addedDate)) {
        if (isSameDay(addedDate, today)) {
          grouped.today.push(video);
        } else if (isSameDay(addedDate, yesterday)) {
          grouped.yesterday.push(video);
        } else {
          const dateKey = addedDate.toISOString().split("T")[0];
          if (!grouped.older[dateKey]) {
            grouped.older[dateKey] = [];
          }
          grouped.older[dateKey].push(video);
        }
      } else {
        console.error("Invalid date:", video.addedAt);
      }
    });

    grouped.older = Object.keys(grouped.older)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((sorted, dateKey) => {
        sorted[dateKey] = grouped.older[dateKey];
        return sorted;
      }, {});

    return grouped;
  };

  const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const grouped = groupVideosByDate(recentVideos);

  const noRecentVideos = recentVideos.length === 0;

  return (
    <>
      <Meta
        title="Recents | Quran Tube"
        url={metaData.url}
        image={metaData.image}
        statusBarColor={metaData.statusBarColor}
        type="website"
      />
      <div className={styles.container}>
        <div className={styles.item}>
      <div className={styles.cardContainer}>
  {isVideosLoaded &&
    ["today", "yesterday"].map((group) => {
      if (grouped[group].length > 0) {
        return (
          <div key={group} className={styles.group}>
            <h3 className={styles.dateTitle}>
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </h3>
            <div className={styles.videoList}>
              {grouped[group].map((video) => (
                <RecentCard
                  key={video.slug}
                  item={video}
                  handleRemoveRecent={handleRemoveRecent}
                  urlParams={urlParams}
                  openModal={() =>
                    openModal(
                      video.ytVideoId,
                      video.title,
                      video.type,
                      video.slug,
                      video.pathname,
                      video,
                      video.fullUrl,
                    )
                  }
                />
              ))}
            </div>
          </div>
        );
      }
      return null;
    })}

  {Object.keys(grouped.older).map((dateKey) => (
    <div key={dateKey} className={styles.group}>
      <h3 className={styles.dateTitle}>
        {new Date(dateKey).toLocaleDateString("en-US", {
          weekday: "short", // "Thu"
          month: "short",   // "Jan"
          day: "2-digit",   // "02"
          year: "numeric",  // "2025"
        })}
      </h3>
      <div className={styles.videoList}>
        {grouped.older[dateKey].map((video) => (
          <RecentCard
            key={video.slug}
            item={video}
            handleRemoveRecent={handleRemoveRecent}
            urlParams={urlParams}
            openModal={() =>
              openModal(
                video.ytVideoId,
                video.title,
                video.type,
                video.slug,
                video.pathname,
                video,
                video.fullUrl,
              )
            }
          />
        ))}
      </div>
    </div>
  ))}

    {isVideosLoaded && noRecentVideos && (
      <h2 className={styles.noRecents}>No Recents found!</h2>
    )}
  </div>
</div>
      </div>
      <PlayerModal
        open={modalData.open}
        closer={handleModalClose}
        videoId={modalData.videoId}
        videoTitle={modalData.videoTitle}
        videoType={modalData.videoType}
        attributes={modalData.attributes} // Pass the attributes to PlayerModal
        fullUrl={modalData.fullUrl}
        isIOS={isIOS}
      />
    </>
  );
};

export default Recents;
