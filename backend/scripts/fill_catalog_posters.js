import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { tvdbMatchMovie } from "../src/services/tvdb.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const OUT_PATH = path.join(__dirname, "../data/knn-recommend.json");
const CACHE_PATH = path.join(__dirname, "../data/poster-cache.json");
const CONCURRENCY = 3;

const isTvdbArt = (url) => String(url || "").includes("artworks.thetvdb.com");

if (!process.env.TVDB_API_KEY) {
  console.error("Missing TVDB_API_KEY in backend/.env");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
const movies = payload.movies || [];
let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) || {};
} catch {
  cache = {};
}

const pending = [];
let kept = 0;
for (const movie of movies) {
  const key = String(movie.movieId);
  const current = isTvdbArt(movie.poster) ? movie.poster : isTvdbArt(cache[key]) ? cache[key] : "";
  if (current) {
    movie.poster = current;
    cache[key] = current;
    kept += 1;
  } else {
    pending.push(movie);
  }
}

console.log(`TVDB posters already baked: ${kept}; looking up: ${pending.length}`);
let filled = 0;
let done = 0;
const started = Date.now();
let index = 0;

const workers = Array.from({ length: CONCURRENCY }, async () => {
  while (index < pending.length) {
    const movie = pending[index];
    index += 1;
    const match = await tvdbMatchMovie(movie.title, movie.year);
    const key = String(movie.movieId);
    const url = match?.image || "";
    movie.poster = url;
    if (match?.tvdbId) movie.tvdbId = match.tvdbId;
    cache[key] = url;
    done += 1;
    if (url) filled += 1;
    if (done % 25 === 0 || done === pending.length) {
      console.log(`  ${done}/${pending.length} lookups (${filled} TVDB posters)`);
      fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
    }
  }
});

await Promise.all(workers);
fs.writeFileSync(OUT_PATH, JSON.stringify(payload));
fs.writeFileSync(CACHE_PATH, JSON.stringify(cache));
const count = movies.filter((movie) => isTvdbArt(movie.poster)).length;
console.log(`Wrote ${OUT_PATH} with ${count}/${movies.length} TVDB posters in ${((Date.now() - started) / 1000).toFixed(1)}s`);
