// src/services/apiClient.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE || "https://1a791fd28620.ngrok-free.app/";
console.log("[API] baseURL:", BASE);
export const api = axios.create({
  baseURL: BASE,                // ← 8080으로 직접 보냄
  withCredentials: true,
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
