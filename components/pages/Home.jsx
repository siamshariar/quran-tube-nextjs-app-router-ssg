"use client";

import { constants } from "../../lib/config";
import ContentPage from "./ContentPage";

const getUrl = (pagination, localizationId, fromDateParam = null, toDateParam = null) => {
  let cursor = pagination.c ? pagination.c : null;

  const baseUrl = `${constants.API_URL}/contents?`;

  const urlParts = [
    `ai=q`,
    `t=all`,
  ];

  if (cursor) {
    urlParts.push(`c=${cursor}`);
  }

  if (localizationId) {
    urlParts.push(`lds=${localizationId}`);
  }

  if (fromDateParam) {
    urlParts.push(`from=${fromDateParam}`);
  }

  if (toDateParam) {
    urlParts.push(`to=${toDateParam}`);
  }

  return baseUrl + urlParts.join("&");
};

const Home = () => {
  return (
      <ContentPage
          getUrl={getUrl}
          defaultMetaTitle="Quran Tube"
          metaDescription="Discover the beauty of Quran recitations through videos with Quran.tube"
          isDisplayLocalizationChipBar={true}
      />
  );
};

export default Home;