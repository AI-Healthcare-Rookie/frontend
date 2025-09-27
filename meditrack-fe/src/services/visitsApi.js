import { api } from "./apiClient";

// 월별 방문(리스트)
export const getMonthlyVisits = (monthStr) =>
  api.get(`/visits`, { params: { month: monthStr } }).then((r) => r.data);

// 특정 날짜 상세
export const getVisitByDate = (date) =>
  api.get(`/visits/${date}`).then((r) => r.data);

// 생성/업데이트 (파일 포함)
export const createOrUpdateVisit = (payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => fd.append(k, v));
  return api
    .post(`/visits`, fd, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data);
};

// 분석 리포트
export const getReportData = (from, to) =>
  api.get(`/report`, { params: { from, to } }).then((r) => r.data);
