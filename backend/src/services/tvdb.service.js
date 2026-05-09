import axios from "axios";

let token = null;
const BASE = "https://api4.thetvdb.com/v4";

export const getTVDBToken = async () => {
  if (token) return token;

  try {
    const res = await axios.post(`${BASE}/login`, {
      apikey: process.env.TVDB_API_KEY
    });

    token = res.data.data.token;
    return token;
  } catch (err) {
    console.error("TVDB AUTH ERROR:", err.message);
    return null;
  }
};

export const tvdbSearch = async (query) => {
  try {
    const auth = await getTVDBToken();
    if (!auth) return [];

    const res = await axios.get(`${BASE}/search`, {
      params: { q: query },
      headers: { Authorization: `Bearer ${auth}` }
    });

    return res.data.data || [];
  } catch (err) {
    console.error("TVDB SEARCH ERROR:", err.message);
    return [];
  }
};
