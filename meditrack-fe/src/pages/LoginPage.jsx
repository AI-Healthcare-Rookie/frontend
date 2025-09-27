import styled from "styled-components";
import GoogleLoginButton from "../components/Auth/GoogleLoginButton";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 60px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
  img {
    height: 200px;
  }
  span {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin: 0 0 24px;
`;

const BottomText = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin-top: 40px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  @media (max-width: 768px) {
    display: none;
  }
`;

const Illustration = styled.img`
  max-width: 420px;
  height: auto;
`;

export default function LoginPage() {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/", { replace: true });
  }, [user, nav]);

  return (
    <Container>
      {/* 왼쪽 영역 */}
      <Left>
        <Logo>
          <img src="../../public/logo.png" alt="MediTrack" />
        </Logo>
        <Title>로그인</Title>
        <Subtitle>Google Email으로 로그인해주세요</Subtitle>

        <GoogleLoginButton />

        <BottomText>© 연암공대 X 마산대 헬스케어 해커톤</BottomText>
      </Left>

      {/* 오른쪽 일러스트 */}
      <Right>
        <Illustration src="../../public/main_image.png" alt="Login Illustration" />
      </Right>
    </Container>
  );
}
