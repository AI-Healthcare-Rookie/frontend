import { useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { fetchMedicationReport } from "../../services/reportApi";

export default function ReportPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]); // ← data 배열 저장

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchMedicationReport(); // { status, timestamp, data: [...] }
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
    } catch (e) {
      console.error(e);
      setError(e.message || "조회 실패");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelWrap>
      <HeaderRow>
        <h3>약 복용 분석 리포트</h3>
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? "조회 중..." : "조회하기"}
        </Button>
      </HeaderRow>

      {error && <ErrorBox>에러 발생: {error}</ErrorBox>}

      {/* 결과 표시 */}
      <MetaRow>
        <small>생성일: {dayjs().format("YYYY-MM-DD HH:mm")}</small>
        <small>총 개수: {items.length}</small>
      </MetaRow>

      {items.length === 0 && !loading && !error && (
        <EmptyBox>조회 결과가 없습니다. 조회하기 버튼을 눌러주세요.</EmptyBox>
      )}

      <List>
        {items.map((it) => (
          <Card key={it.id}>
            <Title>{it.name ?? "-"}</Title>
            {it.id != null && <Sub>설명: {it.summary}</Sub>}
          </Card>
        ))}
      </List>
    </PanelWrap>
  );
}

/* ── 스타일 ───────────────────────────── */
const PanelWrap = styled.section`
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  min-height: 160px;
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
  margin-top: 10px; padding: 10px; border-radius: 10px;
  background: #fff5f5; color: #b91c1c; border: 1px solid #fecaca; font-size: 13px;
`;
const MetaRow = styled.div`
  margin-top: 10px; display: flex; gap: 12px; color: #6b7280; font-size: 12px;
`;
const EmptyBox = styled.div`
  margin-top: 16px; font-size: 13px; color: #6b7280;
`;
const List = styled.div`
  margin-top: 16px;
  display: grid; gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;
const Card = styled.div`
  border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px;
  background: #fff;
`;
const Title = styled.div`
  font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 6px;
`;
const Sub = styled.div`
  font-size: 12px; color: #6b7280;
`;
