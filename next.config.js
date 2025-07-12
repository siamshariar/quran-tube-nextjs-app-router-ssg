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
    BASE_URL: !process.env.NODE_ENV || process.env.NODE_ENV === "development"
        ? process.env.L_BASE_URL
        : "https://www.quran.tube",
  },
});
