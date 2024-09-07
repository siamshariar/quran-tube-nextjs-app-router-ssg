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
          Feature development is in progress and will be added soon, In'Sha
          Allah.
        </p>
      </div>
    </>
  );
};

export default More;
