"use client";

import { constants } from "../../lib/config";
import ContentPage from "./ContentPage";

const getUrl = (pagination, localizationId) => {
  let cursor = pagination.c ? pagination.c : null;

  const baseUrl = `${constants.API_URL}/contents?`;

  const urlParts = [
    `ai=q`,
    `t=madinah`,
  ];

  if (cursor) {
    urlParts.push(`c=${cursor}`);
  }

  if (localizationId) {
    urlParts.push(`lds=${localizationId}`);
  }

  return baseUrl + urlParts.join("&");
};

const Madinah = () => {
  return (
      <ContentPage
          getUrl={getUrl}
          defaultMetaTitle="Madinah | Quran Tube"
          metaDescription="Discover the beauty of Quran recitations through videos with Quran.tube"
          isDisplayLocalizationChipBar={false}
      />
  );
};

export default Madinah;