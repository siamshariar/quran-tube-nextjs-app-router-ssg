"use client";

import { constants } from "../../lib/config";
import ContentPage from "./ContentPage";

const getUrl = (pagination, searchParam) => {
  let cursor = pagination.c ? pagination.c : null;

  const baseUrl = `${constants.API_URL}/contents/search?`;

  const urlParts = [
    `ai=q`,
  ];

  if (cursor) {
    urlParts.push(`c=${cursor}`);
  }

  if (searchParam) {
    urlParts.push(`s=${searchParam}`);
  }

  return baseUrl + urlParts.join("&");
};

const Search = () => {
  return (
      <ContentPage
          getUrl={getUrl}
          defaultMetaTitle="Search | Quran Tube"
          metaDescription="Discover the beauty of Quran recitations through videos with Quran.tube"
          isDisplayLocalizationChipBar={false}
      />
  );
};

export default Search;