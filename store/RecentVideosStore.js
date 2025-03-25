import { Store } from 'pullstate';
import storage from './store';

export const RecentVideosStore = new Store({
  recentVideos: [],
});

export const loadRecentVideos = async () => {
  try {
    const storedVideos = await storage.getItem("recents");
    const recentVideos = storedVideos || [];
    RecentVideosStore.update((s) => {
      s.recentVideos = recentVideos;
    });
  } catch (error) {
    console.error("Error loading videos from storage", error);
  }
};

export const addRecentVideo = async (video) => {
  try {
    const storedVideos = (await storage.getItem("recents")) || [];
    
    // Ensure pathname is always set
    if (typeof window !== "undefined") {
      video.pathname = window.location.pathname;
      const urlParams = new URLSearchParams();
      urlParams.set("v", video.slug);
      video.fullUrl = `${window.location.origin}${video.pathname}?${urlParams.toString()}`;
      video.addedAt = new Date().toISOString(); // Ensure timestamp is set
    }

    // Check for existing video by both ytVideoId and pathname
    const existingIndex = storedVideos.findIndex(v => 
      v.ytVideoId === video.ytVideoId && v.pathname === video.pathname
    );

    if (existingIndex >= 0) {
      // Update existing entry
      storedVideos[existingIndex] = video;
    } else {
      // Add new entry
      storedVideos.unshift(video);
    }

    // Keep only the 100 most recent items
    const recentVideos = storedVideos.slice(0, 100);
    
    RecentVideosStore.update((s) => {
      s.recentVideos = recentVideos;
    });
    
    await storage.setItem("recents", recentVideos);
  } catch (error) {
    console.error("Error adding recent video", error);
  }
};

export const updateVideoProgress = async (ytVideoId, currentTime, duration) => {
  try {
    const storedVideos = (await storage.getItem("recents")) || [];
    const updatedVideos = storedVideos.map((video) =>
      video.ytVideoId === ytVideoId ? { ...video, currentTime, duration } : video,
    );
    RecentVideosStore.update((s) => {
      s.recentVideos = updatedVideos;
    });
    await storage.setItem("recents", updatedVideos);
  } catch (error) {
    console.error("Error updating video progress", error);
  }
};

export const removeRecentVideo = async (ytVideoId) => {
  try {
    const storedVideos = (await storage.getItem("recents")) || [];
    const updatedVideos = storedVideos.filter((video) => video.ytVideoId !== ytVideoId);
    RecentVideosStore.update((s) => {
      s.recentVideos = updatedVideos;
    });
    await storage.setItem("recents", updatedVideos);
  } catch (error) {
    console.error("Error removing recent video", error);
  }
};

export const moveVideoToTop = async (ytVideoId) => {
  try {
    const storedVideos = (await storage.getItem("recents")) || [];
    const video = storedVideos.find((video) => video.ytVideoId === ytVideoId);
    if (video) {
      const updatedVideos = storedVideos.filter((video) => video.ytVideoId !== ytVideoId);
      video.addedAt = new Date().toISOString(); // Update the timestamp
      if (typeof window !== "undefined" && video.pathname) {
        const urlParams = new URLSearchParams()
        urlParams.set("v", video.slug)
        video.fullUrl = `${window.location.origin}${video.pathname}?${urlParams.toString()}`
      }

      updatedVideos.unshift(video);
      RecentVideosStore.update((s) => {
        s.recentVideos = updatedVideos;
      });
      await storage.setItem("recents", updatedVideos);
    }
  } catch (error) {
    console.error("Error moving video to top", error);
  }
};