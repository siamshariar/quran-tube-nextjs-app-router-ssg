export const server =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "https://localhost:3000"
    : "https://www.quran.tube";

export const youtubeKeys = {
  key1: "AIzaSyDZY2BV87ud8z-rO7szgy1QBwHhs3JF9OQ",
  key2: "AIzaSyC9J0ZPdYDQM646QfkL8qBoH6uvjPRcQ_c",
  key3: "AIzaSyCdpd6V9fNPDEDLIAliGQkDmTki2P0bDTM",
  key4: "AIzaSyD0_xKUAf4o5i8xkvL7PbZW-s-KJsO_mTU",
  key5: "AIzaSyBWEuVwCQzW32iZIn75_BGtJrgZ9LqQDmE",
};

export const youtube = {
  url: "https://www.googleapis.com/youtube/v3",
  key: youtubeKeys.key1,
  channelID: "UC-b56ESmUnfs2qgfHtPVwFA",
  uploadPlaylistID: "UU-b56ESmUnfs2qgfHtPVwFA",
};

export const constants = {
  DEFAULT_PAGE_LIMIT: 28,
  MAX_YOUTUBE_PAGE_LIMIT: 50,
  YOUTUBE_RELATED_VIDEOS_PAGE_LIMIT: 4,
};
