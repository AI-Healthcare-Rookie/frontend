import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function DayDetailModal({ open, onClose, date, initial, onSubmit }) {
  const [hospitalName,setHospitalName] = useState("");
  const [dosageDays,setDosageDays]     = useState(1);
  const [file,setFile]                 = useState(null);

  useEffect(()=>{
    setHospitalName(initial?.hospitalName || "");
    setDosageDays(initial?.dosageDays || 1);
    setFile(null);
  },[initial, open]);

  const handleSave = () => {
    onSubmit({ date, hospitalName, dosageDays, file });
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6">
          <Dialog.Title className="text-xl font-semibold">
            {date} 일일 상세 내역
          </Dialog.Title>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm text-gray-600">병원명</label>
              <input className="mt-1 w-full border rounded-lg p-2"
                     value={hospitalName} onChange={e=>setHospitalName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">복용일수</label>
              <input type="number" min="1" className="mt-1 w-full border rounded-lg p-2"
                     value={dosageDays} onChange={e=>setDosageDays(+e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600">처방전 첨부</label>
              <input type="file" accept="image/*,application/pdf"
                     className="mt-1 w-full"
                     onChange={e=>setFile(e.target.files?.[0]||null)} />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button className="px-4 py-2 rounded-lg border" onClick={onClose}>취소</button>
            <button className="px-4 py-2 rounded-lg bg-black text-white" onClick={handleSave}>저장</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
