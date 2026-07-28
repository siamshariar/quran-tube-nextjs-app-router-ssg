"use client";

import { constants } from "../../lib/config";
import ContentPage from "./ContentPage";

const getUrl = (pagination, localizationId, fromDateParam = null, toDateParam = null) => {
  let cursor = pagination.c ? pagination.c : null;

  const baseUrl = `${constants.API_URL}/contents?`;

  const urlParts = [
    `ai=q`,
    `t=all`,
    `is=1`,
    `of=1`,
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

const Shorts = () => {
  return (
      <ContentPage
          getUrl={getUrl}
          defaultMetaTitle="Shorts | Quran Tube"
          metaDescription="Discover the beauty of Quran recitations through videos with Quran.tube"
          isDisplayLocalizationChipBar={false} // TODO: UI issue when 1/2 shorts items only
          isShorts={true}
      />
  );
};

export default Shorts;