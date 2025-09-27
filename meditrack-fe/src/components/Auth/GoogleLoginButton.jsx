import { useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function GoogleLoginButton() {
  const btnRef = useRef(null);
  const { loginWithGoogleIdToken } = useAuth();

  useEffect(() => {
    /* global google */
    const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !cid) return;

    google.accounts.id.initialize({
      client_id: cid,
      callback: async (resp) => {
        // resp.credential = Google ID Token (JWT)
        await loginWithGoogleIdToken(resp.credential);
        // 라우터 이동은 LoginPage에서 user 감지 후 실행
      },
    });
    google.accounts.id.renderButton(btnRef.current, {
      theme: "outline", size: "large", width: 320,
    });
  }, [loginWithGoogleIdToken]);

  return <div ref={btnRef} />;
}
