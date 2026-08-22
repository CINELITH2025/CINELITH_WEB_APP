const REF_FIELDS = ["friends", "followers", "following", "pendingRequests"];

export const serializeUser = (user) => {
  if (!user) return user;

  const serialized = { ...user, _id: String(user._id) };

  for (const field of REF_FIELDS) {
    if (Array.isArray(serialized[field])) {
      serialized[field] = serialized[field].map(String);
    }
  }

  if (Array.isArray(serialized.collections)) {
    serialized.collections = serialized.collections.map((collection) => ({
      ...collection,
      _id: collection._id ? String(collection._id) : collection._id
    }));
  }

  return serialized;
};
