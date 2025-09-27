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

import { getMonthlyVisits, getVisitByDate, createOrUpdateVisit } from "../services/visitsApi";

const HeaderBar = styled.header`
  display:flex; justify-content:space-between; align-items:center; margin-bottom: 24px;
`;
const Grid = styled.div`
  display:grid; grid-template-columns: 1fr; gap: 24px;
  @media (min-width: 1024px){ grid-template-columns: 1fr 1fr; }
`;
const H1 = styled.h1` font-size: 28px; font-weight: 800; margin: 0 0 8px; `;

export default function MainPage(){
  const { user, logout } = useAuth();
  const qc = useQueryClient();

  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: visits = [] } = useQuery({
    queryKey: ["visits", month],
    queryFn: () => getMonthlyVisits(month),
  });

  const visitsMap = useMemo(() => Object.fromEntries((visits||[]).map(v=>[v.date, v])), [visits]);

  const openDayModal = async (date) => {
    setSelectedDate(date);
    const initial = await getVisitByDate(date).catch(()=>null);
    setSelectedVisit(initial);
    setModalOpen(true);
  };

  const save = useMutation({
    mutationFn: createOrUpdateVisit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["visits", month] })
  });

  const handleSave = async (payload) => {
    await save.mutateAsync(payload);
    setModalOpen(false);
  };

  return (
    <div style={{minHeight:"100vh", padding:24}}>
      <HeaderBar>
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <img src="/logo.svg" alt="MediTrack" style={{height:24}} />
          <span style={{fontSize:18, fontWeight:700}}>MediTrack</span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <span style={{fontSize:14, color:"#6b7280"}}>{user?.name}님, 환영합니다</span>
          <button onClick={logout} style={{fontSize:13, textDecoration:"underline"}}>로그아웃</button>
        </div>
      </HeaderBar>

      <H1>{dayjs(month + "-01").format("M")}월 병원 방문기록</H1>

      <Grid>
        <div style={{display:"grid", gap:24}}>
          <SectionCard>
            <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
              <select
                value={month}
                onChange={(e)=>setMonth(e.target.value)}
                style={{marginLeft:"auto", border:"1px solid #e5e7eb", borderRadius:10, padding:"6px 8px"}}
              >
                {Array.from({length:12}).map((_,i)=>{
                  const m = dayjs().month(i).format("YYYY-MM");
                  return <option key={m} value={m}>{m}</option>;
                })}
              </select>
            </div>
            <MonthCalendar visitsMap={visitsMap} onPickDate={openDayModal} />
          </SectionCard>

          <WeeklyVisitList visits={visits} />
        </div>

        <ReportPanel />
      </Grid>

      <DayDetailModal
        open={modalOpen}
        onClose={()=>setModalOpen(false)}
        date={selectedDate}
        initial={selectedVisit}
        onSubmit={handleSave}
      />

      <footer style={{textAlign:"center", fontSize:12, color:"#9ca3af", marginTop:32}}>
        © 연암공대 X 마산대 헬스케어 해커톤
      </footer>
    </div>
  );
}
