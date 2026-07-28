"use client";

import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Header.module.css";
import classNames from "classnames";
import Link from "next/link";
import {IconButton} from "@mui/material";
import {toggleMiniNav, UIStore} from "../../store";
import {MoreVert} from "@mui/icons-material";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import {arrowLeft, close, donate, mobileApp, searchOutline, share} from "../../icons"; // Import icons directly
import {useEffect, useRef, useState} from "react";
import {informationCircleOutline} from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import ShareModal from "../pages/modal/share-modal";
import {isMobile, isTablet, isBrowser} from 'react-device-detect';

const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputWrapper = useRef(null);
  const hiddenIcon = useRef(null);
  const closeIcon = useRef(null);
  const mobileSearch = useRef(null);
  const backdrop = useRef(null);

  const [path, setPath] = useState("/");
  const [layout, setLayout] = useState("layout1");
  const [key, setKey] = useState("");
  const [sideNavOpen, setSidenavOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  

  const isTab = UIStore.useState((s) => s.isTab);
  const isMiniNav = UIStore.useState((s) => s.isMiniNav);


  useEffect(() => {
    setPath(pathname);
    setLayout(pathname === "/" ? "layout1" : "layout2");
  }, [pathname]);


  useEffect(() => {
    // Clear search input when navigating away from the search page
    if (!pathname.includes("/search")) {
      setKey("");
    } else {
      setKey(searchParams.get("s") || "");
    }
  }, [pathname, searchParams]);

  const handleFocusIn = () => {
    inputWrapper.current.classList.add(styles.focus);
    hiddenIcon.current.classList.remove(styles.hide);
  };

  const handleFocusOut = () => {
    inputWrapper.current.classList.remove(styles.focus);
    hiddenIcon.current.classList.add(styles.hide);
  };

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  const handleClear = () => {
    setKey("");
  };

  useEffect(() => {
    if (key === "") {
      closeIcon.current.classList.remove(styles.show);
    } else {
      closeIcon.current.classList.add(styles.show);
    }
  }, [key]);

  const formRef = useRef(); // Ref to the form element
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    // e.preventDefault();
    if (key.trim() === "") return;
    // router.push(`/search?s=${encodeURIComponent(key.trim())}`);
    // const href = "/search?s=" + inputRef.current.value;
    // router.push(href);
    formRef.current.submit(); // TODO: Should pass to component instead of submitting the form
    handleMobileSearch(false);
  };

  const handleMobileSearch = (open) => {
    if (open) {
      mobileSearch.current.classList.add(styles.show);
    } else {
      mobileSearch.current.classList.remove(styles.show);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
 
  const handleSidenav = () => {
    toggleMiniNav(!isMiniNav);
  };

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const shareTitle = "Quran.tube App";
  const shareUrl = "https://www.deeniinfotech.com/p/quran-tube#apps";

  // Handle opening the share modal
  const handleShareClick = () => {
    handleClose();
    if ((isMobile || isTablet) && navigator.share) {
      navigator.share({
        title: shareTitle,
        url: shareUrl,
      })
          .catch((error) => console.log("Error sharing:", error));
    } else {
      setIsShareModalOpen(true);
    }
  };

  // Close the share modal
  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  return (
    <div className={classNames(styles.wrapper, styles[layout])}>
      <div className={styles.container}>
        <div className={styles.start}>
          <Link href="/">
            <div className={styles.logo} style={{cursor: `pointer`}}>
              <img
                src="/img/logo/Quran-Tube.png"
                alt="Quran Tube Logo"
              />
            </div>
          </Link>
        </div>

        <div className={styles.center}>
          <form
              ref={formRef} // Attach the ref to the form
              action="/search"
              method="GET"
            className={styles.search}
            onSubmit={handleSubmit}
          >
            <div className={styles.input} ref={inputWrapper}>
              <IonIcon
                icon={searchOutline}
                slot="start"
                className={classNames(styles.s_hidden_icon, styles.hide)}
                ref={hiddenIcon}
              />
              <input
                type="text"
                name="s"
                placeholder="Search"
                onChange={handleChange}
                onFocus={handleFocusIn}
                onBlur={handleFocusOut}
                value={key}
                ref={inputRef}
              />
              <IonIcon
                icon={close}
                slot="start"
                className={classNames(styles.s_close_icon)}
                ref={closeIcon}
                onClick={handleClear}
              />
            </div>

            <button className={styles.s_submit} type="submit">
              <IonIcon
                icon={searchOutline}
                slot="start"
                className={styles.s_icon}
              />
            </button>
          </form>
        </div>
        {/* mobile search */}
        <div className={styles.m_search} ref={mobileSearch}>
          <form
              ref={formRef} // Attach the ref to the form
              action="/search"
              method="GET"
            className={styles.m_search_form}
            onSubmit={handleSubmit} // Calls handleSubmit function
          >
            <button
              className={styles.m_search_icon}
              type="button"
              onClick={() => handleMobileSearch(false)}
            >
              <IonIcon
                icon={arrowLeft}
                slot="start"
                className={classNames(styles.back_icon)}
              />
            </button>
            <input
              type="text"
              name="s"
              placeholder="Search"
              onChange={handleChange}
              value={key}
              ref={inputRef}
            />
            <button className={styles.m_search_icon} type="submit">
              <IonIcon
                icon={searchOutline}
                slot="start"
                className={styles.m_submit_icon}
              />
            </button>
          </form>
          <div
            className={styles.m_search_backdrop}
            ref={backdrop}
            onClick={() => handleMobileSearch(false)}
          ></div>
        </div>
         <div className={styles.end}>
          <button
            className={classNames(styles.btn, styles.show_on_mobile)}
            onClick={() => handleMobileSearch(true)}
          >
            <IonIcon
              icon={searchOutline}
              slot="start"
              className={styles.icon}
            />
          </button>
          {/* <button className={classNames(styles.btn, styles.show_on_web)}>
            <IonIcon
              icon={notificationOutline}
              slot="start"
              className={styles.icon}
            />
          </button> */}
          {/* <button className={styles.btn}>
            <IonIcon
              icon={appsOutline}
              slot="start"
              className={styles.icon}
            />
          </button> */}
        </div>
        <div className={styles.right}>
            <div className={isTab ? `${styles.btn} invisible` : styles.btn}>
              <IconButton onClick={handleClick}>
                <MoreVert />
              </IconButton>
            </div>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              disableScrollLock={false}
              PaperProps={{
                style: {
                  minWidth: '200px',
                  // Any other inline styles can go here
                },
              }}
            >
              <MenuList className={styles.menu}>
                {!isBrowser && (
                    <MenuItem onClick={handleShareClick}>
                      <span className={styles.icon}>
                        <IonIcon icon={mobileApp} slot="start" />
                      </span>
                      <span className={styles.text}>Share App</span>
                    </MenuItem>
                )}

                {isBrowser && (
                    <>
                      <Link href="https://www.deeniinfotech.com/p/quran-tube#apps" target="_blank">
                        <MenuItem onClick={handleClose}>
                          <span className={styles.icon}>
                            <IonIcon icon={mobileApp} slot="start" />
                          </span>
                          <span className={styles.text}>Install App</span>
                        </MenuItem>
                      </Link>
                      <Link href="/about" style={{color: '#000000'}}>
                        <MenuItem onClick={handleClose}>
                      <span className={styles.icon}>
                        <IonIcon icon={informationCircleOutline} slot="start" />
                      </span>
                          <span className={styles.text}>About</span>
                        </MenuItem>
                      </Link>
                    </>
                )}

                <Link
                  href="https://www.deeniinfotech.com/donate#donation-form"
                  target="_blank">
                  <MenuItem onClick={handleClose}>
                    <span className={styles.icon}>
                      <IonIcon icon={donate} slot="start" />
                    </span>
                    <span className={styles.text}>Donate</span>
                  </MenuItem>
                </Link>
              </MenuList>
            </Popover>
          </div>
      </div>

      {/* Mobile Search */}
      <div className={styles.m_search} ref={mobileSearch}>
        <form
          className={styles.m_search_form}
          onSubmit={handleSubmit}
        >
          <button
            className={styles.m_search_icon}
            type="button"
            onClick={() => handleMobileSearch(false)}
          >
            <IonIcon
              icon={arrowLeft}
              slot="start"
              className={classNames(styles.back_icon)}
            />
          </button>
          <input
            type="text"
            name="search"
            placeholder="Search"
            onChange={handleChange}
            value={key}
          />
          <button className={styles.m_search_icon} type="submit">
            <IonIcon
              icon={searchOutline}
              slot="start"
              className={styles.m_submit_icon}
            />
          </button>
        </form>
        <div
          className={styles.m_search_backdrop}
          ref={backdrop}
          onClick={() => handleMobileSearch(false)}
        ></div>
      </div>

      {/* Share Modal */}
      <ShareModal
          openModal={isShareModalOpen}
          closer={closeShareModal}
          url={shareUrl}
          title={shareTitle}
      />
    </div>
  );
};

export default Header;
