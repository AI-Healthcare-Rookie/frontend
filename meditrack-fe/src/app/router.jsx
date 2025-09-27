import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import SignupPage from "../pages/SignupPage";
import SignupDonePage from "../pages/SignupDonePage";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },          // 정보입력(스텝2)
  { path: "/signup/done", element: <SignupDonePage /> }, // 가입완료
  { path: "/", element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    )
  },
]);
