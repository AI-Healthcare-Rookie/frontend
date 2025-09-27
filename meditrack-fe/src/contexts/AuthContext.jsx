import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/apiClient";

const AuthCtx = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {name, email, picture}

  // 새로고침 시 세션 확인
  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const loginWithGoogleIdToken = async (idToken) => {
    const { data } = await api.post("/auth/google", { idToken });
    setUser(data.user); // 서버가 user 정보 리턴
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loginWithGoogleIdToken, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
