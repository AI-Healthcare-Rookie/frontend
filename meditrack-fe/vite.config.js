// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://c30c12aca7b4.ngrok-free.app/", // 백엔드 ngrok
        changeOrigin: true,
        secure: false,
        // ngrok 경고 우회: 헤더 대신 쿼리스트링으로 붙여 preflight 최소화
        rewrite: (path) =>
          path.replace(/^\/api/, "") +
          (path.includes("?") ? "&" : "?") +
          "ngrok-skip-browser-warning=true",
      },
    },
  },
});
