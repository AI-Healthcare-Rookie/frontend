// src/services/reportApi.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchMedicationReport() {
  const res = await fetch(`${API_BASE}/api/medicines`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`fetchMedicationReport failed: ${res.status} ${t}`);
  }

  // ✅ 여기서 JSON으로 변환해서 반환해야 함
  const data = await res.json();
  console.log("API 응답 데이터:", data); // 👉 이걸 찍어야 실제 queries 보임
  return data;
}
