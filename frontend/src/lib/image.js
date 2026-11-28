export const getOptimizedImageUrl = (src, size = "w185") => {
  if (!src) return "/images/poster_1.jpg";
  if (typeof src === "string" && src.includes("image.tmdb.org/t/p/")) {
    return src.replace(/\/t\/p\/[^/]+/, `/t/p/${size}`);
  }
  return src;
};
