import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import dayjs from "dayjs";

export default function MonthCalendar({ _month, visitsMap, onPickDate }) {
  // month: '2025-06'
  const [value, setValue] = useState(new Date());

  // 날짜 타일에 방문여부 표시
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = dayjs(date).format("YYYY-MM-DD");
    const has = !!visitsMap[key];
    return has ? <div className="mt-1 h-1 w-1 rounded-full bg-emerald-500 mx-auto"/> : null;
  };

  return (
    <Calendar
      onClickDay={(date)=> onPickDate(dayjs(date).format("YYYY-MM-DD"))}
      value={value}
      onChange={setValue}
      tileContent={tileContent}
      locale="ko-KR"
      calendarType="gregory"
    />
  );
}
