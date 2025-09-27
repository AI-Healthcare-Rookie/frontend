// src/components/Report/ReportPanel.jsx
import { useState } from "react";
import styled from "styled-components";
import { fetchMedicationReport } from "../../services/reportApi";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";

export default function ReportPanel() {
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) 백엔드에서 데이터 조회
      const data = await fetchMedicationReport();

      // 2) PDF 생성
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      const margin = 56;
      let y = margin;
      const line = (h = 12) => { y += h; return y; };
      const title = (txt) => { doc.setFontSize(18); doc.text(txt, margin, y); line(24); };
      const subtitle = (txt) => { doc.setFontSize(13); doc.text(txt, margin, y); line(18); };
      const text = (txt) => { doc.setFontSize(11); doc.text(txt, margin, y); line(16); };
      const hr = () => { doc.setDrawColor(220); doc.line(margin, y, doc.internal.pageSize.getWidth()-margin, y); line(10); };

      // 헤더
      const now = dayjs();
      const generatedAt = data?.generatedAt ? dayjs(data.generatedAt) : now;
      doc.setFont("helvetica", "bold");
      title("MediTrack — 약 복용 분석 리포트");
      doc.setFont("helvetica", "normal");
      text(`생성일: ${generatedAt.format("YYYY-MM-DD HH:mm")}`);
      hr();

      // 요약
      subtitle("요약");
      const s = data?.summary || {};
      text(`총 방문 횟수: ${s.totalVisits ?? "-"}`);
      text(`총 복용 약 수: ${s.totalMedicines ?? "-"}`);
      if (s.periodStart && s.periodEnd) {
        text(`분석 기간: ${s.periodStart} ~ ${s.periodEnd}`);
      }
      hr();

      // 지표
      subtitle("핵심 지표");
      const st = data?.stats || {};
      if (st.adherenceRate != null) text(`복약 순응도: ${(st.adherenceRate * 100).toFixed(1)}%`);
      if (st.longestStreak != null) text(`최장 연속 복용일: ${st.longestStreak}일`);
      if (st.missedCount != null) text(`미복용 횟수: ${st.missedCount}회`);
      hr();

      // 타임라인
      subtitle("최근 방문/복용 타임라인");
      const tl = Array.isArray(data?.timeline) ? data.timeline.slice(0, 12) : [];
      if (!tl.length) {
        text("데이터 없음");
      } else {
        tl.forEach((it) => {
          const d = it?.date || "-";
          const h = it?.hospital || "-";
          const meds = Array.isArray(it?.meds) ? it.meds.join(", ") : (it?.medicine || "-");
          text(`• ${d} | ${h} | ${meds}`);
        });
      }
      hr();

      // 상호작용
      subtitle("상호작용/주의");
      const inter = Array.isArray(data?.interactions) ? data.interactions : [];
      if (!inter.length) {
        text("특이사항 없음");
      } else {
        inter.slice(0, 10).forEach((it) => {
          const pair = Array.isArray(it.pair) ? it.pair.join(" + ") : (it.pair || "-");
          text(`• ${pair} (${it.level || "정보"}) ${it.note ? "- " + it.note : ""}`);
        });
      }
      hr();

      // 알림
      subtitle("경고/알림");
      const alerts = Array.isArray(data?.alerts) ? data.alerts : [];
      if (!alerts.length) {
        text("없음");
      } else {
        alerts.slice(0, 8).forEach((a) => {
          text(`• [${a.type}] ${a.date} - ${a.note}`);
        });
      }

      // 3) PDF 다운로드
      const name = `MediTrack_Report_${now.format("YYYYMMDD_HHmm")}.pdf`;
      doc.save(name);

      // 4) blob URL (재다운로드 링크 제공)
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      setDownloadUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return url;
      });
      setFileName(name);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelWrap>
      <HeaderRow>
        <h3>약 복용 분석 리포트</h3>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "조회 중..." : "조회하기"}
        </Button>
      </HeaderRow>

      {error && <ErrorBox>에러 발생: {error}</ErrorBox>}

      {downloadUrl && fileName && (
        <DownloadRow>
          <a href={downloadUrl} download={fileName}>PDF 다시 다운로드</a>
        </DownloadRow>
      )}
    </PanelWrap>
  );
}

const PanelWrap = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-height: 120px;
`;
const HeaderRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  h3 { margin: 0; font-size: 18px; font-weight: 800; }
`;
const Button = styled.button`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #4A90E2;
  color: #fff;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const ErrorBox = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #fff5f5;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-size: 13px;
`;
const DownloadRow = styled.div`
  margin-top: 12px; font-size: 13px;
  a { text-decoration: underline; }
`;
