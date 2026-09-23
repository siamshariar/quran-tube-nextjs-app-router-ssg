import { Store } from 'pullstate';
import storage from './store';

export const RecentVideosStore = new Store({
  recentVideos: [],
});

// All writes to the "recents" key go through this same promise chain, one
// at a time -- addRecentVideo/updateVideoProgress/removeRecentVideo/
// moveVideoToTop each used to do their own independent getItem() -> modify
// -> setItem(), and closing one video then quickly opening/closing the next
// (exactly what tapping through several Recents cards does, especially on
// iOS where swaps happen faster) let a later call's getItem() land before
// an earlier call's setItem() finished, so the earlier write got silently
// clobbered by the later one's stale copy of the list -- e.g. the middle
// video of three watched in a row losing its saved progress. Queuing every
// mutation here, and letting each one work off the in-memory
// RecentVideosStore state under `mutate` (already caught up from the
// previous queued write) rather than a fresh getItem(), makes the whole
// sequence apply in order with nothing lost.
let writeQueue = Promise.resolve();
const enqueue = (mutate) => {
  const result = writeQueue.then(async () => {
    const current = RecentVideosStore.getRawState().recentVideos || [];
    const updated = await mutate(current);
    RecentVideosStore.update((s) => {
      s.recentVideos = updated;
    });
    await storage.setItem("recents", updated);
    return updated;
  });
  // Keep the chain alive even if this mutation's own caller never awaits
  // or handles rejection -- otherwise one failed write would leave
  // writeQueue permanently rejected and silently stall every later call.
  writeQueue = result.catch(() => {});
  return result;
};

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
    await enqueue((storedVideos) => {
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

      const next = existingIndex >= 0
        ? storedVideos.map((v, i) => (i === existingIndex ? video : v))
        : [video, ...storedVideos];

      // Keep only the 100 most recent items
      return next.slice(0, 100);
    });
  } catch (error) {
    console.error("Error adding recent video", error);
  }
};

export const updateVideoProgress = async (ytVideoId, currentTime, duration) => {
  try {
    await enqueue((storedVideos) =>
      storedVideos.map((video) =>
        video.ytVideoId === ytVideoId ? { ...video, currentTime, duration } : video,
      )
    );
  } catch (error) {
    console.error("Error updating video progress", error);
  }
};

export const removeRecentVideo = async (ytVideoId) => {
  try {
    await enqueue((storedVideos) =>
      storedVideos.filter((video) => video.ytVideoId !== ytVideoId)
    );
  } catch (error) {
    console.error("Error removing recent video", error);
  }
};

export const moveVideoToTop = async (ytVideoId) => {
  try {
    await enqueue((storedVideos) => {
      const video = storedVideos.find((v) => v.ytVideoId === ytVideoId);
      if (!video) return storedVideos;

      const updatedVideo = { ...video, addedAt: new Date().toISOString() };
      if (typeof window !== "undefined" && updatedVideo.pathname) {
        const urlParams = new URLSearchParams();
        urlParams.set("v", updatedVideo.slug);
        updatedVideo.fullUrl = `${window.location.origin}${updatedVideo.pathname}?${urlParams.toString()}`;
      }

      return [updatedVideo, ...storedVideos.filter((v) => v.ytVideoId !== ytVideoId)];
    });
  } catch (error) {
    console.error("Error moving video to top", error);
  }
};
