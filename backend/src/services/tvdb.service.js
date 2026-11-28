import axios from "axios";

let token = null;
const BASE = "https://api4.thetvdb.com/v4";
const ARTWORK = "https://artworks.thetvdb.com";

const absArtwork = (url) => {
  const value = String(url || "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${ARTWORK}${value}`;
  return `${ARTWORK}/${value}`;
};

export const getTVDBToken = async () => {
  if (token) return token;
  if (!process.env.TVDB_API_KEY) {
    console.error("TVDB AUTH ERROR: TVDB_API_KEY is missing");
    return null;
  }

  try {
    const res = await axios.post(`${BASE}/login`, {
      apikey: process.env.TVDB_API_KEY
    });
    token = res.data?.data?.token || null;
    return token;
  } catch (err) {
    token = null;
    console.error("TVDB AUTH ERROR:", err.message);
    return null;
  }
};

const tvdbGet = async (path, params = {}) => {
  let auth = await getTVDBToken();
  if (!auth) return null;
  try {
    return await axios.get(`${BASE}${path}`, {
      params,
      headers: { Authorization: `Bearer ${auth}` },
      timeout: 8000
    });
  } catch (err) {
    if (err.response?.status === 401) {
      token = null;
      auth = await getTVDBToken();
      if (!auth) return null;
      return axios.get(`${BASE}${path}`, {
        params,
        headers: { Authorization: `Bearer ${auth}` },
        timeout: 8000
      });
    }
    throw err;
  }
};

export const tvdbSearch = async (query) => {
  try {
    const res = await tvdbGet("/search", { query });
    return res?.data?.data || [];
  } catch (err) {
    console.error("TVDB SEARCH ERROR:", err.message);
    return [];
  }
};

const scoreHit = (hit, title, year) => {
  const name = String(hit?.name || hit?.title || "").toLowerCase();
  const needle = String(title || "").toLowerCase();
  const hitYear = String(hit?.year || (hit?.first_air_time || "").slice(0, 4) || "");
  let score = 0;
  if (name === needle) score += 8;
  else if (name.includes(needle) || needle.includes(name)) score += 3;
  if (year && hitYear === String(year)) score += 6;
  if (hit?.image_url || hit?.image || hit?.poster || hit?.thumbnail) score += 2;
  if (String(hit?.type || "").toLowerCase() === "movie") score += 2;
  return score;
};

const PLACEHOLDER = "missing/movie.jpg";
const detailCache = new Map();
const DETAIL_TTL = 60 * 60 * 1000;
let genreCache = null;

const tvdbIdOf = (hit) =>
  Number(hit?.tvdb_id || hit?.id || String(hit?.objectID || "").replace(/\D/g, "")) || null;

export const artworkUrl = (url) => {
  const value = absArtwork(url);
  if (!value || value.includes(PLACEHOLDER)) return "";
  return value;
};

export const toClientTvdbMovie = (hit = {}, extra = {}) => {
  const tvdbId = extra.tvdbId || tvdbIdOf(hit);
  const genres = extra.genres || hit.genres || [];
  const genreNames = genres
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean);
  const image = artworkUrl(extra.image || hit.image_url || hit.image || hit.poster || hit.thumbnail);
  const year = String(extra.year || hit.year || (hit.first_air_time || "").slice(0, 4) || "");
  const title = extra.title || hit.name || hit.title || "Untitled";
  const overview = extra.overview || hit.overview || "";
  return {
    id: tvdbId,
    tvdbId,
    movieId: extra.movieId || tvdbId,
    title,
    year,
    overview,
    description: overview,
    poster: image,
    image,
    genres: genreNames,
    genre: genreNames.join(", "),
    type: "movie",
    rating: 0,
    director: extra.director || "",
    writer: extra.writer || "",
    pgRating: extra.pgRating || "",
    runtime: extra.runtime ? `${extra.runtime} min` : "",
    releaseDate: extra.releaseDate || year,
    awards: extra.awards || "",
    clScore: null,
    userScore: null,
    cast: extra.cast || [],
    ...extra.more
  };
};

export const tvdbListGenres = async () => {
  if (genreCache) return genreCache;
  try {
    const res = await tvdbGet("/genres");
    genreCache = (res?.data?.data || [])
      .map((genre) => ({ id: genre.id, name: genre.name }))
      .filter((genre) => genre.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    return genreCache;
  } catch (err) {
    console.error("TVDB GENRES ERROR:", err.message);
    return [];
  }
};

export const tvdbCatalogFilters = async () => {
  const genres = await tvdbListGenres();
  const current = new Date().getFullYear();
  const years = [];
  for (let year = current; year >= 1920; year -= 1) years.push(String(year));
  return { genres: genres.map((genre) => genre.name), years };
};

const peopleOfType = (characters, type) =>
  (characters || [])
    .filter((row) => String(row.peopleType || "") === type)
    .map((row) => row.personName || row.name)
    .filter(Boolean);

export const getTvdbMovieDetails = async (tvdbId) => {
  const id = Number(tvdbId);
  if (!id) return null;
  const cached = detailCache.get(id);
  if (cached && Date.now() - cached.at < DETAIL_TTL) return cached.movie;

  try {
    const [extRes, trRes] = await Promise.all([
      tvdbGet(`/movies/${id}/extended`),
      tvdbGet(`/movies/${id}/translations/eng`).catch(() => null)
    ]);
    const data = extRes?.data?.data;
    if (!data) return null;
    const translation = trRes?.data?.data || {};
    const characters = data.characters || [];
    const actors = characters
      .filter((row) => row.peopleType === "Actor")
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(a.sort || 0) - Number(b.sort || 0))
      .slice(0, 12)
      .map((row) => ({
        name: row.personName || row.name,
        role: row.name || "",
        image: artworkUrl(row.image)
      }))
      .filter((row) => row.name);
    const rating = (data.contentRatings || []).find((row) => row.country === "usa") || data.contentRatings?.[0];
    const awards = [...new Set((data.awards || []).map((row) => row.name).filter(Boolean))]
      .slice(0, 4)
      .join(", ");
    const movie = toClientTvdbMovie(data, {
      tvdbId: id,
      title: translation.name || data.name,
      overview: translation.overview || "",
      year: data.year,
      image: data.image,
      genres: data.genres || [],
      director: peopleOfType(characters, "Director").slice(0, 3).join(", "),
      writer: peopleOfType(characters, "Writer").slice(0, 3).join(", "),
      runtime: data.runtime,
      pgRating: rating?.name || rating?.rating || "",
      releaseDate: data.first_release?.date || data.year || "",
      awards,
      cast: actors
    });
    detailCache.set(id, { at: Date.now(), movie });
    return movie;
  } catch (err) {
    console.error("TVDB MOVIE DETAILS ERROR:", err.message);
    return null;
  }
};

const matchesSearchTerms = (title, query) => {
  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const normalizedTitle = normalize(title);
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;
  if (normalizedTitle.includes(normalizedQuery)) return true;

  const ignored = new Set(["a", "an", "and", "for", "in", "of", "on", "or", "the", "to"]);
  const queryTerms = normalizedQuery.split(/\s+/).filter((term) => term.length > 1 && !ignored.has(term));
  if (!queryTerms.length) return normalizedTitle.includes(normalizedQuery);

  const titleTerms = new Set(normalizedTitle.split(/\s+/));
  const matches = queryTerms.filter((term) => titleTerms.has(term)).length;
  return matches >= Math.max(1, Math.ceil(queryTerms.length * 0.6));
};

export const listTvdbMovies = async ({
  q = "",
  genre = "",
  year = "",
  sort = "popular",
  limit = 60,
  offset = 0
} = {}) => {
  const take = Math.min(Number(limit) || 60, 100);
  const skip = Number(offset) || 0;
  const needle = String(q || "").trim();

  if (needle) {
    const res = await tvdbGet("/search", {
      query: needle,
      type: "movie",
      limit: 50,
      ...(year ? { year: String(year) } : {})
    });
    let hits = (res?.data?.data || []).filter((hit) =>
      matchesSearchTerms(hit.name || hit.title, needle)
    );
    const genreNeedle = String(genre || "").trim().toLowerCase();
    if (genreNeedle) {
      hits = hits.filter((hit) =>
        (hit.genres || []).some((item) => String(item).toLowerCase() === genreNeedle)
      );
    }
    if (sort === "year") hits.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
    else if (sort === "alpha") hits.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
    const total = hits.length;
    const movies = hits.slice(skip, skip + take).map((hit) => toClientTvdbMovie(hit));
    return { total, movies };
  }

  const genres = await tvdbListGenres();
  const genreId = genres.find((item) => item.name.toLowerCase() === String(genre || "").trim().toLowerCase())?.id;
  const page = Math.floor(skip / 500);
  const params = { page };
  if (sort === "alpha") params.sort = "name";
  else params.sort = "score";
  if (year) params.year = String(year);
  if (genreId) params.genre = genreId;

  const res = await tvdbGet("/movies/filter", params);
  const rows = res?.data?.data || [];
  const total = res?.data?.links?.total_items || rows.length;
  const start = skip % 500;
  const movies = rows.slice(start, start + take).map((hit) => toClientTvdbMovie(hit));
  return { total, movies };
};

export const getTvdbHomeCatalog = async () => {
  const popular = await listTvdbMovies({ sort: "popular", limit: 10, offset: 0 });
  const classics = await listTvdbMovies({ year: "1994", sort: "popular", limit: 10, offset: 0 });
  return { trending: popular.movies, classics: classics.movies };
};

export const tvdbMatchMovie = async (title, year) => {
  const query = String(title || "").trim();
  if (!query) return null;
  try {
    const params = { query, type: "movie", limit: 8 };
    if (year) params.year = String(year);
    let res = await tvdbGet("/search", params);
    let hits = res?.data?.data || [];
    if (!hits.length && year) {
      res = await tvdbGet("/search", { query, type: "movie", limit: 8 });
      hits = res?.data?.data || [];
    }
    if (!hits.length) return null;
    hits.sort((a, b) => scoreHit(b, title, year) - scoreHit(a, title, year));
    const hit = hits[0];
    const image = absArtwork(hit.image_url || hit.image || hit.poster || hit.thumbnail);
    return {
      tvdbId: Number(hit.tvdb_id || String(hit.id || "").replace(/\D/g, "")) || null,
      title: hit.name || hit.title || title,
      year: hit.year || year || "",
      overview: hit.overview || "",
      image
    };
  } catch (err) {
    console.error("TVDB MOVIE MATCH ERROR:", err.message);
    return null;
  }
};
