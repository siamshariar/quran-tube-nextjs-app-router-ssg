import jwt from 'jwt-simple';
import moment from 'moment-timezone';
import {constants, youtube, youtubeKeys} from "./config";

export const getAllPlaylists2 = async () => {
  const url = `${youtube.url}/playlists?key=${youtube.key}&part=snippet&channelId=${youtube.channelID}&maxResults=${constants.MAX_YOUTUBE_PAGE_LIMIT}`;
  const res = await getYoutubeResponseByUrl(url);

  let data = await res.json();
  let items = await data.items;
  const total = await data.pageInfo.totalResults;

  if (total > 50) {
    const numberOfRequests = Math.ceil(total / 50);
    for (let i = 1; i < numberOfRequests; i++) {
      let newURL = url + `&pageToken=${data.nextPageToken}`;
      let newRes = await fetch(newURL);
      data = await newRes.json();
      let newItems = await data.items;
      items = items.concat(newItems);
    }
  }

  let playlists = [];
  let playlistsTitle = {};

  let obj = {
    id: youtube.uploadPlaylistID,
    title: "লেকচার সমগ্র",
  };
  playlists.push(obj);
  playlistsTitle[youtube.uploadPlaylistID] = "লেকচার সমগ্র";

  items.forEach((item) => {
    let obj = {
      id: item.id,
      title: item.snippet.title,
    };
    playlists.push(obj);
    playlistsTitle[item.id] = item.snippet.title;
  });

  return {
    playlists,
    playlistsTitle,
  };
};

export const getYoutubeVideoListByUrl = async (url) => {
  const response = await getYoutubeResponseByUrl(url);
  const videosData = await response.json();
  const videoItems = await videosData.items;
  const nextPageToken = (await videosData.nextPageToken) || null;
  const totalVideos = await videosData.pageInfo.totalResults;
  const numberOfPages = Math.ceil(totalVideos / constants.DEFAULT_PAGE_LIMIT);
  let videos = [];
  let videoIds = "";
  let channelIds = "";

  videoItems.forEach((item) => {
    const title = item.snippet.title.toString();
    // TODO: Have to fix Private watch in better way
    if (
      title === "Private watch" ||
      title === "Private video" ||
      title === "Deleted video"
    ) {
      // TODO: Have to fix Private watch in better way
    } else {
      // TODO: If there thumbnail then DISPLAY A DEFAULT THUMBNAIL
      let image =
        typeof item.snippet.thumbnails.high !== "undefined"
          ? item.snippet.thumbnails.high.url
          : "";
      let obj = {
        id: item.snippet.resourceId.videoId,
        image: image,
        title: title,
        publishedAt: item.snippet.publishedAt,
        playlistId: item.snippet.playlistId,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
      };
      videos.push(obj);
      videoIds += "," + item.snippet.resourceId.videoId;
      channelIds += "," + item.snippet.channelId;
    }
  });

  const statsURL = `${youtube.url}/videos?key=${youtube.key}&part=statistics&id=${videoIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const statsRes = await getYoutubeResponseByUrl(statsURL);

  const videoStats = await statsRes.json();
  let videoStatistics = {};

  videoStats.items.forEach((item) => {
    videoStatistics[item.id] = item.statistics.viewCount;
  });

  const channelsURL = `${youtube.url}/channels?key=${youtube.key}&part=snippet&id=${channelIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const channelRes = await getYoutubeResponseByUrl(channelsURL);

  const channelsDetails = await channelRes.json();
  let channels = {};

  channelsDetails.items.forEach((item) => {
    channels[item.id] = item.snippet.thumbnails.default.url;
  });

  let videoLists = {
    nextPageToken: nextPageToken,
    numberOfPages: numberOfPages,
    videos: videos,
    videoStats: videoStatistics,
    channels: channels,
  };

  return videoLists;
};

export const getRelatedVideosByUrl = async (url) => {
  const response = await getYoutubeResponseByUrl(url);
  const videosData = await response.json();
  const videoItems = await videosData.items;
  const nextPageToken = (await videosData.nextPageToken) || null;
  const totalVideos = await videosData.pageInfo.totalResults;
  const numberOfPages = Math.ceil(totalVideos / constants.DEFAULT_PAGE_LIMIT);
  let videos = [];
  let videoIds = "";
  let channelIds = "";

  videoItems.forEach((item) => {
    const title = item.snippet.title.toString();
    // TODO: Have to fix Private watch in better way
    if (
      title === "Private watch" ||
      title === "Private video" ||
      title === "Deleted video"
    ) {
      // TODO: Have to fix Private watch in better way
    } else {
      // TODO: If there thumbnail then DISPLAY A DEFAULT THUMBNAIL
      let image =
        typeof item.snippet.thumbnails.high !== "undefined"
          ? item.snippet.thumbnails.high.url
          : "";
      let obj = {
        id: item.id.videoId,
        image: image,
        title: title,
        publishedAt: item.snippet.publishedAt,
        playlistId: item.snippet.playlistId || null,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
      };
      videos.push(obj);
      videoIds += "," + item.id.videoId;
      channelIds += "," + item.snippet.channelId;
    }
  });

  const statsURL = `${youtube.url}/videos?key=${youtube.key}&part=statistics&id=${videoIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const statsRes = await getYoutubeResponseByUrl(statsURL);

  const videoStats = await statsRes.json();
  let videoStatistics = {};

  videoStats.items.forEach((item) => {
    videoStatistics[item.id] = item.statistics.viewCount;
  });

  const channelsURL = `${youtube.url}/channels?key=${youtube.key}&part=snippet&id=${channelIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const channelRes = await getYoutubeResponseByUrl(channelsURL);

  const channelsDetails = await channelRes.json();
  let channels = {};

  channelsDetails.items.forEach((item) => {
    channels[item.id] = item.snippet.thumbnails.default.url;
  });

  let videoLists = {
    nextPageToken: nextPageToken,
    numberOfPages: numberOfPages,
    videos: videos,
    videoStats: videoStatistics,
    channels: channels,
  };

  return videoLists;
};

export const getRelatedYoutubeVideoListByUrl = async (url) => {
  const response = await getYoutubeResponseByUrl(url);
  const videosData = await response.json();
  const videoItems = await videosData.items;
  const nextPageToken = (await videosData.nextPageToken) || null;
  const totalVideos = await videosData.pageInfo.totalResults;
  const numberOfPages = Math.ceil(totalVideos / constants.DEFAULT_PAGE_LIMIT);
  let videos = [];
  let videoIds = "";

  videoItems.forEach((item) => {
    if (typeof item.snippet != "undefined") {
      const title = item.snippet.title.toString();
      // TODO: Have to fix Private watch in better way
      if (title != "Private watch") {
        // TODO: sometimes thumbnails can be missing. AD A DEFAULT THUMBNAIL
        let image =
          typeof item.snippet.thumbnails.high !== "undefined"
            ? item.snippet.thumbnails.high.url
            : "";
        let obj = {
          id: item.id.videoId,
          image: image,
          title: title,
          date: item.snippet.publishedAt,
          playlistId: item.snippet.playlistId,
        };
        videos.push(obj);
        videoIds += "," + item.id.videoId;
      }
    }
  });

  const statsURL = `${youtube.url}/videos?key=${youtube.key}&part=statistics&id=${videoIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const statsRes = await getYoutubeResponseByUrl(statsURL);

  const videoStats = await statsRes.json();
  let videoStatistics = {};

  videoStats.items.forEach((item) => {
    videoStatistics[item.id] = item.statistics.viewCount;
  });

  let videoLists = {
    nextPageToken: nextPageToken,
    numberOfPages: numberOfPages,
    videos: videos,
    videoStats: videoStatistics,
  };

  return {
    videoLists,
  };
};

export const getUploadPlaylistVideos = async () => {
  const url = `${youtube.url}/playlistItems?key=${youtube.key}&part=snippet&playlistId=${youtube.uploadPlaylistID}&maxResults=${constants.MAX_YOUTUBE_PAGE_LIMIT}`;
  const res = await getYoutubeResponseByUrl(url);

  let data = await res.json();
  let videoItems = await data.items;

  const total = await data.pageInfo.totalResults;
  let videoIdList = [];

  if (total > 50) {
    const numberOfRequests = Math.ceil(total / 50);
    for (let i = 1; i < numberOfRequests; i++) {
      let newURL = url + `&pageToken=${data.nextPageToken}`;
      let newRes = await fetch(newURL);
      data = await newRes.json();
      let newItems = await data.items;
      videoItems = videoItems.concat(newItems);
    }
  }

  videoItems.forEach((item) => {
    if (typeof item != "undefined") {
      const title = item.snippet.title.toString();
      // TODO: Have to fix Private watch
      if (title != "Private watch") {
        let obj = {
          id: item.snippet.resourceId.videoId,
        };
        videoIdList.push(obj);
      }
    }
  });

  return {
    videoIdList,
  };
};

export const getYoutubeVideoDetailsByUrl = async (url) => {
  const res = await getYoutubeResponseByUrl(url);
  const data = await res.json();

  let title;
  let description;
  let publishedAt;
  let image;
  let viewCount;
  let likeCount;
  let dislikeCount;
  let channelId;
  let channelTitle;

  if (typeof data.items != "undefined") {
    title = data.items[0].snippet.title;
    description = data.items[0].snippet.description;
    publishedAt = data.items[0].snippet.publishedAt;
    image =
      typeof data.items[0].snippet.thumbnails.high !== "undefined"
        ? data.items[0].snippet.thumbnails.high.url
        : "";
    viewCount =
      typeof data.items[0].statistics !== "undefined"
        ? data.items[0].statistics.viewCount
        : "";
    likeCount =
      typeof data.items[0].statistics !== "undefined"
        ? data.items[0].statistics.likeCount
        : "";
    dislikeCount =
      typeof data.items[0].statistics !== "undefined"
        ? data.items[0].statistics.dislikeCount
        : "";
    channelId = data.items[0].snippet.channelId;
    channelTitle = data.items[0].snippet.channelTitle;
  }

  const channelsURL = `${youtube.url}/channels?key=${youtube.key}&part=snippet&id=${channelId}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const channelRes = await getYoutubeResponseByUrl(channelsURL);

  const channelsDetails = await channelRes.json();
  let channelAvatar = "";
  channelsDetails.items.forEach((item) => {
    channelAvatar = item.snippet.thumbnails.default.url;
  });

  return {
    title,
    description,
    publishedAt,
    image,
    viewCount,
    likeCount,
    dislikeCount,
    channelTitle,
    channelId,
    channelAvatar,
  };
};

const replaceYoutubeKeyFromUrl = (url, key) => {
  const newUrl = url.replace(
    new RegExp("key([^&]*)&", "gm"),
    "key=" + key + "&"
  );
  return newUrl;
};

const fetchUrl = async (url) => {
  return await fetch(url);
};

const getYoutubeResponseByUrl = async (url) => {
  let res = await fetchUrl(url);
  const currentKey = youtube.key;
  // console.log("currentKey", res.status, currentKey);

  // Status code 403 if "key" quota limit exceed
  if (res.status == 403) {
    // If key1 limit exceed then we will change current key by next one and so on
    for (let key in youtubeKeys) {
      if (currentKey !== youtubeKeys[key]) {
        youtube.key = youtubeKeys[key];
        res = await fetchUrl(replaceYoutubeKeyFromUrl(url, youtube.key));
        if (res.status == 200) {
          break;
        }
      }
    }
  }

  return res;
};

// search option
export const getYoutubeSearchVideosByUrl = async (url) => {
  const response = await getYoutubeResponseByUrl(url);
  const videosData = await response.json();
  const videoItems = await videosData.items;
  const nextPageToken = (await videosData.nextPageToken) || null;
  const totalVideos = await videosData.pageInfo.totalResults;
  const numberOfPages = Math.ceil(totalVideos / constants.DEFAULT_PAGE_LIMIT);
  let videos = [];
  let videoIds = "";
  let channelIds = "";

  videoItems.forEach((item) => {
    const title = item.snippet.title.toString();
    // TODO: Have to fix Private watch in better way
    if (
      title === "Private watch" ||
      title === "Private video" ||
      title === "Deleted video"
    ) {
      // TODO: Have to fix Private watch in better way
    } else {
      // TODO: If there thumbnail then DISPLAY A DEFAULT THUMBNAIL
      let image =
        typeof item.snippet.thumbnails.high !== "undefined"
          ? item.snippet.thumbnails.high.url
          : "";
      let obj = {
        id: item.id.videoId,
        image: image,
        title: title,
        publishedAt: item.snippet.publishedAt,
        playlistId: item.snippet.playlistId || null,
        channelTitle: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
      };
      videos.push(obj);
      videoIds += "," + item.id.videoId;
      channelIds += "," + item.snippet.channelId;
    }
  });

  const statsURL = `${youtube.url}/videos?key=${youtube.key}&part=statistics&id=${videoIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;
  const statsRes = await getYoutubeResponseByUrl(statsURL);

  const videoStats = await statsRes.json();
  let videoStatistics = {};

  videoStats.items.forEach((item) => {
    videoStatistics[item.id] = item.statistics.viewCount;
  });

  const channelsURL = `${youtube.url}/channels?key=${youtube.key}&part=snippet&id=${channelIds}&maxResults=${constants.DEFAULT_PAGE_LIMIT}`;

  console.log(channelsURL);
  const channelRes = await getYoutubeResponseByUrl(channelsURL);

  const channelsDetails = await channelRes.json();
  let channels = {};

  channelsDetails.items.forEach((item) => {
    channels[item.id] = item.snippet.thumbnails.default.url;
  });

  let videoLists = {
    nextPageToken: nextPageToken,
    numberOfPages: numberOfPages,
    videos: videos,
    videoStats: videoStatistics,
    channels: channels,
  };

  return videoLists;
};

export const getCommentThreadsByUrl = async (url) => {
  const response = await getYoutubeResponseByUrl(url);
  const commentsData = await response.json();
  const commentsItems = await commentsData.items;
  console.log(commentsData);
  return commentsItems;
};

// ========================================================================
export const getVideosDataByUrl = async (url) => {
  const tn = await ct();

  const res = await fetch(url, {
    headers: {
      'p': tn,
    },
  });
  return await res.json();
};

const ct = async () => {
  const timestamp = moment().tz("America/New_York").valueOf();

  const payload = {
    userAgent: navigator.userAgent,
    timestamp,
    random: Math.floor(Math.random() * 1000000000),
  };

  return jwt.encode(payload, process.env.NEXT_PUBLIC_NP_AS);
};
