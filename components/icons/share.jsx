import { server } from "../../lib/config";
import { useState } from "react";
// import ShareIcon from "@mui/icons-material/Share";
import ShareModal from "../pages/modal/share-modal";
import styles from "../pages/modal/share.module.scss"
import { UIStore } from "../../store";

export default function Share({ Icon, shareText, url, title }) {
	const [shareOpen, setShareOpen] = useState(false);
	const [shareUrl, setShareUrl] = useState("");
	const [shareTitle, setShareTitle] = useState("");
	const isTab = UIStore.useState((s) => s.isTab);

	const handleShareClose = () => {
		setShareOpen(false);
	};

	const handleShare = () => {
		if (isTab && navigator.share) {
			navigator.share({
				title: title,
				url: url,
			});
		} else {
			setShareUrl(`${server}${url}`);
			setShareTitle(title);
			setShareOpen(true);
		}
	};

	return (
		<>
			<div className={styles.wrapper}>
				<button
					onClick={handleShare}
					className={`${styles.btn}${styles.btn_web}`}>
					{Icon && <Icon />} {shareText && shareText}
				</button>
			</div>

			<ShareModal
				openModal={shareOpen}
				closer={handleShareClose}
				url={shareUrl}
				title={shareTitle}
			/>
		</>
	);
}
