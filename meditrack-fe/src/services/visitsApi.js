import { api } from "./apiClient";

export const getMonthlyVisits = (monthStr) => api.get(`/visits`, { params:{ month: monthStr } }).then(r=>r.data);
export const getVisitByDate   = (date)     => api.get(`/visits/${date}`).then(r=>r.data);
export const createOrUpdateVisit = (payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k,v])=> fd.append(k,v));
  return api.post(`/visits`, fd, { headers:{ 'Content-Type':'multipart/form-data' }}).then(r=>r.data);
};
export const getReportData = (from,to) => api.get(`/report`, { params:{ from, to }}).then(r=>r.data);