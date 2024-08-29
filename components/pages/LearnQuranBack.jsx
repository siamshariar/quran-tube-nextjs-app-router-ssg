import styles from "./Home.module.css";
import classNames from "classnames";
import { UIStore, setPreviewContainer } from "../../store";
import { youtube, constants, server } from "../../lib/config";
import {
  getAllPlaylists2,
  getVideosDataByUrl,
  getYoutubeVideoDetailsByUrl,
  getYoutubeVideoListByUrl,
} from "../../lib/fetch";
import { useState, useEffect, useRef } from "react";
import Layout from "../core/Layout";
import VideoCard from "../cards/Video";
import ChipBar from "../ui/ChipBar";
import Loader from "../utils/Loader";
import useOnScreen from "../../hooks/useOnScreen";
import PlayerModal from "./modal/PlayerModal";
import Meta from "../core/Meta";
import { FixedSizeList as List } from "react-window";
import otherStyles from "./QuranTranslations.module.css";

const getUrl = (pagination) => {
  let page = pagination.page ? pagination.page : 1;
  if (Object.keys(pagination).length !== 0) {
    if (pagination.page < pagination.pageCount) {
      page = page + 1;
    }
  }

  console.log("page: " + page);

  return `https://dbe.alquranarabia.com/api/contents?pagination[page]=${page}&pagination[pageSize]=${constants.DEFAULT_PAGE_LIMIT}&sort[0]=contentPublishedAt:desc&fields[0]=id&fields[1]=ytVideoId&fields[2]=slug&fields[3]=title&fields[4]=contentPublishedAt&filters[sourceType][$eq]=YouTube&filters[dataContentType][$eq]=Quran Learning&filters[status][$eq]=Approved`;
};

const LearnQuran = () => {
  const isMini = UIStore.useState((s) => s.isMiniNav);

  const ref = useRef();
  const isVisible = useOnScreen(ref);
  const [isLoadingMore, setIsloadingMore] = useState(true);

  const [data, setData] = useState({
    pagination: {},
    videos: [],
  });

  useEffect(() => {
    const url = getUrl(data.pagination);

    const fetchData = async () => {
      const res = await getVideosDataByUrl(url);
      setData({
        pagination: res.meta.pagination,
        videos: res.data,
      });
      setIsloadingMore(false);
    };

    fetchData().catch(console.error);
  }, []);
  console.log(data);

  useEffect(() => {
    if (
      isVisible &&
      !isLoadingMore &&
      data.pagination.page < data.pagination.pageCount
    ) {
      setIsloadingMore(true);

      const url = getUrl(data.pagination);

      const fetchData = async () => {
        const res = await getVideosDataByUrl(url);

        const newData = {
          pagination: res.meta.pagination,
          videos: [...data.videos, ...res.data],
        };

        setData(newData);
        // setIsloadingMore(false);
      };

      fetchData().catch(console.error);
    }
  }, [isVisible, isLoadingMore]);
  console.log("isVisible: " + isVisible, isLoadingMore);

  const containerRef = useRef(null);

  useEffect(() => {
    setPreviewContainer(containerRef.current);
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => {
    setModalOpen(false);
  };

  const openModal = () => {
    setModalOpen(true);
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
    openModal();
  };

  const Cell = ({ columnIndex, rowIndex, data }) => (
    <div className={otherStyles.Cell} key={rowIndex}>
      <VideoCard
        handleClick={handleClick}
        attributes={data[rowIndex].attributes}
      />
    </div>
  );

  const Item = ({ index, style, data }) => (
    <div className={otherStyles.Cell} key={index}>
      <VideoCard
        handleClick={handleClick}
        attributes={data[index].attributes}
      />
    </div>
  );

  return (
    <>
      <Meta
        title="Learn Quran"
        description="Quran.Tube"
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
        {/*<div*/}
        {/*  className={classNames(*/}
        {/*    styles.header,*/}
        {/*    isMini ? styles.mini : "",*/}
        {/*    "chipbar"*/}
        {/*  )}*/}
        {/*>*/}
        {/*  <ChipBar />*/}
        {/*</div>*/}

        <div className={styles.container}>
          <div className={styles.content} ref={containerRef}>
            {/* {data.videos.map((video, index) => (
              <div className={styles.item} key={index}>
                <VideoCard
                  handleClick={handleClick}
                  attributes={video.attributes}
                />
              </div>
            ))} */}

            <List
              height={500}
              itemCount={data.videos.length}
              itemSize={35}
              width="100%"
              itemData={data.videos}
              className={otherStyles.Grid}
            >
              {Item}
            </List>

            <div ref={ref} className={styles.loader}>
              {isLoadingMore && <Loader />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnQuran;
