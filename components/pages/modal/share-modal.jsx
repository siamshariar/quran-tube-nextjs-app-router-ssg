import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./share.module.scss";
import {
	EmailShareButton,
	EmailIcon,
	FacebookShareButton,
	FacebookIcon,
	FacebookMessengerShareButton,
	FacebookMessengerIcon,
	TwitterShareButton,
	TwitterIcon,
	LinkedinShareButton,
	LinkedinIcon,
	WhatsappShareButton,
	WhatsappIcon,
	LineShareButton,
	LineIcon,
	TelegramShareButton,
	TelegramIcon,
	ViberShareButton,
	ViberIcon,
	RedditShareButton,
	RedditIcon,
	TumblrShareButton,
	TumblrIcon,
} from "react-share";

export default function ShareModal({ openModal, closer, url, title }) {
	return (
		<Modal
			open={openModal}
			onClose={closer}
			className={styles.root}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}>
			<Fade in={openModal}>
				<div className={styles.modal}>
					<span className={styles.close} onClick={closer}>
						<CloseIcon />
					</span>

					<div className={styles.title}>Share</div>

					<div className={styles.lists}>
						<div className={styles.item}>
							<EmailShareButton
								url={url}
								subject={title}
								onShareWindowClose={closer}>
								<EmailIcon size={32} round={true} />
							</EmailShareButton>
						</div>

						<div className={styles.item}>
							<FacebookShareButton url={url} onShareWindowClose={closer}>
								<FacebookIcon size={32} round={true} />
							</FacebookShareButton>
						</div>

						{/* <div className={styles.item}>
							<FacebookMessengerShareButton url={url}>
								<FacebookMessengerIcon size={32} round={true} />
							</FacebookMessengerShareButton>
						</div> */}

						<div className={styles.item}>
							<TwitterShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<TwitterIcon size={32} round={true} />
							</TwitterShareButton>
						</div>

						<div className={styles.item}>
							<LinkedinShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<LinkedinIcon size={32} round={true} />
							</LinkedinShareButton>
						</div>

						<div className={styles.item}>
							<WhatsappShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<WhatsappIcon size={32} round={true} />
							</WhatsappShareButton>
						</div>

						<div className={styles.item}>
							<LineShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<LineIcon size={32} round={true} />
							</LineShareButton>
						</div>

						<div className={styles.item}>
							<TelegramShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<TelegramIcon size={32} round={true} />
							</TelegramShareButton>
						</div>

						<div className={styles.item}>
							<ViberShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<ViberIcon size={32} round={true} />
							</ViberShareButton>
						</div>

						<div className={styles.item}>
							<RedditShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<RedditIcon size={32} round={true} />
							</RedditShareButton>
						</div>

						<div className={styles.item}>
							<TumblrShareButton
								url={url}
								title={title}
								onShareWindowClose={closer}>
								<TumblrIcon size={32} round={true} />
							</TumblrShareButton>
						</div>
					</div>
				</div>
			</Fade>
		</Modal>
	);
}
