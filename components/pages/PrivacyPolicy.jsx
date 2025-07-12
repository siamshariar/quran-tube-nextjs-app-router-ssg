import styles from "./Home.module.css";
import Meta from "../core/Meta";
import {server } from "../../lib/config";

const PrivacyPolicy = () => {
  return (
    <>
      <Meta
        title="Privacy Policy | Quran Tube"
        description="Privacy Policy"
        url={server}
        image={`${server}/img/logo/default_share.png`}
        type="website"
      />

      <div className={styles.wrapper}>
        {/*<div*/}
        {/*  className={classNames(*/}
        {/*    styles.header,*/}
        {/*    isMini ? styles.mini : "",*/}
        {/*    "chipbar"*/}
        {/*  )}*/}
        {/*>*/}
        {/*  <ChipBar />*/}
        {/*</div>*/}

        <div className={styles.container}>
          <div className={styles.content} >

            <div>
              {/*<p className="text-center mb-2">Quran.tube</p>*/}
              <h2>Privacy Policy</h2>
              <p>Last updated: January 15, 2024</p>
              <p>
                At Quran.tube, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Quran.tube.com and how we use it.
              </p>
              <p>
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us
              </p>
              <p>
                This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Quran.tube.com. This policy is not applicable to any information collected offline or via channels other than this website.
              </p>
              <h2 style={{marginTop: `20px`}}>Information Collection</h2>
              <p>We do not collect any personal data. This is pure content app.</p>
              <h2>Third Party Privacy Policies</h2>
              <p>
                Quran.tube Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <h2 style={{marginTop: `20px`}}>Children’s Privacy</h2>
              Children’s can use this app.
              <h2 style={{marginTop: `20px`}}>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from
                time to time. Thus, you are advised to review this page
                periodically for any changes. We will
                notify you of any changes by posting the new Privacy Policy on
                this page.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
