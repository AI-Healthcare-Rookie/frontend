import { Dialog } from "@headlessui/react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from "../common/Button";

const Panel = styled(Dialog.Panel)`
  width: 100%; max-width: 560px; border-radius: 20px; background: #fff; padding: 24px;
  box-shadow: 0 12px 30px rgba(0,0,0,.12);
`;
const Field = styled.div` margin-top: 14px; `;
const Label = styled.label` font-size: 12px; color: #6b7280; `;
const Input = styled.input`
  width: 100%; margin-top: 6px; padding: 10px 12px;
  border: 1px solid #e5e7eb; border-radius: 12px;
`;

export default function DayDetailModal({ open, onClose, date, initial, onSubmit }) {
  const [hospitalName, setHospitalName] = useState("");
  const [dosageDays, setDosageDays] = useState(1);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setHospitalName(initial?.hospitalName || "");
    setDosageDays(initial?.dosageDays || 1);
    setFile(null);
  }, [initial, open]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Panel>
          <Dialog.Title style={{fontSize:18, fontWeight:700}}>
            {date} 일일 상세 내역
          </Dialog.Title>

          <Field>
            <Label>병원명</Label>
            <Input value={hospitalName} onChange={(e)=>setHospitalName(e.target.value)} />
          </Field>
          <Field>
            <Label>복용일수</Label>
            <Input type="number" min="1" value={dosageDays} onChange={(e)=>setDosageDays(+e.target.value)} />
          </Field>
          <Field>
            <Label>처방전 첨부</Label>
            <Input type="file" accept="image/*,application/pdf" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          </Field>

          <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:20}}>
            <Button onClick={onClose}>취소</Button>
            <Button variant="solid" onClick={()=>onSubmit({ date, hospitalName, dosageDays, file })}>
              저장
            </Button>
          </div>
        </Panel>
      </div>
    </Dialog>
  );
}
