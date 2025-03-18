import { constants } from "../../lib/config";
import ContentPage from "./ContentPage";

const getUrl = (pagination, localizationId) => {
  let cursor = pagination.c ? pagination.c : null;

  const baseUrl = `${constants.API_URL}/contents?`;

  const urlParts = [
    `ai=q`,
    `t=taraweeh-madinah`,
  ];

  if (cursor) {
    urlParts.push(`c=${cursor}`);
  }

  if (localizationId) {
    urlParts.push(`lds=${localizationId}`);
  }

  return baseUrl + urlParts.join("&");
};

const TaraweehMadinah = () => {
  return (
      <ContentPage
          getUrl={getUrl}
          defaultMetaTitle="Madinah Taraweeh | Quran Tube"
          metaDescription="Discover the beauty of Quran recitations through videos with Quran.tube"
          isDisplayLocalizationChipBar={false}
          taraweehPage="taraweeh-madinah"
      />
  );
};

export default TaraweehMadinah;
