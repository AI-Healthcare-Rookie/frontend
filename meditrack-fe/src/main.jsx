import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./app/queryClient";
import AuthProvider from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>
);
