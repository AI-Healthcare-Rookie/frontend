// src/components/Calendar/MonthCalendar.jsx
import dayjs from "dayjs";
import styled from "styled-components";

export default function MonthCalendar({ month, visitsMap = {}, onPickDate }) {
  const firstDay = dayjs(month + "-01");
  const daysInMonth = firstDay.daysInMonth();
  const startWeekday = firstDay.day(); // 0:일 ~ 6:토

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Wrap>
      <GridHead>
        {["일","월","화","수","목","금","토"].map((w) => <div key={w}>{w}</div>)}
      </GridHead>
      <GridBody>
        {cells.map((d, idx) => {
          if (d === null) return <Cell key={`blank-${idx}`} />;
          const dateStr = dayjs(month + `-${String(d).padStart(2,"0")}`).format("YYYY-MM-DD");
          const hasVisit = Boolean(visitsMap[dateStr]);

          return (
            <Cell key={dateStr}>
              <button onClick={() => onPickDate?.(dateStr)}>
                <span>{d}</span>
                {hasVisit && <Dot title="방문 기록 있음">●</Dot>}
              </button>
            </Cell>
          );
        })}
      </GridBody>
    </Wrap>
  );
}

const Wrap = styled.div`
  border: 1px solid #e5e7eb; border-radius: 14px; padding: 12px;
`;
const GridHead = styled.div`
  display: grid; grid-template-columns: repeat(7, 1fr);
  font-size: 12px; color: #6b7280; margin-bottom: 8px;
  > div { text-align: center; }
`;
const GridBody = styled.div`
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;
`;
const Cell = styled.div`
  button {
    width: 100%; aspect-ratio: 1 / 1;
    border: 1px solid #f3f4f6; border-radius: 12px; background: #fff;
    display: grid; place-items: center; position: relative;
    cursor: pointer;
  }
  span { font-size: 14px; }
`;
const Dot = styled.div`
  position: absolute; bottom: 8px; font-size: 10px; color: #6FCF97;
`;
