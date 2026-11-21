import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { findCatalogMovie } from "./recommend.service.js";
import { tvdbMatchMovie } from "./tvdb.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, "../../data/poster-cache.json");
const MAX_INFLIGHT = 3;

let cache = null;
const inflight = new Map();
const waiters = [];
let active = 0;
let saveTimer = null;

const loadCache = () => {
  if (cache) return cache;
  cache = {};
  try {
    if (fs.existsSync(CACHE_PATH)) {
      cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) || {};
    }
  } catch {
    cache = {};
  }
  return cache;
};

const scheduleSave = () => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.writeFileSync(CACHE_PATH, JSON.stringify(loadCache()));
    } catch (err) {
      console.error("Poster cache save failed", err.message);
    }
  }, 800);
};

const isTvdbArt = (url) => String(url || "").includes("artworks.thetvdb.com");

export const svgPoster = (movie) => {
  const title = String(movie?.title || "Film")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const year = movie?.year ? String(movie.year) : "";
  const label = title.length > 28 ? `${title.slice(0, 26)}…` : title;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1528"/>
      <stop offset="100%" stop-color="#08060d"/>
    </linearGradient>
  </defs>
  <rect width="400" height="600" fill="url(#g)"/>
  <rect x="18" y="18" width="364" height="564" fill="none" stroke="#F5BF26" stroke-opacity="0.35" stroke-width="2"/>
  <text x="200" y="290" text-anchor="middle" fill="#F5BF26" font-family="Georgia, serif" font-size="22" font-weight="700">${label}</text>
  <text x="200" y="328" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">${year}</text>
</svg>`;
};

const runLimited = async (fn) => {
  if (active >= MAX_INFLIGHT) {
    await new Promise((resolve) => waiters.push(resolve));
  }
  active += 1;
  try {
    return await fn();
  } finally {
    active -= 1;
    const next = waiters.shift();
    if (next) next();
  }
};

const lookupPoster = async (movieId) => {
  const store = loadCache();
  const key = String(movieId);
  if (isTvdbArt(store[key])) return store[key];

  const movie = findCatalogMovie({ movieId });
  if (!movie) return null;
  if (isTvdbArt(movie.poster)) {
    store[key] = movie.poster;
    scheduleSave();
    return movie.poster;
  }

  const match = await tvdbMatchMovie(movie.title, movie.year);
  const url = match?.image || "";
  store[key] = url;
  scheduleSave();
  return url || null;
};

export const peekPoster = (movieId) => {
  const movie = findCatalogMovie({ movieId });
  if (isTvdbArt(movie?.poster)) return movie.poster;
  const value = loadCache()[String(movieId)];
  return isTvdbArt(value) ? value : null;
};

export const warmPoster = (movieId) => {
  const key = String(movieId);
  if (peekPoster(key)) return;
  if (inflight.has(key)) return inflight.get(key);
  const work = runLimited(() => lookupPoster(key)).finally(() => inflight.delete(key));
  inflight.set(key, work);
  return work;
};

export const resolvePoster = async (movieId) => {
  const cached = peekPoster(movieId);
  if (cached) return { type: "url", value: cached };

  const movie = findCatalogMovie({ movieId });
  warmPoster(movieId);
  return { type: "svg", value: svgPoster(movie || { title: "Film" }) };
};

export const posterPathFor = (movieId) => `/api/catalog/poster/${movieId}`;
