import { Store as PullStateStore } from "pullstate";

import { lists, homeItems, notifications } from "../data";
import { videos } from "../data/videos";

const Store = new PullStateStore({
  safeAreaTop: 0,
  safeAreaBottom: 0,
  menuOpen: false,
  notificationsOpen: false,
  currentPage: null,
  homeItems,
  videos,
  lists,
  notifications,
  settings: {
    enableNotifications: true,
  },
});

export const UIStore = new PullStateStore({
  isMiniNav: false,
});

export const toggleMiniNav = (isActive) => {
  UIStore.update((s) => {
    s.isMiniNav = isActive;
  });
};

export const MiniPlayerStore = new PullStateStore({
  isActive: false,
  src: "",
  title: "",
  subTitle: "",
});

export const setMiniPlayerActive = (isActive) => {
  MiniPlayerStore.update((s) => {
    s.isActive = isActive;
  });
};

export const setMiniPlayer = (obj) => {
  MiniPlayerStore.update((s) => {
    s.src = obj.src;
    s.title = obj.title;
    s.subTitle = obj.subTitle;
  });
};

// popup
export const PopupStore = new PullStateStore({
  open: false,
  reference: typeof document !== "undefined" ? document.body : null,
  videoId: null,
});

export const setPopupOpen = (open) => {
  PopupStore.update((s) => {
    s.open = open;
  });
};

export const setPopupReference = (reference) => {
  PopupStore.update((s) => {
    s.reference = reference;
  });
};

export const setPopupVideoId = (videoId) => {
  PopupStore.update((s) => {
    s.videoId = videoId;
  });
};

// preview
export const PreviewStore = new PullStateStore({
  open: false,
  reference: typeof document !== "undefined" ? document.body : null,
  video: {
    id: null,
    image: null,
    title: null,
    publishedAt: null,
    channelId: null,
    channelTitle: null,
    statistics: null,
    channelThumbnails: null,
  },
  container: typeof document !== "undefined" ? document.body : null,
});

export const setPreviewOpen = (open) => {
  PreviewStore.update((s) => {
    s.open = open;
  });
};

export const setPreviewReference = (reference) => {
  PreviewStore.update((s) => {
    s.reference = reference;
  });
};

export const setPreviewVideo = (video) => {
  PreviewStore.update((s) => {
    s.video = video;
  });
};

export const setPreviewContainer = (container) => {
  PreviewStore.update((s) => {
    s.container = container;
  });
};

export default Store;
