import React, { useState, useEffect, useRef, useMemo } from "react";
import { server, constants } from "../../lib/config";
import PlayerModal from "./modal/PlayerModal";
import Meta from "../core/Meta";
import ChipBar from "../ui/ChipBar";
import ChipBarTaraweeh from "../ui/ChipBarTaraweeh";
import VideoCard from "../cards/home-video";
import Loader from "../utils/Loader";
import useOnScreen from "../../hooks/useOnScreen";
import localizationData from '../../public/pagemenudata.json';
import styles from "./Home.module.css";
import classNames from "classnames";
import {UIStore} from "../../store";
import withChipbarStyles from "./QuranTranslations.module.css";
import {getVideosDataByUrl} from "../../lib/fetch";
import { Virtuoso } from "react-virtuoso"

export default function ContentPage({ getUrl, defaultMetaTitle, metaDescription, isDisplayLocalizationChipBar, isShorts, taraweehPage }) {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const ref = useRef();
    const isVisible = useOnScreen(ref);
    const containerRef = useRef(null);
    const defaultMetaImage = `${server}/img/logo/default_share.png`;
    const defaultMetaStatusBarColor = "#ffffff";

    const isMini = UIStore.useState((s) => s.isMiniNav);
    const [isLoadingMore, setIsloadingMore] = useState(true);
    const [videoId, setVideoId] = useState();
    const [videoTitle, setVideoTitle] = useState();
    const [videoType, setVideoType] = useState();
    const [playerModalData, setPlayerModalData] = useState({
        attributes: {},
        videoId: null,
        videoTitle: null,
        videoType: null,
        metaTitle: null,
        metaUrl: null,
    });
    const [activeSubCat, setActiveSubCat] = useState();
    const [searchParam, setSearchParam] = useState();
    const [metaTitle, setMetaTitle] = useState();
    const [metaUrl, setMetaUrl] = useState();
    const [metaImage, setMetaImage] = useState();
    const [metaStatusBarColor, setMetaStatusBarColor] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({
        pagination: {},
        videos: [],
    });
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const initLocales = localizationData.data;
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const [toDateParam, setToDateParam] = useState(null);
    const [fromDateParam, setFromDateParam] = useState(null);
    const [favoriteStatuses, setFavoriteStatuses] = useState({});
    const virtuosoRef = useRef(null);

    const handleFavoriteChange = (videoId, isFavorited) => {
        setFavoriteStatuses(prev => ({
          ...prev,
          [videoId]: isFavorited
        }));
      };

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Clean up the event listeners
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Fetch localization data and initial API call in one useEffect
    useEffect(() => {
        const initializeData = async () => {
            let params = new URLSearchParams(window.location.search)
            let searchParam = pathname === "/search" ? params.get("s") || "" : "";
            const localizationCode = getLastSegment(pathname);
            let allType = params.get("t") || "";

            if (!isFirstLoad && !localizationCode && allType !=="all") return; // TODO: Hotfix render twice
            setIsFirstLoad(false);

            setMetaTitle(defaultMetaTitle)
            setMetaUrl(`${server}${pathname}`)
            setMetaImage(defaultMetaImage)
            setMetaStatusBarColor(defaultMetaStatusBarColor)

            searchParam = searchParam.trim();
            setSearchParam(searchParam);
            const slug = params.get("v");

            if (slug) {
                try {
                    const res = await getVideosDataByUrl(getVideoDetailUrl(getContentId(slug)));
                    openModal(res.ytVideoId, res.title, res.ytVideoType, null, null);
                } catch (error) {
                    console.error(error);
                }
            }

            let initialActiveSubCat = null;
            if (localizationCode) {
                const activeLocale = initLocales.find((locale) => locale.attributes.code === localizationCode);
                if (activeLocale) initialActiveSubCat = activeLocale.id;
            }

            setActiveSubCat(initialActiveSubCat);
            setIsloadingMore(true);

            const fromDate = params.get("from");
            const toDate = params.get("to");
            setFromDateParam(fromDate);
            setToDateParam(toDate);

            const initialUrl = getUrl({}, searchParam !== "" ? searchParam : initialActiveSubCat, fromDate, toDate);
            fetchData(initialUrl);
        };
        initializeData();
    }, [pathname]);

    const fetchData = async (url, isLoadMore) => {
        try {
            const res = await getVideosDataByUrl(url);
            setData({
                pagination: res.meta.pagination,
                videos: isLoadMore? [...data.videos, ...res.data] : res.data,
            });
        } catch (error) {
            // TODO: Display popup in case 429 Too Many Requests
            console.error(error);
        } finally {
            setIsloadingMore(false);
        }
    };

    const loadMore = () => {
        if (!isLoadingMore && data.pagination.c !== null) {
            setIsloadingMore(true);
            const url = getUrl(data.pagination, searchParam !== "" ? searchParam : activeSubCat, fromDateParam, toDateParam)
            fetchData(url, true);
        }
    };

    const getVideoDetailUrl = (id) => {
      return `${constants.API_URL}/contents/${id}`;
    }

    const subCatClickHandler = (id) => {
        setActiveSubCat(id);
    };

    const getLastSegment = (pathname) => {
        if (!pathname) return null;
        const segments = pathname.split("/").filter(Boolean);
        return segments.length === 2 ? segments[1] : null;
    };

    const handleModalClose = () => {
        setModalOpen(false);

        // Get current full path including query parameters
        const urlParams = new URLSearchParams(window.location.search);

        // Remove the 'v' parameter
        urlParams.delete('v');

        const updatedUrl = `${pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;

        setMetaTitle(defaultMetaTitle)
        setMetaUrl(`${server}${pathname}`)
        setMetaImage(defaultMetaImage)
        setMetaStatusBarColor(defaultMetaStatusBarColor)

        // Push the updated URL without ?v=<slug>
        window.history.replaceState(null, "", updatedUrl);

        setPlayerModalData({
            attributes: {},
            videoId: null,
            videoTitle: null,
            videoType: null,
            metaTitle: defaultMetaTitle,
            metaUrl: `${server}${pathname}`,
        });
    };

    const openModal = (ytVideoId, title, videoType, slug, e) => {
        if (e) {
            e.preventDefault();
        }

        if (ytVideoId === playerModalData.videoId) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        let videoUrl= `${pathname}?${urlParams.toString()}`;

        if (slug) {
            // Add or update the 'v' parameter with the new slug
            urlParams.set('v', slug);
            videoUrl = `${pathname}?${urlParams.toString()}`;

            // Push the updated URL with ?v=<slug>
            window.history.replaceState(null, "", videoUrl);
        }

        setMetaTitle(title)
        setMetaUrl(`${server}${videoUrl}`)
        setMetaImage(`https://i.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`)
        setMetaStatusBarColor("#000000")

        setPlayerModalData({
            attributes: data.videos.find(video => video.ytVideoId === ytVideoId),
            videoId: ytVideoId,
            videoTitle: title,
            videoType: videoType,
            metaTitle: title,
            metaUrl: `${server}${videoUrl}`,
        });

        setModalOpen(true);
    };

    const getContentId = (slug) => {
        if (!slug || typeof slug !== "string") {
            console.error("Invalid slug:", slug);
            return null;
        }
        const parts = slug.split("-");
        const lastThreeParts = parts.slice(-3);
        return lastThreeParts[1];
    };

    const getGroupedVideos = () => {
      const videos = data.videos || []
      const groupSize = getGroupSize()
      const groups = []

      const maxInitialGroups = 1
      const maxVideosToShow = maxInitialGroups * groupSize

      for (let i = 0; i < Math.min(videos.length, maxVideosToShow); i += groupSize) {
        groups.push(videos.slice(i, i + groupSize))
      }

      return groups
    }

    const getGroupSize = () => {
      if (typeof window === "undefined") return 1

      const width = window.innerWidth
      if (width >= 1024) return 4
      if (width >= 874) return 3
      if (width >= 588) return 2
      return 1
    }

    const groupedVideos = useMemo(() => getGroupedVideos(), [data.videos, isShorts])

    const renderGroup = (index) => {
      const group = groupedVideos[index]
      if (!group) return <div key={`empty-${index}`} />

      return (
        <div className={styles.content}>
          {data.videos.map((video) => (
            <div
              key={video.ytVideoId}
              className={`${isShorts ? styles.shortsItem : styles.item} ${styles.responsiveCard}`}
              style={{
                flex: `0 0 calc(${100 / getGroupSize()}% - 16px)`,
                margin: "8px",
                maxWidth: `calc(${100 / getGroupSize()}% - 16px)`,
              }}
            >
              <VideoCard
                attributes={video}
                handleClick={(e) => openModal(video.ytVideoId, video.title, video.ytVideoType, video.slug, e)}
                isShorts={isShorts}
                pathname={pathname}
                urlParams={params}
                isFavorited={favoriteStatuses[video.ytVideoId] || false}
                onFavoriteChange={handleFavoriteChange}
                setPlayerModalData={setPlayerModalData}
              />
            </div>
          ))}
        </div>
      )
    }

    const Footer = () => {
      return isLoadingMore ? (
        <div className={styles.loader}>
          <Loader />
        </div>
      ) : null
    }

    return (
        <>
            <Meta title={metaTitle} description={metaDescription} url={metaUrl} image={metaImage} statusBarColor={metaStatusBarColor} type="website" />
            <PlayerModal
                open={modalOpen}
                closer={handleModalClose}
                videoId={playerModalData.videoId}
                videoTitle={playerModalData.videoTitle}
                videoType={playerModalData.videoType}
                metaTitle={playerModalData.metaTitle}
                metaUrl={playerModalData.metaUrl}
                isIOS={isIOS}
                attributes={playerModalData.attributes}
                onFavoriteChange={handleFavoriteChange}
            />
            <div className={styles.wrapper}>
                {isDisplayLocalizationChipBar && (
                    <div className={classNames(styles.header, isMini ? styles.mini : "", "chipbar")}>
                        <ChipBar activeId={activeSubCat} subCatClickHandler={subCatClickHandler} pathname={pathname} />
                    </div>
                )}

                {taraweehPage && (
                    <div className={classNames(styles.header, isMini ? styles.mini : "", "chipbar")}>
                        <ChipBarTaraweeh activeId={activeSubCat} subCatClickHandler={subCatClickHandler} pathname={pathname} taraweehPage={taraweehPage} />
                    </div>
                )}
                <div
                    className={`${styles.container} ${isDisplayLocalizationChipBar || taraweehPage ? withChipbarStyles.withChipbar : ""} ${isShorts ? styles.shortsContainer : ""}`}>
                    {data.videos.length > 0 ? (
                    <div className={styles.content} ref={containerRef}>
                          <Virtuoso
                            ref={virtuosoRef}
                            useWindowScroll
                            data={groupedVideos}
                            endReached={loadMore}
                            overscan={200}
                            itemContent={renderGroup}
                            components={{
                              Footer,
                          }}
                            style={{ width: "100%", height: "100vh" }}
                            totalCount={groupedVideos.length}
                                />
                            </div>
                        ) : (
                        !isLoadingMore && ( <p className={styles.tmpMsg}>
                            {isOnline ? "No content available!" : "No Internet connection!"}
                        </p>)
                        )}
                        {/*<span style={{fontSize: `20px`}} ref={ref}>Server maintenance in progress. Will get back soon InshaAllah!</span>*/}
                </div>
            </div>
        </>
    );
};
