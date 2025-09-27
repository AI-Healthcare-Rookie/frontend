// src/pages/MainPage.jsx
import styled from "styled-components";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAuth } from "../contexts/AuthContext";

import SectionCard from "../components/common/SectionCard";
import MonthCalendar from "../components/Calendar/MonthCalendar";
import DayDetailModal from "../components/Calendar/DayDetailModal";
import WeeklyVisitList from "../components/WeeklyVisits/WeeklyVisitList";
import ReportPanel from "../components/Report/ReportPanel";

import {
  getMonthlyVisits,
  getVisitByDate,
  createOrUpdateVisit,
} from "../services/visitsApi";

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
function normalizeVisits(raw) {
  // 기대 스키마: [{ date:'YYYY-MM-DD', hospitalName:'...' }, ...]
  if (Array.isArray(raw)) return raw;

  if (!raw) return [];

  if (typeof raw === "object") {
    // 객체 스키마를 배열로 변환
    // 예: { '2025-06-03': '이비인후과' }
    //   또는 { '2025-06-03': { hospitalName: '이비인후과' } }
    //   또는 { '2025-06-03': ['A병원','B병원'] }
    const arr = [];
    for (const [date, value] of Object.entries(raw)) {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          if (typeof v === "string") arr.push({ date, hospitalName: v });
          else if (v && typeof v === "object")
            arr.push({
              date,
              hospitalName:
                v.hospitalName || v.hospital || String(v),
            });
        });
      } else if (typeof value === "string") {
        arr.push({ date, hospitalName: value });
      } else if (value && typeof value === "object") {
        arr.push({
          date,
          hospitalName:
            value.hospitalName || value.hospital || String(value),
        });
      }
    }
    return arr;
  }

  // 그 외 타입 방어
  return [];
}

// ───────────────── Page ─────────────────
export default function MainPage() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();

  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 월별 방문 내역
  const { data: rawVisits, isLoading } = useQuery({
    queryKey: ["visits", month],
    queryFn: () => getMonthlyVisits(month),
  });

  // 항상 배열 보장
  const visits = useMemo(() => normalizeVisits(rawVisits), [rawVisits]);

  // 캘린더 점 표시용 map
  const visitsMap = useMemo(() => {
    return Object.fromEntries(
      (visits || []).map((v) => [v.date, v])
    );
  }, [visits]);

  // 날짜 클릭 → 상세 모달 오픈
  const openDayModal = async (date) => {
    setSelectedDate(date);
    const initial = await getVisitByDate(date).catch(() => null);
    setSelectedVisit(initial);
    setModalOpen(true);
  };

  // 저장
  const save = useMutation({
    mutationFn: createOrUpdateVisit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visits", month] }),
  });

  const handleSave = async (payload) => {
    await save.mutateAsync(payload);
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

            {/* MonthCalendar는 month prop을 받을 수도 있으니 함께 전달 */}
            <MonthCalendar
              month={month}
              visitsMap={visitsMap}
              onPickDate={openDayModal}
            />
          </SectionCard>

          {/* 주간 리스트: 컴포넌트가 month를 받는 버전이면 함께 전달 */}
          <WeeklyVisitList month={month} visits={visits} />
        </div>

        {/* 약 복용 분석 리포트 영역 */}
        <ReportPanel loading={isLoading} />
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
