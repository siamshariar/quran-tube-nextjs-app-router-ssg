"use client";

import { useEffect } from "react";

/**
 * Belt-and-braces zoom blocking for iOS.
 *
 * The viewport export in app/layout.js sets `user-scalable=no,
 * maximum-scale=1`, and global.css sets `touch-action: pan-x pan-y` on <html>.
 * That covers Android Chrome. iOS Safari, however, has deliberately ignored
 * `user-scalable=no` since iOS 10 for accessibility reasons, and it fires its
 * own non-standard `gesture*` events for pinching which `touch-action` does
 * not always suppress inside a standalone (home-screen) web app.
 *
 * So we cancel the pinch and the double-tap directly. Single-finger
 * scrolling is untouched -- we only ever preventDefault on multi-touch
 * movement and on the second tap of a double-tap.
 */
export default function useDisableZoom() {
  useEffect(() => {
    // Pinch zoom on iOS (non-standard gesture events).
    // passive:false so preventDefault is actually honoured.
    const blockGesture = (e) => e.preventDefault();
    document.addEventListener("gesturestart", blockGesture, { passive: false });
    document.addEventListener("gesturechange", blockGesture, {
      passive: false,
    });
    document.addEventListener("gestureend", blockGesture, { passive: false });

    // Pinch zoom via raw multi-touch (covers browsers with no gesture events).
    // Single-finger touches fall through, so scrolling still works.
    const blockMultiTouch = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener("touchmove", blockMultiTouch, { passive: false });

    // Double-tap-to-zoom: a second tap within 300ms of the previous one.
    let lastTouchEnd = 0;
    const blockDoubleTapZoom = (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    };
    document.addEventListener("touchend", blockDoubleTapZoom, {
      passive: false,
    });

    return () => {
      document.removeEventListener("gesturestart", blockGesture);
      document.removeEventListener("gesturechange", blockGesture);
      document.removeEventListener("gestureend", blockGesture);
      document.removeEventListener("touchmove", blockMultiTouch);
      document.removeEventListener("touchend", blockDoubleTapZoom);
    };
  }, []);
}
