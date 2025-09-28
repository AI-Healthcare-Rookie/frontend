// src/pages/MainPage.jsx
import styled from "styled-components";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";

import SectionCard from "../components/common/SectionCard";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import DayDetailModal from "../components/Calendar/DayDetailModal";
import ReportPanel from "../components/Report/ReportPanel";

// ───────────────── UI ─────────────────
const HeaderBar = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
`;
const H1 = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 8px;
`;

// ──────────────── Helper: 항상 배열 보장 ────────────────
// (visitsApi를 제거했지만, 혹시 다른 곳에서 객체 형태를 넘길 때를 대비해 남겨둠)
function normalizeVisits(raw) {
  if (Array.isArray(raw)) return raw;
  if (!raw) return [];
  if (typeof raw === "object") {
    const arr = [];
    for (const [date, value] of Object.entries(raw)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === "string") arr.push({ date, hospitalName: v });
          else if (v && typeof v === "object")
            arr.push({
              date,
              hospitalName: v.hospitalName || v.hospital || String(v),
            });
        });
      } else if (typeof value === "string") {
        arr.push({ date, hospitalName: value });
      } else if (value && typeof value === "object") {
        arr.push({
          date,
          hospitalName: value.hospitalName || value.hospital || String(value),
        });
      }
    }
    return arr;
  }
  return [];
}

// ───────────────── Page ─────────────────
export default function MainPage() {
  const { user, logout } = useAuth();

  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // visitsApi 제거: 더미(빈 배열)로 동작
  const visits = useMemo(() => normalizeVisits([]), []);
  const visitsMap = useMemo(() => {
    return Object.fromEntries((visits || []).map((v) => [v.date, v]));
  }, [visits]);

  // 날짜 클릭 → 상세 모달 오픈 (API 호출 제거)
  const openDayModal = (date) => {
    setSelectedDate(date);
    setSelectedVisit(null); // 초기값 없음
    setModalOpen(true);
  };

  // 저장 (API 호출 제거 → 모달만 닫기)
  const handleSave = async (_payload) => {
    setModalOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24 }}>
      <HeaderBar>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="../../public/main_logo.png" alt="MediTrack" style={{ height: 30 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>
            {user?.name}님, 환영합니다
          </span>
          <button
            onClick={logout}
            style={{ fontSize: 13, textDecoration: "underline" }}
          >
            로그아웃
          </button>
        </div>
      </HeaderBar>

      <H1>{dayjs(month + "-01").format("M")}월 병원 방문기록</H1>

      <Grid>
        <div style={{ display: "grid", gap: 24 }}>
          <SectionCard>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 12,
              }}
            >
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                style={{
                  marginLeft: "auto",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "6px 8px",
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => {
                  const m = dayjs().month(i).format("YYYY-MM");
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </div>

            <MonthCalendar
              month={month}
              visitsMap={visitsMap}
              onPickDate={openDayModal}
            />
          </SectionCard>
        </div>

        {/* API 제거로 loading은 false 고정 */}
        <ReportPanel loading={false} />
      </Grid>

      <DayDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        date={selectedDate}
        initial={selectedVisit}
        onSubmit={handleSave}
      />

      <footer
        style={{
          textAlign: "center",
          fontSize: 12,
          color: "#9ca3af",
          marginTop: 32,
        }}
      >
        © 연암공대 X 마산대 헬스케어 해커톤
      </footer>
    </div>
  );
}
