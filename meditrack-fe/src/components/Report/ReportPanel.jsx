import { useState } from "react";
import { pdf } from '@react-pdf/renderer';
import ReportPDF from "./ReportPDF";
import { getReportData } from "../../services/visitsApi";

export default function ReportPanel(){
  const [range, setRange] = useState({ from: null, to: null });
  const [data, setData]   = useState(null);
  const [loading,setLoading] = useState(false);

  const openPicker = async () => {
    const from = prompt("시작일(YYYY-MM-DD)");
    const to   = prompt("종료일(YYYY-MM-DD)");
    if (!from || !to) return;
    setRange({ from, to });
  };

  const fetchReport = async () => {
    if (!range.from || !range.to) return;
    setLoading(true);
    try {
      const res = await getReportData(range.from, range.to); // 서버 분석
      setData(res);
    } finally { setLoading(false); }
  };

  const downloadPdf = async () => {
    const blob = await pdf(<ReportPDF data={data} range={range}/>).toBlob();
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediTrack_Report_${range.from}_${range.to}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-2xl p-4 min-h-[420px] flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">약 복용 분석 리포트</h3>
        {!data ? (
          <button onClick={!range.from?openPicker:fetchReport}
                  className="px-3 py-1.5 rounded-lg border">
            {range.from ? "조회하기" : "날짜 선택"}
          </button>
        ) : (
          <button onClick={downloadPdf} className="px-3 py-1.5 rounded-lg border">다운로드</button>
        )}
      </div>

      <div className="flex-1 mt-3 bg-gray-50 rounded-xl p-4 text-gray-400 text-center grid place-items-center">
        {!range.from && <p>조회하기 버튼을 눌러 분석 할 날짜를 입력해주세요</p>}
        {range.from && !data && !loading && <p>기간: {range.from} ~ {range.to}</p>}
        {loading && <p>분석중...</p>}
        {data && <p className="text-gray-600">PDF가 생성되었습니다. 다운로드 버튼을 눌러 저장하세요.</p>}
      </div>
    </div>
  );
}
