// src/services/apiClient.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "https://723d2b841829.ngrok-free.app/";

export const api = axios.create({
  baseURL: BASE,                // ← 8080으로 직접 보냄
  withCredentials: false,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    console.error("[API ERROR]", e?.config?.method?.toUpperCase(), e?.config?.url, e?.response?.status, e?.message);
    return Promise.reject(e);
  }
);
