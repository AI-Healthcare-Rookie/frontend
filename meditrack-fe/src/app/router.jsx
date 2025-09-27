// src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <MainPage /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
]);
