// src/components/Calendar/DayDetailModal.jsx
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function DayDetailModal({ open, onClose, date, initial, onSubmit }) {
  const [hospitalName, setHospitalName] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState(date || "");
  const [file, setFile] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setHospitalName(initial?.hospitalName || "");
    setPrescriptionDate(initial?.prescriptionDate || date || "");
    setFile(null);
  }, [open, initial, date]);

  if (!open) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("date", date || prescriptionDate); // 기본 키로 날짜도 함께 전송
    fd.append("hospitalName", hospitalName);
    fd.append("prescriptionDate", prescriptionDate);
    if (file) fd.append("attachment", file); // 백엔드 필드명: attachment

    onSubmit(fd); // 메인페이지의 handleSave(formData) 호출
  };

  return (
    <Backdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()} ref={dialogRef}>
        <Header>
          <h3>복약 정보 입력</h3>
          <button onClick={onClose}>✕</button>
        </Header>

        <form onSubmit={handleSave}>
          <Field>
            <label>병원명</label>
            <input
              type="text"
              placeholder="예) 연암이비인후과"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <label>복용일자</label>
            <input
              type="date"
              value={prescriptionDate || ""}
              onChange={(e) => setPrescriptionDate(e.target.value)}
              required
            />
          </Field>

          <Field>
            <label>처방전 첨부</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </Field>

          <Actions>
            <button type="button" onClick={onClose}>취소</button>
            <button type="submit">저장</button>
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
  width: min(520px, 92vw);
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
  input[type="text"], input[type="date"], input[type="file"] {
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
