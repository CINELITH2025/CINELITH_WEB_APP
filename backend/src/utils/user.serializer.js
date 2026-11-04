import { hydrateLibraryMovie } from "../services/recommend.service.js";

const REF_FIELDS = ["friends", "followers", "following", "pendingRequests"];
const MOVIE_LIST_FIELDS = [
  "watchlist",
  "favoriteMovies",
  "topMovies",
  "recentlyViewed",
  "ratings",
  "reviews"
];

const serializeRef = (value) => {
  if (value == null) return value;
  if (typeof value === "object") {
    return {
      _id: String(value._id),
      name: value.name,
      email: value.email,
      avatar: value.avatar || null,
      bio: value.bio || ""
    };
  }
  return String(value);
};

export const serializeUser = (user) => {
  if (!user) return user;

  const serialized = { ...user, _id: String(user._id) };

  for (const field of REF_FIELDS) {
    if (Array.isArray(serialized[field])) {
      serialized[field] = serialized[field].map(serializeRef);
    }
  }

  for (const field of MOVIE_LIST_FIELDS) {
    if (Array.isArray(serialized[field])) {
      serialized[field] = serialized[field].map(hydrateLibraryMovie);
    }
  }

  if (Array.isArray(serialized.collections)) {
    serialized.collections = serialized.collections.map((collection) => ({
      ...collection,
      _id: collection._id ? String(collection._id) : collection._id,
      movies: (collection.movies || []).map(hydrateLibraryMovie)
    }));
  }

  return serialized;
};
