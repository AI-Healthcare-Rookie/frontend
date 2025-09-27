// src/app/router.jsx
import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: (
      <ProtectedRoute>
        <LoginPage />
      </ProtectedRoute>
    )
  },
]);
