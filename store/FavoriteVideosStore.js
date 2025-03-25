import { Store } from 'pullstate';
import storage from './store';

export const FavoriteVideosStore = new Store({
  favoriteVideos: [],
});

export const loadFavoriteVideos = async () => {
  try {
    const storedVideos = await storage.getItem("favorites");
    const favoriteVideos = storedVideos || [];
    FavoriteVideosStore.update(s => {
      s.favoriteVideos = favoriteVideos;
    });
  } catch (error) {
    console.error("Error loading videos from storage", error);
  }
};

export const addFavoriteVideo = async (video, fullUrl) => {
  try {
    const storedVideos = await storage.getItem("favorites") || [];

    if (!storedVideos.some(v => v.ytVideoId === video.ytVideoId)) {
      video.fullUrl = fullUrl;
      storedVideos.unshift(video);
      FavoriteVideosStore.update(s => {
        s.favoriteVideos = storedVideos;
      });
      await storage.setItem("favorites", storedVideos);
    }
  } catch (error) {
    console.error("Error adding favorite video", error);
  }
};

export const removeFavoriteVideo = async (ytVideoId) => {
  try {
    const storedVideos = await storage.getItem("favorites") || [];
    const updatedVideos = storedVideos.filter(video => video.ytVideoId !== ytVideoId);
    FavoriteVideosStore.update(s => {
      s.favoriteVideos = updatedVideos;
    });
    await storage.setItem("favorites", updatedVideos);
  } catch (error) {
    console.error("Error removing favorite video", error);
  }
};