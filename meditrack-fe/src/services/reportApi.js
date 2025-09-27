// src/services/reportApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

/**
 * 전체 데이터 리포트 조회
 * 서버에서 필요한 모든 데이터(요약/통계/타임라인/경고 등)를 합쳐 반환하도록 구현해두면
 * 프론트는 그대로 PDF로 렌더링만 하면 됩니다.
 *
 * 예시 응답 스키마 (유연 처리):
 * {
 *   generatedAt: "2025-09-28T06:21:00Z",
 *   summary: { totalVisits: 12, totalMedicines: 7, ... },
 *   stats: { adherenceRate: 0.92, longestStreak: 14, ... },
 *   timeline: [{ date:"2025-09-01", hospital:"연암이비인후과", meds:["A","B"] }, ...],
 *   interactions: [{ pair:["A","C"], level:"주의", note:"동시복용 주의" }, ...],
 *   alerts: [{ type:"miss", date:"2025-09-12", note:"미복용" }, ...]
 * }
 */
export async function fetchMedicationReport() {
  const res = await fetch(`${API_BASE}/reports/medication`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`fetchMedicationReport failed: ${res.status} ${t}`);
  }
  return res.json();
}
