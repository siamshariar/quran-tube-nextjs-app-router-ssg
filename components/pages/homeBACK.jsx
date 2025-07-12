import styles from "./Home.module.css";
import { UIStore, setPreviewContainer } from "../../store";
import { constants, server } from "../../lib/config";
import { getVideosDataByUrl } from "../../lib/fetch";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import VideoCard from "../cards/home-video";
import withChipbarStyles from "./QuranTranslations.module.css";
import Loader from "../utils/Loader";
import useOnScreen from "../../hooks/useOnScreen";
import ChipBar from "../ui/ChipBar";
import localizationData from '../../public/pagemenudata.json';
import PlayerModal from "./modal/PlayerModal";
import Meta from "../core/Meta";
import { usePathname, useSearchParams } from "next/navigation";
import {useRouter} from "next/router";

const getUrl = (pagination, activeSubCat) => {
    let page = pagination.page ? pagination.page : 1;
    if (Object.keys(pagination).length !== 0) {
        if (pagination.page < pagination.pageCount) {
            page = page + 1;
        }
    }

    return `https://ad.deeniinfotech.com/api/contents?pagination[page]=${page}&pagination[pageSize]=${constants.DEFAULT_PAGE_LIMIT
    }&sort[0]=contentPublishedAt:desc&fields[0]=id&fields[1]=ytVideoId&fields[2]=slug&fields[3]=title&fields[4]=contentPublishedAt&fields[5]=sourceLogoUrl&filters[status][$eq]=Approved&filters[sourceType][$eq]=YouTube&filters[dataContentType][$eq]=Quran Arabic&filters[dataContentType][$eq]=Quran Translation&filters[dataContentType][$eq]=Quran Learning${
        activeSubCat ? `&filters[localizationId][$eq]=${activeSubCat}` : ""
    }`;
};

const getVideoDetailsById = async (id) => {
    const url = `https://ad.deeniinfotech.com/api/contents/${id}?fields[0]=id&fields[1]=ytVideoId&fields[2]=slug&fields[3]=title&fields[4]=contentPublishedAt&fields[5]=sourceLogoUrl&filters[status][$eq]=Approved`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Failed to fetch video details');
    }
    return await res.json();
};

const Home = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const slug = searchParams.get("v"); // Get the "v" parameter value

    const router = useRouter();
    const ref = useRef();
    const isVisible = useOnScreen(ref);
    const containerRef = useRef(null);

    const isMini = UIStore.useState((s) => s.isMiniNav);
    const [isLoadingMore, setIsloadingMore] = useState(true);
    const [videoId, setVideoId] = useState();
    const [videoTitle, setVideoTitle] = useState();
    const [videoUrl, setVideoUrl] = useState();
    const [locales, setLocales] = useState([]);
    const [activeSubCat, setActiveSubCat] = useState();
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState({
        pagination: {},
        videos: [],
    });

    // Fetch localization data and initial API call in one useEffect
    useEffect(() => {
        const initializeData = async () => {
            setPreviewContainer(containerRef.current);

            // Get video detail if slug is not empty
            if (slug) {
                try {
                    const res = await getVideoDetailsById(getContentId(slug));
                    openModal(res.data.attributes.ytVideoId, res.data.attributes.title);
                } catch (error) {
                    console.error(error);
                }
            }

            // Fetch localization data
            const locales = localizationData;
            setLocales(locales.data);

            const localizationCode = getLastSegment(pathname);

            // Determine activeSubCat based on localizationCode
            let initialActiveSubCat = null;
            if (localizationCode) {
                const activeLocale = locales.data.find(
                    (locale) => locale.attributes.code === localizationCode
                );
                if (activeLocale) {
                    initialActiveSubCat = activeLocale.id;
                }
            }

            // Set activeSubCat if found, and perform initial API call
            setActiveSubCat(initialActiveSubCat);
            const initialUrl = getUrl({}, initialActiveSubCat);

            try {
                const res = await getVideosDataByUrl(initialUrl);
                setData({
                    pagination: res.meta.pagination,
                    videos: res.data,
                });
            } catch (error) {
                console.error(error);
            } finally {
                setIsloadingMore(false);
            }
        };

        initializeData();
    }, [slug, pathname]);

    // Load more data
    useEffect(() => {
        if (
            isVisible &&
            !isLoadingMore &&
            data.pagination.page < data.pagination.pageCount
        ) {
            setIsloadingMore(true);

            const url = getUrl(data.pagination, activeSubCat);

            const fetchData = async () => {
                const res = await getVideosDataByUrl(url);

                const newData = {
                    pagination: res.meta.pagination,
                    videos: [...data.videos, ...res.data],
                };

                setData(newData);
                setIsloadingMore(false);
            };

            fetchData().catch(console.error);
        }
    }, [isVisible]);

    const subCatClickHandler = (id) => {
        setActiveSubCat(id);
    };

    const getLastSegment = (pathname) => {
        if (!pathname) return null;
        const segments = pathname.split("/").filter(Boolean); // Split by "/" and remove empty elements
        return segments.length === 2 ? segments[1] : null; // If length is 2, return last segment
    };

    const handleModalClose = () => {
        setModalOpen(false);
        router.push(pathname, undefined, { shallow: true });
    };

    const openModal = (ytVideoId, title, slug) => {
        setVideoId(ytVideoId);
        setVideoTitle(title);

        if (slug) {
            const videoUrl = `${pathname}?v=${slug}`;
            setVideoUrl(videoUrl);
            router.push(videoUrl, undefined, { shallow: true });
        }

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
            {/*TODO: Update meta title & image on click video modal*/}
            <Meta
                title="Quran.Tube | Stream Quran Recitation Videos"
                description="Discover the beauty of Quran recitations through videos with Quran.tube. "
                url={server}
                image={`${server}/img/logo/default_share.png`}
                type="website"
            />

            <PlayerModal
                open={modalOpen}
                closer={handleModalClose}
                videoId={videoId}
                videoTitle={videoTitle}
                videoUrl={videoUrl}
            />

            <div className={styles.wrapper}>
                <div
                    className={classNames(
                        styles.header,
                        isMini ? styles.mini : "",
                        "chipbar"
                    )}
                >
                    <ChipBar
                        locales={locales}
                        activeId={activeSubCat}
                        subCatClickHandler={subCatClickHandler}
                        pathname={pathname}
                    />
                </div>
                <div className={`${styles.container} ${withChipbarStyles.withChipbar}`}>
                    <div className={styles.content} ref={containerRef}>
                        {data.videos.map((video, index) => (
                            <div className={styles.item} key={index}>
                                <VideoCard
                                    handleClick={() => openModal(video.attributes.ytVideoId, video.attributes.title, video.attributes.slug)}
                                    attributes={video.attributes}
                                />
                            </div>
                        ))}

                        {!isLoadingMore && data.videos.length < 1 && (
                            <p className={styles.tmpMsg}>
                                No content available for selected translation language!
                            </p>
                        )}
                        <div ref={ref} className={styles.loader}>
                            {isLoadingMore && <Loader />}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
