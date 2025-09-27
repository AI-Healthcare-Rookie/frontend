// src/services/authApi.js
import { api } from "./apiClient";

const raw = import.meta.env.VITE_API_AUTH_PREFIX || "https://04569935294d.ngrok-free.app/api/auth";
const AUTH_PREFIX = "/" + String(raw).replace(/^\/+|\/+$/g, ""); // '/api/auth'
const join = (base, path) => `${base}/${String(path).replace(/^\/+/, "")}`;

// GET http://localhost:8080/api/auth/me
export const me = () => api.get(join(AUTH_PREFIX, "me")).then(r => r.data);

// POST http://localhost:8080/api/auth/logout
export const logout = () => api.post(join(AUTH_PREFIX, "logout"), {}).then(r => r.data);

// ⭐ POST http://localhost:8080/api/auth/signin
export const signin = (email, password) =>
  api.post(join(AUTH_PREFIX, "signin"), { email, password }).then(r => r.data);

// POST http://localhost:8080/api/auth/signup
export const signup = (payload) =>
  api.post(join(AUTH_PREFIX, "signup"), payload).then(r => r.data);
