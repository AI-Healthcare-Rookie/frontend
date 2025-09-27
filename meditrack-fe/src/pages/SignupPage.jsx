// src/pages/SignupPage.jsx
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authApi";

const Page = styled.div`
  min-height: 100vh;
  padding: 24px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  img {
    height: 24px;
  }
  span {
    font-weight: 700;
    font-size: 18px;
  }
`;
const Title = styled.h1`
  text-align: center;
  font-size: 32px;
  font-weight: 800;
  margin: 12px 0 20px;
`;

const Steps = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  align-items: center;
  margin-bottom: 24px;
`;
const Step = styled.div`
  text-align: center;
  color: #777;
  font-size: 13px;
`;
const StepIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #5abdde;
  display: grid;
  place-items: center;
  margin: 0 auto 6px;
  img {
    width: 24px;
  }
`;

const Card = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
`;
const SectionTitle = styled.h3`
  font-weight: 700;
  margin: 0 0 12px;
`;
const Label = styled.label`
  display: block;
  font-size: 14px;
  margin: 14px 0 8px;
`;
const Input = styled.input`
  width: 95%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  font-size: 14px;
`;
const Error = styled.p`
  color: #ff2222;
  font-size: 12px;
  margin-top: 6px;
`;
const Submit = styled.button`
  width: 100%;
  margin-top: 18px;
  background: #5abdde;
  color: #fff;
  font-weight: 700;
  border: 0;
  border-radius: 8px;
  padding: 14px;
  &:disabled {
    opacity: 0.6;
  }
`;

export default function SignupPage() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name || !email || !pw || !pw2)
      return setErr("필수 항목을 입력해주세요.");
    if (pw.length < 6 || pw.length > 20)
      return setErr("비밀번호는 6~20자 입니다.");
    if (pw !== pw2) return setErr("비밀번호가 일치하지 않습니다.");

    try {
      setSubmitting(true);
      const payload = {
        username: name.trim(),
        email: email.trim(),
        password: pw,
      };
      console.log(payload);
      await signup(payload); // JSON만 전송
      nav("/signup/done?name=" + encodeURIComponent(name), { replace: true });
    } catch (e) {
      const status = e?.response?.status;
      const msg =
        e?.response?.data?.message ||
        (status === 400
          ? "요청 형식이 올바르지 않습니다. 입력값을 확인해주세요."
          : "가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      setErr(msg);
      console.error("[SIGNUP ERROR]", status, e?.response?.data || e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Header>
        <img src="../../public/main_logo.png" alt="logo" />
      </Header>

      <Title>회원가입</Title>

      <Steps>
        <Step>
          <StepIcon>
            <img src="../../public/person.png" alt="본인인증" />
          </StepIcon>
          본인인증
        </Step>
        <Step>
          <StepIcon>
            <img src="../../public/pencil.png" alt="정보입력" />
          </StepIcon>
          정보입력
        </Step>
        <Step>
          <StepIcon style={{ opacity: 0.3 }}>
            <img src="../../public/yes.png" alt="가입완료" />
          </StepIcon>
          가입완료
        </Step>
      </Steps>

      <Card>
        <form onSubmit={onSubmit}>
          <SectionTitle>회원정보 입력</SectionTitle>

          <Label>이름 *</Label>
          <Input
            placeholder="김연암"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Label>이메일 *</Label>
          <Input
            placeholder="email12345@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label>비밀번호 *</Label>
          <Input
            type="password"
            placeholder="영문, 숫자, 특수문자 포함 6~20자"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <Label>비밀번호 확인 *</Label>
          <Input
            type="password"
            placeholder="비밀번호 확인 입력"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
          />

          {err && <Error>{err}</Error>}

          <Submit type="submit" disabled={submitting}>
            {submitting ? "가입 중..." : "가입하기"}
          </Submit>
        </form>
      </Card>
    </Page>
  );
}
