const withPWA = require('next-pwa')({
  dest: "public",
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  register: true,
});

module.exports = withPWA({
  images: {
    domains: ["localhost", "quran.tube", "www.quran.tube", "i.ytimg.com", "yt3.ggpht.com", "cdn.example.com"],
  },
  env: {
    L_BASE_URL: !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? process.env.L_BASE_URL
        : "https://www.quran.tube",
  },
  async rewrites() {
    return [
      // "/_offline" can't be a real app/ route folder name (Next.js treats
      // leading-underscore folders as private, excluded from routing), so
      // the page lives at app/offline-page and is rewritten back to the
      // original URL to keep it identical to the pre-migration app.
      { source: "/_offline", destination: "/offline-page" },
    ];
  },
});
