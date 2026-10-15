import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../../data/knn-recommend.json");
const N_MOVIES_TO_RECOMMEND = 10;

let index = null;

export const invalidateRecommendIndex = () => {
  index = null;
};

const loadIndex = () => {
  if (index) return index;
  if (!fs.existsSync(DATA_PATH)) {
    throw new Error("Recommendation index missing. Run backend/scripts/build_knn_recommender.py");
  }
  const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  const byId = new Map();
  const byTitle = [];
  for (const movie of raw.movies || []) {
    byId.set(Number(movie.movieId), movie);
    byTitle.push({
      movieId: Number(movie.movieId),
      title: String(movie.title || "").toLowerCase()
    });
  }
  index = { raw, byId, byTitle };
  return index;
};

const hydrate = (movie, extra = {}) => {
  if (!movie) return null;
  return {
    movieId: movie.movieId,
    tmdbId: movie.tmdbId,
    title: movie.title,
    year: movie.year,
    overview: movie.overview,
    poster: movie.poster,
    image: movie.poster || "/images/poster_1.png",
    genres: movie.genres || [],
    ...extra
  };
};

const matchMovie = (query) => {
  const { byTitle, byId } = loadIndex();
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return null;
  const exact = byTitle.find((item) => item.title === needle);
  if (exact) return byId.get(exact.movieId);
  const contains = byTitle.find((item) => item.title.includes(needle));
  return contains ? byId.get(contains.movieId) : null;
};

export const findCatalogMovie = ({ title, movieId } = {}) => {
  const { byId } = loadIndex();
  if (movieId != null) {
    const byMovieId = byId.get(Number(movieId));
    if (byMovieId) return byMovieId;
  }
  if (title) return matchMovie(title);
  return null;
};

export const searchRecommendCatalog = (query = "", limit = 24) => {
  const { raw } = loadIndex();
  const needle = String(query || "").trim().toLowerCase();
  const movies = raw.movies || [];
  const filtered = needle
    ? movies.filter((movie) => String(movie.title || "").toLowerCase().includes(needle))
    : movies;
  return filtered.slice(0, limit).map((movie) => hydrate(movie));
};

/** Same contract as untitled0.py get_movie_recommendation(movie_name). */
export const recommendFromMovie = ({ title, movieId } = {}, limit = N_MOVIES_TO_RECOMMEND) => {
  const { raw, byId } = loadIndex();
  let movie = null;
  if (movieId != null) movie = byId.get(Number(movieId));
  if (!movie && title) movie = matchMovie(title);

  if (!movie) {
    return { movie: null, message: "No movies found. Please check your input", recommendations: [] };
  }

  const rows = raw.neighbors[String(movie.movieId)] || [];
  if (!rows.length) {
    return { movie: hydrate(movie), message: "Not enough reviews", recommendations: [] };
  }

  const recommendations = rows
    .slice(0, limit)
    .map((row) => hydrate(byId.get(row.movieId), { distance: row.distance }))
    .filter(Boolean);

  return { movie: hydrate(movie), message: null, recommendations };
};

export const toClientMovie = (movie) => {
  if (!movie) return null;
  const hydrated = hydrate(movie);
  return {
    ...hydrated,
    id: hydrated.movieId,
    genre: (hydrated.genres || []).join(", "),
    description: hydrated.overview || "",
    type: "movie",
    rating: 0,
    director: "",
    pgRating: "",
    runtime: "",
    releaseDate: hydrated.year || "",
    awards: "",
    writer: "",
    clScore: null,
    userScore: null,
    cast: []
  };
};

export const listCatalogMovies = ({ q = "", genre = "", year = "", sort = "popular", limit = 40, offset = 0 } = {}) => {
  const { raw } = loadIndex();
  const needle = String(q || "").trim().toLowerCase();
  const genreNeedle = String(genre || "").trim().toLowerCase();
  let movies = (raw.movies || []).filter((movie) => {
    if (needle && !String(movie.title || "").toLowerCase().includes(needle)) return false;
    if (genreNeedle && !(movie.genres || []).some((item) => String(item).toLowerCase() === genreNeedle)) return false;
    if (year && String(movie.year) !== String(year)) return false;
    return true;
  });

  if (sort === "year") movies.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  else if (sort === "alpha") movies.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  else movies.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

  const total = movies.length;
  movies = movies.slice(Number(offset) || 0, (Number(offset) || 0) + (Number(limit) || 40));
  return { total, movies: movies.map(toClientMovie) };
};

export const getCatalogFilters = () => {
  const { raw } = loadIndex();
  const genres = new Set();
  const years = new Set();
  for (const movie of raw.movies || []) {
    (movie.genres || []).forEach((genre) => genres.add(genre));
    if (movie.year) years.add(String(movie.year));
  }
  return {
    genres: [...genres].sort(),
    years: [...years].sort((a, b) => Number(b) - Number(a))
  };
};

export const getCatalogMovie = (movieId) => {
  const { raw, byId } = loadIndex();
  const movie = byId.get(Number(movieId));
  if (!movie) return null;
  const related = (raw.neighbors[String(movie.movieId)] || [])
    .slice(0, 6)
    .map((row) => toClientMovie(byId.get(row.movieId)))
    .filter(Boolean);
  return { ...toClientMovie(movie), related };
};

export const getHomeCatalog = () => {
  const { raw } = loadIndex();
  const movies = (raw.movies || []).map(toClientMovie);
  const trending = [...movies].sort((a, b) => Number(b.year || 0) - Number(a.year || 0)).slice(0, 10);
  const classics = movies.filter((movie) => Number(movie.year) > 0 && Number(movie.year) < 2000).slice(0, 10);
  return { trending, classics };
};
