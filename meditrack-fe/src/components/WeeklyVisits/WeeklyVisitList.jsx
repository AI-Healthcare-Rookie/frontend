import dayjs from "dayjs";

/** visits: [{date:'YYYY-MM-DD', hospitalName: '...'}] */
export default function WeeklyVisitList({ month, visits }) {
  // 1~5주차로 그룹핑
  const groups = [[],[],[],[],[]];
  visits.forEach(v=>{
    const d = dayjs(v.date);
    const weekIndex = Math.min(Math.floor((d.date()-1)/7),4); // 0~4
    groups[weekIndex].push(v);
  });

  const label = (i) => `${i+1}주차`;
  const textOrNone = (arr) =>
    arr.length ? arr.map(v=>`${dayjs(v.date).date()}일 ${v.hospitalName}`).join(", ")
               : "방문기록 없음";

  return (
    <div className="border rounded-2xl p-4">
      <h3 className="font-semibold mb-3">주간 병원 방문기록</h3>
      <ul className="space-y-2 text-sm">
        {groups.map((g,i)=>(
          <li key={i}><span className="font-medium">{label(i)}</span> — {textOrNone(g)}</li>
        ))}
      </ul>
    </div>
  );
}
