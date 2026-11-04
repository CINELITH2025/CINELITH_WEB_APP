import axios from "axios";

const TOKEN_KEY = "cinelith-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(err);
  }
);

export const apiErrorMessage = (err, fallback = "Request failed") => {
  const status = err.response?.status;
  if (
    status === 502 ||
    status === 503 ||
    status === 504 ||
    err.code === "ERR_NETWORK" ||
    err.code === "ECONNREFUSED"
  ) {
    return "Cannot reach the backend. In another terminal run: cd backend && npm start — wait for MongoDB connected and port 5050.";
  }
  const body = err.response?.data;
  if (body && typeof body === "object" && body.message) return body.message;
  return err.message || fallback;
};
