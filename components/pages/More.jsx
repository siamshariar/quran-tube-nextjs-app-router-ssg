import { server } from "../../lib/config";
import Meta from "../core/Meta";
import styles from "./More.module.css";
const More = () => {
  return (
    <>
      <Meta
        title="More"
        description="More"
        url={server}
        image={`${server}/img/logo/default_share.png`}
        type="website"
      />
      <div>
        <p className={styles.tmpMsg}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Feature development is in progress and will be added soon, In'ShaAllah.
        </p>
      </div>
    </>
  );
};

export default More;
