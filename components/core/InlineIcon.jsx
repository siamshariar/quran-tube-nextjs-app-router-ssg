const UTF8_PREFIX = "data:image/svg+xml;utf8,";
const BASE64_PREFIX = "data:image/svg+xml;base64,";

const toMarkup = (src) => {
  if (typeof src !== "string") return null;
  if (src.startsWith(UTF8_PREFIX)) {
    return src.slice(UTF8_PREFIX.length);
  }
  if (src.startsWith(BASE64_PREFIX) && typeof atob === "function") {
    try {
      return decodeURIComponent(escape(atob(src.slice(BASE64_PREFIX.length))));
    } catch {
      return null;
    }
  }
  return null;
};

// Renders icon sources synchronously (no Stencil/ion-icon async upgrade),
// so icons never pop-in/resize after the page has already painted.
const InlineIcon = ({ icon, className, style }) => {
  const markup = toMarkup(icon);

  if (markup) {
    return (
      <span
        className={className}
        style={{ display: "block", width: "1em", height: "1em", lineHeight: 0, ...style }}
        dangerouslySetInnerHTML={{ __html: markup.replace("<svg", '<svg fill="currentColor"') }}
      />
    );
  }

  return (
    <img
      src={icon}
      alt=""
      className={className}
      style={{ display: "block", width: "1em", height: "1em", ...style }}
    />
  );
};

export default InlineIcon;
