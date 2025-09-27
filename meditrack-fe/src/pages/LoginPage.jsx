// src/pages/LoginPage.jsx
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
const Left = styled.section`
  display: flex;
  align-items: center;
  padding: 0 60px;
`;
const Box = styled.div`
  width: 100%;
  max-width: 480px;
`;
const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  img { height: 28px; }
  span { font-weight: 700; font-size: 18px; }
`;
const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  margin: 0 0 8px;
`;
const Sub = styled.p`
  color: #777;
  margin: 0 0 24px;
`;
const Label = styled.label`
  display: block;
  font-size: 14px;
  margin: 16px 0 6px;
`;
const Input = styled.input`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  background: #fafafa;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0 18px;
  color: #777;
  font-size: 13px;
`;
const Btn = styled.button`
  width: 100%;
  background: #5ABDDE;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 14px;
  font-weight: 700;
  &:disabled { opacity: 0.6; }
`;
const Footer = styled.p`
  text-align: left;
  margin-top: 14px;
  color: #777;
  font-size: 13px;
  a { font-weight: 700; color: #000; margin-left: 8px; }
`;
const Right = styled.section`
  display: grid;
  place-items: center;
  @media (max-width: 1024px) { display: none; }
`;
const Illust = styled.img`
  max-width: 520px;
  height: auto;
`;
const ErrorMsg = styled.p`
  color: #ff2222;
  font-size: 12px;
  margin-top: 8px;
`;

export default function LoginPage() {
  const { user, checking, signin } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // 저장된 이메일 불러오기
  useEffect(() => {
    const last = localStorage.getItem("mt_last_email");
    if (last) {
      setEmail(last);
      setRemember(true);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setLoading(true);
    try {
      await signin(email.trim(), pw);

      // remember 처리
      if (remember) localStorage.setItem("mt_last_email", email.trim());
      else localStorage.removeItem("mt_last_email");

      // ✅ 로그인 성공 즉시 메인으로 이동
      nav("/", { replace: true });
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "로그인에 실패했습니다. 이메일/비밀번호 또는 서버 경로를 확인해주세요.";
      setErr(msg);
      console.error("[LOGIN ERROR]", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Left>
        <Box>
          <Brand>
            {/* 팀 규칙: public에 있는 자산 원래 경로 유지 */}
            <img src="../../public/main_logo.png" alt="MediTrack" />
          </Brand>

          <Title>로그인</Title>
          <Sub>이메일과 비밀번호를 입력하세요</Sub>

          <form onSubmit={onSubmit}>
            <Label htmlFor="login-email">이메일</Label>
            <Input
              id="login-email"
              placeholder="email12345@gmail.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Label htmlFor="login-password">비밀번호</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="****************"
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={loading}
            />

            <Row>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                아이디 저장
              </label>
              <div>
                <a href="#" onClick={(e) => e.preventDefault()}>이메일 찾기</a>
                &nbsp;&nbsp;
                <a href="#" onClick={(e) => e.preventDefault()}>비밀번호 찾기</a>
              </div>
            </Row>

            <Btn type="submit" disabled={!email || !pw || loading || checking}>
              {loading ? "로그인 중..." : "로그인"}
            </Btn>

            {err && <ErrorMsg>{err}</ErrorMsg>}
          </form>

          <Footer>
            아직 계정이 없으신가요?
            <Link to="/signup">회원가입</Link>
          </Footer>

          <p style={{ color: "#777", fontSize: 12, marginTop: 40 }}>
            © 연암공대 X 마산대 헬스케어 해커톤
          </p>
        </Box>
      </Left>

      <Right>
        <Illust src="../../public/main_image.png" alt="illustration" />
      </Right>
    </Page>
  );
}
