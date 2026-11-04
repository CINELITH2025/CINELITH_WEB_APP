export const buildSharePayload = ({
  kind = "movie",
  movie = {},
  rating,
  text = ""
} = {}) => {
  const title = movie.title || movie.name || "Untitled";
  const movieId = movie.id || movie.movieId || movie.tvdbId || null;
  const share = {
    kind,
    movieId,
    title,
    image: movie.image || movie.poster || "",
    year: movie.year || "",
    rating: rating ?? movie.rating ?? null,
    text: String(text || "").trim()
  };

  const fallback = {
    movie: `Shared a movie: ${title}`,
    rating: `Rated ${title} ${share.rating}/10`,
    review: share.text
      ? `Review of ${title}: ${share.text}`
      : `Shared a review of ${title}`,
    article: share.text
      ? `Shared a write-up: ${share.text}`
      : `Shared ${title}`
  };

  return {
    share,
    text: fallback[kind] || `Shared: ${title}`
  };
};
