import styled from "styled-components";
import dayjs from "dayjs";
import SectionCard from "../common/SectionCard";

const Title = styled.h3` font-weight: 700; margin: 0 0 12px; `;
const Item = styled.li` font-size: 14px; & + & { margin-top: 6px; } `;
const Strong = styled.span` font-weight: 700; `;

export default function WeeklyVisitList({ visits }) {
  const groups = [[],[],[],[],[]];
  visits?.forEach(v => {
    const d = dayjs(v.date);
    const idx = Math.min(Math.floor((d.date()-1)/7), 4);
    groups[idx].push(v);
  });

  const text = (arr) => arr.length
    ? arr.map(v=>`${dayjs(v.date).date()}일 ${v.hospitalName}`).join(", ")
    : "방문기록 없음";

  return (
    <SectionCard>
      <Title>주간 병원 방문기록</Title>
      <ul style={{padding:0, margin:0, listStyle:"none"}}>
        {groups.map((g,i)=>(
          <Item key={i}><Strong>{i+1}주차</Strong> — {text(g)}</Item>
        ))}
      </ul>
    </SectionCard>
  );
}
