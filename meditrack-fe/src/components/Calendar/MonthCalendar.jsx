import { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from "dayjs";

const Wrap = styled.div`
  .react-calendar { border: 0; width: 100%; font-family: inherit; }
  .react-calendar__tile { height: 44px; border-radius: 10px; }
  .react-calendar__tile--now { background: #f5f7fb; }
  .react-calendar__tile--active { background: #4A90E2; color: #fff; }
`;
const Dot = styled.div`
  width: 6px; height: 6px; border-radius: 999px;
  margin: 4px auto 0; background: #6FCF97;
`;

export default function MonthCalendar({ visitsMap, onPickDate }) {
  const [value, setValue] = useState(new Date());
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = dayjs(date).format("YYYY-MM-DD");
    return visitsMap[key] ? <Dot/> : null;
  };
  return (
    <Wrap>
      <Calendar
        onClickDay={(date) => onPickDate(dayjs(date).format("YYYY-MM-DD"))}
        value={value}
        onChange={setValue}
        tileContent={tileContent}
        locale="ko-KR"
        calendarType="gregory"
      />
    </Wrap>
  );
}
