import styles from "./Home.module.css";
import classNames from "classnames";
import { UIStore, setPreviewContainer } from "../../../store";
import { youtube, constants, server } from "../../../lib/config";
import {
  getVideosDataByUrl,
  getYoutubeVideoDetailsByUrl,
} from "../../../lib/fetch";
import { useState, useEffect, useRef } from "react";
import Layout from "../../core/Layout";
import VideoCard from "../../cards/Video";
import ChipBar from "../../ui/ChipBar";
import Loader from "../../utils/Loader";
import useOnScreen from "../../../hooks/useOnScreen";
import PlayerModal from "../modal/PlayerModal";
import Meta from "../../core/Meta";

const getUrl = (pagination) => {
  let page = pagination.page ? pagination.page : 1;
  if (Object.keys(pagination).length !== 0 && pagination.page < pagination.pageCount) {
    page += 1;
  }

  console.log("page: " + page);
  return `https://ad.deeniinfotech.com/api/contents?pagination[page]=${page}&pagination[pageSize]=${constants.DEFAULT_PAGE_LIMIT}&sort[0]=contentPublishedAt:desc&fields[0]=id&fields[1]=ytVideoId&fields[2]=slug&fields[3]=title&fields[4]=contentPublishedAt&fields[5]=sourceLogoUrl&filters[status][$eq]=Approved&filters[sourceType][$eq]=YouTube&filters[dataContentType][$eq]=Quran Arabic&filters[dataContentType][$eq]=Quran Translation&filters[dataContentType][$eq]=Quran Learning`;
};

const Home = () => {
  const isMini = UIStore.useState((s) => s.isMiniNav);
  const ref = useRef();
  const isVisible = useOnScreen(ref);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [data, setData] = useState({ pagination: {}, videos: [] });
  const containerRef = useRef(null);

  useEffect(() => {
    const url = getUrl(data.pagination);
    const fetchData = async () => {
      const res = await getVideosDataByUrl(url);
      setData({
        pagination: res.meta.pagination,
        videos: res.data,
      });
      setIsLoadingMore(false);
    };
    fetchData().catch(console.error);
  }, [data.pagination]); // Added data.pagination

  useEffect(() => {
    if (isVisible && !isLoadingMore && data.pagination.page < data.pagination.pageCount) {
      setIsLoadingMore(true);
      const url = getUrl(data.pagination);
      const fetchData = async () => {
        const res = await getVideosDataByUrl(url);
        setData((prevData) => ({
          pagination: res.meta.pagination,
          videos: [...prevData.videos, ...res.data],
        }));
        setIsLoadingMore(false);
      };
      fetchData().catch(console.error);
    }
  }, [isVisible, data.pagination, isLoadingMore]); // Added missing dependencies

  useEffect(() => {
    setPreviewContainer(containerRef.current);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const [videoDetail, setVideoDetail] = useState({});
  const [videoId, setVideoId] = useState();

  const handleClick = (id) => {
    const url = `${youtube.url}/videos?key=${youtube.key}&part=snippet,statistics&id=${id}`;
    const fetchData = async () => {
      const res = await getYoutubeVideoDetailsByUrl(url);
      setVideoDetail(res);
    };
    fetchData().catch(console.error);
    setVideoId(id);
    setModalOpen(true);
  };

  return (
    <>
      <Meta
        title=""
        description="Quran.Tube Homepage"
        url={server}
        image={`${server}/img/logo/default_share.png`}
        type="website"
      />
      <PlayerModal
        open={modalOpen}
        closer={handleModalClose}
        src={videoId}
        videoDetail={videoDetail}
      />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.content} ref={containerRef}>
            {data.videos.map((video, index) => (
              <div className={styles.item} key={index}>
                <VideoCard
                  handleClick={handleClick}
                  attributes={video.attributes}
                />
              </div>
            ))}
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
