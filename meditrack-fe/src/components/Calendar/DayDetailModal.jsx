// src/components/Calendar/DayDetailModal.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const ENDPOINT = `${API_BASE}/medicine/fetch`;

export default function DayDetailModal({ open, onClose, onSubmit }) {
  const [file, setFile] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setFile(null);
  }, [open]);

  if (!open) return null;

  const handleSave = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("첨부파일을 선택해주세요.");
      return;
    }

    const fd = new FormData();
    fd.append("attachment", file);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      const data = await res.json().catch(() => ({}));
      onSubmit?.(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
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
            <label>처방전 파일</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
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
