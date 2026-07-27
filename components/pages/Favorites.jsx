import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import FavoriteCard from "../cards/FavoriteCard";
import styles from "./Favorites.module.css";
import Meta from "../core/Meta";
import PlayerModal from "./modal/PlayerModal";
import { server } from "../../lib/config";
import Loader from "../utils/Loader";
import { FavoriteVideosStore, loadFavoriteVideos, removeFavoriteVideo } from "../../store/FavoriteVideosStore";
import { addRecentVideo, moveVideoToTop } from "../../store/RecentVideosStore";
import { useStoreState } from "pullstate";

const Favorites = () => {
  const favoriteVideos = useStoreState(FavoriteVideosStore, s => s.favoriteVideos);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef();
  const [isLoadingMore, setIsloadingMore] = useState(true);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [modalData, setModalData] = useState({
    open: false,
    videoId: null,
    videoTitle: null,
    videoType: null,
    videoSlug: null,
  });
  const [metaData, setMetaData] = useState({
    title: "Favorites",
    url: "",
    image: "",
    statusBarColor: "#ffffff",
  });

  const router = useRouter();
  const handleFavoriteChange = (videoId, isFavorited) => {
    setFilteredFavorites(prev => {
      if (isFavorited) {
        const newFavorite = favoriteVideos.find(video => video.ytVideoId === videoId);
        return [...prev, newFavorite];
      } else {
        return prev.filter(video => video.ytVideoId !== videoId);
      }
    });
  };

  useEffect(() => {
    loadFavoriteVideos();

    const urlParams = new URLSearchParams(window.location.search);
    const videoSlug = urlParams.get("v");

    if (videoSlug) {
      const video = favoriteVideos.find((v) => v.slug === videoSlug);

      if (video) {
        openModal(video.ytVideoId, video.title, video.type, video.slug);
      } else {
        console.error("Video not found for slug:", videoSlug);
      }
    }
  }, [favoriteVideos]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFavorites(favoriteVideos);
    } else {
      const filtered = favoriteVideos.filter((fav) =>
        fav.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFavorites(filtered);
    }
    setIsloadingMore(false);
  }, [searchTerm, favoriteVideos]);

  const openModal = (ytVideoId, title, videoType, slug) => {
    const favorite = favoriteVideos.find(video => video.ytVideoId === ytVideoId);
    const fullUrl = favorite ? favorite.fullUrl : `${server}/favorites?v=${slug || ytVideoId}`;
    
    setModalData({
      open: true,
      videoId: ytVideoId,
      videoTitle: title,
      videoType,
      videoSlug: slug || ytVideoId,
    });

    window.history.replaceState(null, "", fullUrl);

    setMetaData({
      title,
      url: fullUrl,
      image: `https://i.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`,
      statusBarColor: "#000000",
    });

    addRecentVideo({
      slug: slug || ytVideoId,
      title,
      ytVideoId,
      sourceLogoUrl: "",
      fullUrl: fullUrl,
      addedAt: new Date().toISOString(),
    });
    moveVideoToTop(ytVideoId);
  };

  const handleModalClose = () => {
    setModalData({
      open: false,
      videoId: null,
      videoTitle: null,
      videoType: null,
      videoSlug: null,
    });

    const newUrl = `/favorites`;
    window.history.replaceState(null, "", newUrl);

    setMetaData({
      title: "Favorites",
      url: newUrl,
      image: "",
      statusBarColor: "#ffffff",
    });
  };

  const handleRemoveFavorite = (item) => {
    removeFavoriteVideo(item.ytVideoId);
  };

  return (
    <>
      <Meta
        title="Favorites | Quran Tube"
        url={metaData.url}
        image={metaData.image}
        statusBarColor={metaData.statusBarColor}
        type="website"
      />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.item}>
            <div className={styles.cardContainer}>
              <div className={styles.content}>
                {filteredFavorites.length > 0 ? (
                  filteredFavorites.map((favorite, index) => (
                    <FavoriteCard
                      key={index}
                      item={favorite}
                      handleRemoveFavorite={handleRemoveFavorite}
                      openModal={() =>
                        openModal(
                          favorite.ytVideoId,
                          favorite.title,
                          favorite.type,
                          favorite.slug
                        )
                      }
                    />
                  ))
                ) : !isLoadingMore ? (
                  <h2 className={styles.noFavorites}>No favorites found!</h2>
                ) : null}
                <div ref={ref} className={styles.loader}>{isLoadingMore && <Loader />}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <PlayerModal
          open={modalData.open}
          closer={handleModalClose}
          videoId={modalData.videoId}
          videoTitle={modalData.videoTitle}
          videoType={modalData.videoType}
          slug={modalData.videoSlug}
          metaTitle={metaData.title}
          metaUrl={metaData.url}
          onFavoriteChange={handleFavoriteChange}
          fullUrl={modalData.fullUrl}
        />
    </>
  );
};

export default Favorites;