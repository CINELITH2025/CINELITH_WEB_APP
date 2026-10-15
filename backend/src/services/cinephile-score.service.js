import MovieComment from "../models/MovieComment.js";
import Message from "../models/Message.js";
import KnnRating from "../models/KnnRating.js";
import User from "../models/User.js";
import { findCatalogMovie } from "./recommend.service.js";
import { scoreMovie } from "./rating.service.js";

/**
 * Cinephile Score (0–10)
 *
 * Weighted mix of seven 0–10 sub-scores. Missing product surfaces
 * (quizzes, battles, cast/language metadata) contribute 0 today and
 * lift the same formula automatically once those fields are populated.
 */
export const CINEPHILE_WEIGHTS = {
  wa: 0.2,
  eg: 0.18,
  ac: 0.12,
  rq: 0.15,
  dv: 0.12,
  ct: 0.13,
  cr: 0.1
};

const EG_INTERNAL = {
  reviews: 0.22,
  comments: 0.18,
  messages: 0.12,
  social: 0.12,
  collections: 0.08,
  watchlist: 0.08,
  quizzes: 0.12,
  battles: 0.08
};

const clamp = (value, min = 0, max = 10) => Math.min(max, Math.max(min, value));
const round1 = (value) => Math.round(clamp(value) * 10) / 10;
const logCap = (n, target, max = 10) =>
  round1((max * Math.log1p(Math.max(0, n))) / Math.log1p(target));

const startOfUtcDay = (date) => {
  const d = new Date(date);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const movieKey = (item = {}) => {
  const id = item.tvdbId ?? item.movieId ?? item.id;
  if (id != null && Number(id)) return `id:${Number(id)}`;
  const title = String(item.title || "").trim().toLowerCase();
  return title ? `t:${title}` : null;
};

const uniqueMovies = (...lists) => {
  const map = new Map();
  for (const list of lists) {
    for (const item of list || []) {
      const key = movieKey(item);
      if (!key || map.has(key)) continue;
      map.set(key, item);
    }
  }
  return [...map.values()];
};

const catalogFor = (item) =>
  findCatalogMovie({
    movieId: item.tvdbId ?? item.movieId ?? item.id,
    title: item.title
  });

const numericRatings = (user, knnRatings) => {
  const fromProfile = (user.ratings || [])
    .map((row) => Number(row.rating))
    .filter((value) => Number.isFinite(value));
  if (fromProfile.length) return fromProfile;
  return (knnRatings || [])
    .map((row) => Number(row.rating) * 2)
    .filter((value) => Number.isFinite(value));
};

const stddev = (values) => {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (mean - value) ** 2, 0) / values.length;
  return Math.sqrt(variance);
};

const entropyScore = (values) => {
  if (values.length < 2) return 0;
  const bins = Array(10).fill(0);
  for (const value of values) {
    const bucket = Math.min(9, Math.max(0, Math.round(value) - 1));
    bins[bucket] += 1;
  }
  const n = values.length;
  let entropy = 0;
  for (const count of bins) {
    if (!count) continue;
    const p = count / n;
    entropy -= p * Math.log2(p);
  }
  return clamp((entropy / Math.log2(10)) * 10);
};

export const cinephileLevel = (score) => {
  if (score >= 8.5) return "Auteur";
  if (score >= 7) return "Critic";
  if (score >= 5) return "Cinephile";
  if (score >= 3) return "Enthusiast";
  if (score >= 1) return "Explorer";
  return "Newcomer";
};

export const scoreWatchActivity = (watchedCount) => logCap(watchedCount, 80);

export const scoreEngagement = ({
  reviews = 0,
  comments = 0,
  messages = 0,
  friends = 0,
  followers = 0,
  following = 0,
  collections = 0,
  watchlist = 0,
  quizzesPlayed = 0,
  quizzesWon = 0,
  battlesPlayed = 0,
  battlesWon = 0
} = {}) => {
  const parts = {
    reviews: logCap(reviews, 20),
    comments: logCap(comments, 25),
    messages: logCap(messages, 40),
    social: logCap(friends + followers + following, 30),
    collections: logCap(collections, 8),
    watchlist: logCap(watchlist, 25),
    quizzes: clamp(quizzesPlayed * 1.2 + quizzesWon * 1.5),
    battles: clamp(battlesPlayed * 1.5 + battlesWon)
  };
  const total = Object.entries(EG_INTERNAL).reduce(
    (sum, [key, weight]) => sum + parts[key] * weight,
    0
  );
  return round1(total);
};

export const scoreActorCompletion = ({
  favoriteActors = [],
  uniqueActors = 0,
  filmsPerFavoriteActor = 0
} = {}) => {
  const named = favoriteActors.filter(Boolean).length;
  const namedScore = clamp((named / 5) * 5);
  const catalogActors = uniqueActors
    ? logCap(uniqueActors, 40, 4)
    : 0;
  const loyalty = clamp(filmsPerFavoriteActor * 1.2, 0, 3);
  const fallbackDepth = uniqueActors ? 0 : clamp(named * 0.4, 0, 2);
  return round1(namedScore + catalogActors + loyalty + fallbackDepth);
};

export const scoreRatingQuality = (ratings = [], reviewCount = 0) => {
  if (!ratings.length) return 0;
  const nScore = logCap(ratings.length, 40, 3.5);
  const spread = stddev(ratings);
  const spreadScore = clamp(10 - Math.abs(spread - 2.1) * 3.2, 0, 3);
  const extremes = ratings.filter((value) => value <= 1 || value >= 10).length / ratings.length;
  const spamPenalty = extremes > 0.75 ? 2 : extremes > 0.55 ? 1 : 0;
  const thought = entropyScore(ratings) * 0.25;
  const withReviews = clamp((reviewCount / Math.max(ratings.length, 1)) * 2, 0, 2);
  return round1(clamp(nScore + spreadScore + thought + withReviews - spamPenalty));
};

export const scoreDiversity = ({
  genres = [],
  decades = [],
  languages = [],
  topGenres = []
} = {}) => {
  const genreSet = new Set([...(genres || []), ...(topGenres || [])].filter(Boolean));
  const genreScore = clamp((genreSet.size / 10) * 5);
  const decadeScore = clamp(((decades || []).length / 6) * 3.5);
  const languageScore = (languages || []).length
    ? clamp(((languages || []).length / 4) * 1.5)
    : 0;
  return round1(genreScore + decadeScore + languageScore);
};

export const scoreCriticalTaste = (clScores = [], ratings = []) => {
  if (!clScores.length && !ratings.length) return 0;
  if (clScores.length) {
    const meanCl = clScores.reduce((sum, value) => sum + value, 0) / clScores.length;
    const high = clScores.filter((value) => value >= 75).length / clScores.length;
    return round1(clamp((meanCl / 100) * 8 + high * 2));
  }
  const mean = ratings.reduce((sum, value) => sum + value, 0) / ratings.length;
  return round1(clamp((mean / 10) * 6));
};

export const scoreConsistency = ({
  activeDays30 = 0,
  streak = 0,
  hoursSinceLast = Infinity
} = {}) => {
  const recency =
    !Number.isFinite(hoursSinceLast)
      ? 0
      : hoursSinceLast <= 24
        ? 3
        : hoursSinceLast <= 72
          ? 2
          : hoursSinceLast <= 168
            ? 1
            : 0;
  return round1(
    clamp(logCap(activeDays30, 20, 5) + clamp(streak / 7, 0, 2) + recency)
  );
};

export const combineCinephileScore = (subs) => {
  const total = Object.entries(CINEPHILE_WEIGHTS).reduce(
    (sum, [key, weight]) => sum + Number(subs[key] || 0) * weight,
    0
  );
  return round1(total);
};

const collectCatalogSignals = (watched) => {
  const genres = new Set();
  const decades = new Set();
  const languages = new Set();
  const actors = new Set();
  const clScores = [];

  for (const item of watched) {
    const movie = catalogFor(item);
    if (!movie) continue;
    (movie.genres || []).forEach((genre) => genres.add(genre));
    (movie.cast || []).forEach((actor) => {
      const name = typeof actor === "string" ? actor : actor?.name;
      if (name) actors.add(name);
    });
    if (movie.year) decades.add(String(Math.floor(Number(movie.year) / 10) * 10));
    if (movie.language || movie.originalLanguage) {
      languages.add(String(movie.language || movie.originalLanguage));
    }
    const scored = scoreMovie(movie.movieId);
    if (scored?.clScore != null) clScores.push(scored.clScore);
  }

  return {
    genres: [...genres],
    decades: [...decades],
    languages: [...languages],
    uniqueActors: actors.size,
    actorSet: actors,
    clScores
  };
};

export const computeCinephileScore = (user, extras = {}) => {
  const watched = uniqueMovies(
    user.recentlyViewed,
    user.ratings,
    user.favoriteMovies,
    user.topMovies,
    user.reviews,
    extras.knnRatings
  );
  const catalog = collectCatalogSignals(watched);
  const favoriteActors = (user.topActors || [])
    .map((actor) => (typeof actor === "string" ? actor : actor?.name))
    .filter(Boolean);
  const filmsPerFavoriteActor = favoriteActors.length
    ? favoriteActors.reduce(
        (sum, name) => sum + (catalog.actorSet.has(name) ? 1 : 0),
        0
      ) / favoriteActors.length
    : 0;

  const ratings = numericRatings(user, extras.knnRatings);
  const activityDates = [
    ...(user.recentlyViewed || []).map((row) => row.viewedAt),
    ...(user.reviews || []).map((row) => row.createdAt),
    ...(extras.knnRatings || []).map((row) => row.updatedAt || row.createdAt),
    user.lastActiveAt,
    user.updatedAt
  ].filter(Boolean);

  const now = Date.now();
  const cutoff = now - 30 * 24 * 60 * 60 * 1000;
  const days = new Set(
    activityDates
      .map((date) => new Date(date).getTime())
      .filter((ts) => ts >= cutoff)
      .map((ts) => startOfUtcDay(ts))
  );
  const lastTs = activityDates.length
    ? Math.max(...activityDates.map((date) => new Date(date).getTime()))
    : null;

  const subs = {
    wa: scoreWatchActivity(watched.length),
    eg: scoreEngagement({
      reviews: (user.reviews || []).length,
      comments: extras.comments || 0,
      messages: extras.messages || 0,
      friends: (user.friends || []).length,
      followers: (user.followers || []).length,
      following: (user.following || []).length,
      collections: (user.collections || []).length,
      watchlist: (user.watchlist || []).length,
      quizzesPlayed: user.quizzesPlayed || 0,
      quizzesWon: user.quizzesWon || 0,
      battlesPlayed: user.battlesPlayed || 0,
      battlesWon: user.battlesWon || 0
    }),
    ac: scoreActorCompletion({
      favoriteActors,
      uniqueActors: catalog.uniqueActors,
      filmsPerFavoriteActor
    }),
    rq: scoreRatingQuality(ratings, (user.reviews || []).length),
    dv: scoreDiversity({
      genres: catalog.genres,
      decades: catalog.decades,
      languages: [...catalog.languages, ...(user.preferredLanguages || [])],
      topGenres: user.topGenres || []
    }),
    ct: scoreCriticalTaste(catalog.clScores, ratings),
    cr: scoreConsistency({
      activeDays30: days.size,
      streak: user.streak || 0,
      hoursSinceLast: lastTs == null ? Infinity : (now - lastTs) / 36e5
    })
  };

  const total = combineCinephileScore(subs);
  return {
    cinephileScore: total,
    level: cinephileLevel(total),
    breakdown: subs,
    weights: CINEPHILE_WEIGHTS,
    signals: {
      watched: watched.length,
      ratings: ratings.length,
      reviews: (user.reviews || []).length,
      comments: extras.comments || 0,
      quizzesPlayed: user.quizzesPlayed || 0,
      battlesPlayed: user.battlesPlayed || 0
    }
  };
};

export const applyStreak = (user, at = new Date()) => {
  const today = startOfUtcDay(at);
  const last = user.lastActiveAt ? startOfUtcDay(user.lastActiveAt) : null;
  const dayMs = 86400000;
  if (last == null) user.streak = Math.max(user.streak || 0, 1);
  else if (last === today) {
    /* already counted today */
  } else if (today - last === dayMs) user.streak = (user.streak || 0) + 1;
  else user.streak = 1;
  user.lastActiveAt = at;
  return user;
};

export const refreshCinephileScore = async (userOrId) => {
  const user =
    typeof userOrId === "object" && userOrId?._id
      ? userOrId
      : await User.findById(userOrId);
  if (!user) return null;

  const userId = user._id;
  const [comments, messages, knnRatings] = await Promise.all([
    MovieComment.countDocuments({ userId }),
    Message.countDocuments({ sender: userId }),
    KnnRating.find({ userId }).select("movieId title rating createdAt updatedAt").lean()
  ]);

  const result = computeCinephileScore(user, { comments, messages, knnRatings });
  user.cinephileScore = result.cinephileScore;
  user.cinephileBreakdown = result.breakdown;
  user.cinephileLevel = result.level;
  user.cinephileScoreUpdatedAt = new Date();
  if (typeof user.save === "function") await user.save();
  else {
    await User.updateOne(
      { _id: userId },
      {
        cinephileScore: result.cinephileScore,
        cinephileBreakdown: result.breakdown,
        cinephileLevel: result.level,
        cinephileScoreUpdatedAt: user.cinephileScoreUpdatedAt
      }
    );
  }
  return result;
};
