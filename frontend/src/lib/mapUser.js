export const toBackendMovieType = (type) =>
  type === "tv" || type === "series" ? "series" : "movie";

export const toBackendMovie = (movie) => ({
  tvdbId: Number(movie.tvdbId || movie.id) || 0,
  title: movie.title || movie.name,
  type: toBackendMovieType(movie.type)
});

export const toBackendActor = (actor) => {
  if (typeof actor === "string") return { name: actor };
  return {
    name: actor.name,
    ...(actor.tvdbId ? { tvdbId: Number(actor.tvdbId) } : {})
  };
};

export const mapMovie = (movie = {}) => ({
  id: movie.tvdbId || movie.id,
  tvdbId: movie.tvdbId || movie.id,
  title: movie.title || movie.name || "Untitled",
  type: movie.type === "series" ? "tv" : movie.type || "movie",
  year: movie.year || "",
  genre: movie.genre || "",
  rating: movie.rating,
  image: movie.image || "/images/poster_1.png",
  director: movie.director,
  cast: movie.cast
});

export const mapUser = (raw) => {
  if (!raw) return null;

  const friends = (raw.friends || []).map((friend) =>
    typeof friend === "object"
      ? {
          _id: String(friend._id),
          name: friend.name,
          email: friend.email,
          avatar: friend.avatar || "/images/actor_1.png",
          bio: friend.bio || ""
        }
      : { _id: String(friend), name: "Cinephile", avatar: "/images/actor_1.png" }
  );

  const username = raw.username
    ? raw.username.startsWith("@")
      ? raw.username
      : `@${raw.username}`
    : `@${String(raw.name || "cinephile").toLowerCase().replace(/\s+/g, "_")}`;

  return {
    _id: String(raw._id),
    name: raw.name,
    email: raw.email,
    username,
    bio: raw.bio || "",
    avatar: raw.avatar || "/images/actor_1.png",
    location: raw.location || "",
    onboardingCompleted: Boolean(raw.onboardingCompleted),
    favoriteMovies: (raw.favoriteMovies?.length ? raw.favoriteMovies : raw.topMovies || []).map(mapMovie),
    topMovies: (raw.topMovies || []).map(mapMovie),
    watchlist: (raw.watchlist || []).map(mapMovie),
    watchedMovies: (raw.recentlyViewed || []).map(mapMovie),
    favoriteActors: (raw.topActors || []).map((actor) => actor.name || actor),
    favoriteGenres: raw.topGenres || [],
    topGenres: raw.topGenres || [],
    ratings: (raw.ratings || []).map((rating) => ({
      id: rating.tvdbId,
      tvdbId: rating.tvdbId,
      title: rating.title,
      rating: rating.rating
    })),
    reviews: raw.reviews || [],
    customLists: (raw.collections || []).map((collection) => ({
      id: collection._id,
      name: collection.name,
      movies: (collection.movies || []).map(mapMovie)
    })),
    cinephileScore: raw.cinephileScore || 0,
    streak: raw.streak || 0,
    friends,
    following: (raw.following || []).map((item) => String(item._id || item)),
    followers: (raw.followers || []).map((item) => String(item._id || item)),
    unreadCount: raw.unreadCount || 0
  };
};

export const mapPerson = (person) => ({
  _id: String(person._id),
  name: person.name,
  handle: person.username
    ? person.username.startsWith("@")
      ? person.username
      : `@${person.username}`
    : `@${String(person.name || "user").toLowerCase().replace(/\s+/g, "_")}`,
  role: "Cinephile",
  genres: person.topGenres || [],
  actors: (person.topActors || []).map((actor) => actor.name || actor),
  movies: (person.topMovies || person.favoriteMovies || []).map((movie) => movie.title || movie),
  bio: person.bio || "Cinephile on CINELITH.",
  followers: 0,
  avatar: person.avatar || "/images/actor_1.png",
  isPrivate: false,
  location: person.location || ""
});

export const mapChatMessage = (msg, myId) => ({
  senderId: String(msg.senderId),
  senderName: msg.senderName,
  sender: String(msg.senderId) === String(myId) ? "You" : msg.senderName,
  text: msg.text,
  timestamp: msg.createdAt
});
