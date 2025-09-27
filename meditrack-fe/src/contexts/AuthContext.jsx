/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { me as apiMe, signin as apiSignin, logout as apiLogout } from "../services/authApi";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // 최초 세션 확인
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiMe(); // ← 쿠키 세션/토큰으로 프로필 조회
        const u = res?.user ?? (res?.email || res?.id ? res : null) ?? null;
        if (!cancelled) setUser(u);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ✅ 핵심: 로그인 성공 후 즉시 /auth/me로 사용자 정보 갱신
  const signin = async (email, password) => {
    await apiSignin(email, password);   // 200 OK(쿠키/세션 설정)
    try {
      const res = await apiMe();        // 방금 설정된 세션으로 프로필 다시 조회
      const u = res?.user ?? (res?.email || res?.id ? res : null);
      setUser(u || { email });          // 최소한 이메일로라도 user 채움
    } catch {
      setUser({ email });
    }
  };

  const logout = async () => {
    try { await apiLogout(); } catch {}
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, checking, signin, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
