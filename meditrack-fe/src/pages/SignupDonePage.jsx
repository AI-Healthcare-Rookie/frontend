import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f7fafb;
`;
const Box = styled.div`
  text-align: center;
  padding: 24px;
`;
const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 12px 0 20px;
`;
const Steps = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  align-items: center;
  margin-bottom: 16px;
`;
const Step = styled.div`
  text-align: center;
  color: #777;
  font-size: 13px;
`;
const Icon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #5abdde;
  display: grid;
  place-items: center;
  margin: 0 auto 6px;
  img {
    width: 26px;
    filter: invert(1);
  }
`;
const Welcome = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin: 12px 0 8px;
`;
const Desc = styled.p`
  color: #777;
  margin: 0 0 12px;
`;
const Img = styled.img`
  width: 120px;
  margin: 20px auto;
  display: block;
`;
const Btn = styled.button`
  width: 360px;
  background: #5abdde;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 14px;
  font-weight: 700;
`;

export default function SignupDonePage() {
  const [sp] = useSearchParams();
  const name = sp.get("name") || "";
  const nav = useNavigate();

  return (
    <Page>
      <Box>
        <Title>가입완료</Title>

        <Steps>
          <Step>
            <Icon>
              <img src="../../public/person.png" />
            </Icon>
            본인인증
          </Step>
          <Step>
            <Icon>
              <img src="../../public/pencil.png" />
            </Icon>
            정보입력
          </Step>
          <Step>
            <Icon>
              <img src="../../public/yes.png" />
            </Icon>
            가입완료
          </Step>
        </Steps>

        <Welcome>{name}님, 환영합니다!</Welcome>
        <Desc>
          맞춤형 복약 관리와 안전한 환자 생활을 위한 스마트 헬스케어 솔루션
          <br />
          <b>MediTrack</b>과 함께해요!
        </Desc>

        <Img src="/images/fireworks.png" alt="축하" />
        <Btn onClick={() => nav("/login", { replace: true })}>로그인하기</Btn>
      </Box>
    </Page>
  );
}
