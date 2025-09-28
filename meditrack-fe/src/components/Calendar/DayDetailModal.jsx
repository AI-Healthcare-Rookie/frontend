// src/components/Calendar/DayDetailModal.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = `${API_BASE}/api/medicines/fetch`;

export default function DayDetailModal({ open, onClose, onSubmit }) {
  // 파일은 선택할 수 있지만 전송에는 사용하지 않음
  const [file, setFile] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setFile(null); // 선택 상태만 초기화
  }, [open]);

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();

    // JSON만 보낼 것이므로 파일 검증 제거
    const payload = {
      apiUrl: "http://localhost:8000/ocr",
      // 필요한 값 더 있으면 아래에 추가하면 됨
      // e.g. date, userId 등
    };

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      console.log(res);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Request failed: ${res.status} ${text}`);
      }

      const data = await res.json().catch(() => ({}));
      onSubmit?.(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} ref={dialogRef}>
        <Header>
          <h3>처방전 첨부</h3>
          <button onClick={onClose}>✕</button>
        </Header>

        <form onSubmit={handleSave}>
          <Field>
            <label>처방전 파일 (선택)</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              // required 제거 — JSON만 전송
            />
            {/* 안내 문구 */}
            <small style={{ color: "#6b7280" }}>
              현재는 파일을 업로드하지 않고 JSON 데이터만 서버로 전송합니다.
            </small>
          </Field>

          <Actions>
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit">업로드</button>
          </Actions>
        </form>
      </ModalCard>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: grid; place-items: center;
  z-index: 1000;
`;
const ModalCard = styled.div`
  width: min(420px, 92vw);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
  h3 { margin: 0; font-size: 18px; font-weight: 800; }
  button { border: 0; background: transparent; font-size: 18px; cursor: pointer; }
`;
const Field = styled.div`
  display: grid; gap: 6px; margin: 12px 0;
  label { font-size: 13px; color: #4b5563; }
  input[type="file"] {
    border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px;
    font-size: 14px;
  }
`;
const Actions = styled.div`
  display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px;
  button {
    padding: 8px 12px; border-radius: 10px; border: 1px solid #e5e7eb; cursor: pointer;
  }
  button[type="submit"] {
    background: #4A90E2; color: #fff; border-color: #4A90E2;
  }
`;
