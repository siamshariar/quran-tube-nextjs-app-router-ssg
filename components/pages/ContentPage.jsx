import React, { useState, useEffect, useRef } from "react";
import { server, constants } from "../../lib/config";
import PlayerModal from "./modal/PlayerModal";
import Meta from "../core/Meta";
import ChipBar from "../ui/ChipBar";
import VideoCard from "../cards/home-video";
import Loader from "../utils/Loader";
import useOnScreen from "../../hooks/useOnScreen";
import localizationData from '../../public/pagemenudata.json';
import styles from "./Home.module.css";
import classNames from "classnames";
import {UIStore} from "../../store";
import withChipbarStyles from "./QuranTranslations.module.css";
import {getVideosDataByUrl} from "../../lib/fetch";

export default function ContentPage({ getUrl, defaultMetaTitle, metaDescription, isDisplayLocalizationChipBar, isShorts }) {
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

    // Load more data when the user scrolls to the bottom of the page
    useEffect(() => {
        if (isVisible && !isLoadingMore && data.pagination.c !== null) {
            setIsloadingMore(true);
            const url = getUrl(data.pagination, searchParam !== "" ? searchParam : activeSubCat, fromDateParam, toDateParam);
            fetchData(url, true);
        }
    }, [isVisible]);

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

        setVideoId(null);
        setVideoTitle(null);
        setVideoType(null)
    };

    const openModal = (ytVideoId, title, videoType, slug, e) => {
        if (e) {
            e.preventDefault();
        }

        if (ytVideoId === videoId) {
            return;
        }
        setVideoId(ytVideoId);
        setVideoTitle(title);
        setVideoType(videoType)

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

    return (
        <>
            <Meta title={metaTitle} description={metaDescription} url={metaUrl} image={metaImage} statusBarColor={metaStatusBarColor} type="website" />
            <PlayerModal open={modalOpen} closer={handleModalClose} videoId={videoId} videoTitle={videoTitle} videoType={videoType} metaTitle={metaTitle} metaUrl={metaUrl} isIOS={isIOS} />
            <div className={styles.wrapper}>
                {isDisplayLocalizationChipBar && (
                    <div className={classNames(styles.header, isMini ? styles.mini : "", "chipbar")}>
                        <ChipBar activeId={activeSubCat} subCatClickHandler={subCatClickHandler} pathname={pathname} />
                    </div>
                )}
                <div className={`${styles.container} ${isDisplayLocalizationChipBar ? withChipbarStyles.withChipbar : ""} ${isShorts ? styles.shortsContainer : ""}`}>
                    <div className={styles.content} ref={containerRef}>
                        {data.videos.map((video, index) => (
                            <div className={isShorts ? styles.shortsItem : styles.item} key={index}>
                                <VideoCard
                                    attributes={video}
                                    handleClick={(e) => openModal(video.ytVideoId, video.title, video.ytVideoType, video.slug, e)}
                                    isShorts={isShorts}
                                    pathname={pathname}
                                    urlParams={params}
                                />
                            </div>
                        ))}
                        {!isLoadingMore && data.videos.length < 1 && <p className={styles.tmpMsg}>
                            {isOnline ? "No content available!" : "No Internet connection!"}
                        </p>}
                        <div ref={ref} className={styles.loader}>{isLoadingMore && <Loader />}</div>
                        {/*<span style={{fontSize: `20px`}} ref={ref}>Server maintenance in progress. Will get back soon InshaAllah!</span>*/}
                    </div>
                </div>
            </div>
        </>
    );
};
