const normalizeType = (value) =>
  String(value || "movie").trim().toLowerCase() === "series" ? "series" : "movie";

export const normalizeMovies = (movies = []) =>
  (Array.isArray(movies) ? movies : [])
    .filter((movie) => movie?.title)
    .map((movie) => ({
      tvdbId: Number(movie.tvdbId) || 0,
      title: String(movie.title).trim(),
      type: normalizeType(movie.type)
    }));

export const normalizeActors = (actors = []) =>
  (Array.isArray(actors) ? actors : [])
    .filter((actor) => actor?.name)
    .map((actor) => ({
      name: String(actor.name).trim(),
      ...(actor.tvdbId ? { tvdbId: Number(actor.tvdbId) } : {})
    }));

export const normalizeStringList = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => String(item).trim())
    .filter(Boolean);

export const buildOnboardingFields = (body = {}) => {
  const fields = {
    topGenres: normalizeStringList(body.topGenres),
    topMovies: normalizeMovies(body.topMovies),
    topActors: normalizeActors(body.topActors),
    preferredLanguages: normalizeStringList(body.preferredLanguages),
    preferredPlatforms: normalizeStringList(body.preferredPlatforms),
    onboardingCompleted: body.onboardingCompleted === true
  };

  if (body.bio !== undefined) fields.bio = body.bio;
  if (body.location !== undefined) fields.location = body.location;
  if (body.avatar !== undefined) fields.avatar = body.avatar || null;

  return fields;
};
