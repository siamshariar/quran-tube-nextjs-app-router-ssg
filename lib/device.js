// Shared with PlayerModal's isIOS prop, which every page passes this
// through to -- keeping the detection itself in one place means a future
// change (e.g. handling iPadOS 13+ reporting as desktop Safari) only needs
// to happen once instead of being kept in sync across every page that opens
// the player.
export const isIOSDevice = () =>
  typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  typeof window !== "undefined" &&
  !window.MSStream;
