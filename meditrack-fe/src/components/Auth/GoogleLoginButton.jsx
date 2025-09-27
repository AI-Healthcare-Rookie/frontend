import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../../contexts/AuthContext";

const Wrap = styled.div`
  display: inline-flex;
  margin-top: 8px;
  button {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    background: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
`;

export default function GoogleLoginButton() {
  const ref = useRef(null);
  const { loginWithGoogleIdToken } = useAuth();

  useEffect(() => {
    const cid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !cid) return;

    window.google.accounts.id.initialize({
      client_id: cid,
      callback: async (resp) => {
        await loginWithGoogleIdToken(resp.credential);
      },
    });

    window.google.accounts.id.renderButton(ref.current, {
      theme: "outline",
      size: "large",
      width: 320,
    });
  }, [loginWithGoogleIdToken]);

  return <Wrap><div ref={ref} /></Wrap>;
}
