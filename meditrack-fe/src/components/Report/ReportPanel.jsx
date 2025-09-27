import styled from "styled-components";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import ReportPDF from "./ReportPDF";
import Button from "../common/Button";
import SectionCard from "../common/SectionCard";
import { getReportData } from "../../services/visitsApi";

const Header = styled.div` display:flex; justify-content:space-between; align-items:center; `;
const Canvas = styled.div`
  margin-top: 12px; min-height: 420px; border: 1px solid #e5e7eb;
  border-radius: 16px; display:grid; place-items:center;
  color: #9ca3af; text-align:center;
`;

export default function ReportPanel(){
  const [range, setRange] = useState({ from: null, to: null });
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(false);

  const pick = () => {
    const from = prompt("시작일(YYYY-MM-DD)");
    const to   = prompt("종료일(YYYY-MM-DD)");
    if (from && to) setRange({ from, to });
  };

  const fetch = async () => {
    if (!range.from || !range.to) return;
    setLoading(true);
    try { setData(await getReportData(range.from, range.to)); }
    finally { setLoading(false); }
  };

  const download = async () => {
    const blob = await pdf(<ReportPDF data={data} range={range}/>).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `MediTrack_Report_${range.from}_${range.to}.pdf`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <SectionCard>
      <Header>
        <h3 style={{fontWeight:700}}>약 복용 분석 리포트</h3>
        {!data ? (
          <Button onClick={!range.from ? pick : fetch}>{range.from ? "조회하기" : "날짜 선택"}</Button>
        ) : (
          <Button onClick={download}>다운로드</Button>
        )}
      </Header>

      <Canvas>
        {!range.from && "조회하기 버튼을 눌러 분석 할 날짜를 입력해주세요"}
        {range.from && !data && !loading && `기간: ${range.from} ~ ${range.to}`}
        {loading && "분석중..."}
        {data && "PDF가 생성되었습니다. 다운로드 버튼을 눌러 저장하세요."}
      </Canvas>
    </SectionCard>
  );
}
