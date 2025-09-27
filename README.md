# MediTrack

> **AI 기반 환자 맞춤형 복약 관리 및 위험 알림 시스템**  
> 연암공대 X 마산대 헬스케어 해커톤 출품작

---

## 📌 프로젝트 소개
MediTrack은 환자들이 복용 중인 약물과 병원 방문 내역을 손쉽게 관리할 수 있도록 돕는 서비스입니다.  
병원마다 다른 진단/처방으로 인해 **중복 처방, 금기 약물 동시 복용, 부작용 위험**이 발생할 수 있는데, 이를 예방하기 위해 **Google OAuth 로그인 → 병원 방문 내역 입력 → AI 기반 복용 분석 리포트**까지 원스톱으로 제공합니다.

---

## 🚀 주요 기능
1. **Google OAuth2 로그인**
   - 구글 계정으로 간편하고 안전하게 로그인
   - 별도의 회원가입 불필요

2. **월별 병원 방문 기록 (캘린더)**
   - 1월 ~ 12월 방문 내역을 달력에서 직관적으로 확인
   - 특정 일자를 클릭하면 **모달 창**을 통해 상세 내역 입력
     - 병원명 입력
     - 복용 일수 기록
     - 처방전 파일(이미지/PDF) 첨부

3. **주간 병원 방문 기록**
   - 주 단위(1주차 ~ 5주차)로 방문 내역 요약
   - 방문 내역이 없을 경우 “방문기록 없음” 표시

4. **약 복용 분석 리포트**
   - 조회 버튼 클릭 → 분석 기간 선택
   - 백엔드에서 분석된 데이터를 받아 **PDF 형식 리포트** 생성
   - 다운로드 버튼으로 PDF 저장 가능
   - 분석 데이터에는 **복약 이력 요약 / 중복·금기 약물 알림 / 부작용 리스크** 포함

---

## 🛠 기술 스택
### Frontend
- **React (JavaScript)**
- **styled-components** (스타일링)
- **React Router** (라우팅)
- **TanStack Query (react-query)** (데이터 관리)
- **react-calendar** (캘린더 UI)
- **@react-pdf/renderer** (PDF 생성)

### Backend
- **Spring Boot** (API 서버 & 인증)
- **Python** (약물 분석 및 LLM 연동)
- **Google OAuth2** (로그인 인증)
- **Custom Search JSON API** (약물 검색/상호작용 정보 수집)

### AI / LLM
- **ChatGPT 5 nano** (약물 정보 요약, 리포트 자연어 생성)

---

## 📂 폴더 구조 (Frontend)
```bash
src/
├─ app/ # queryClient, router 등 앱 초기 세팅
├─ components/
│ ├─ Auth/ # 로그인, 보호 라우트
│ ├─ Calendar/ # 달력, 모달
│ ├─ WeeklyVisits/ # 주간 방문 기록
│ └─ Report/ # 분석 리포트, PDF
├─ contexts/ # AuthContext
├─ pages/ # LoginPage, DashboardPage
├─ services/ # API 통신 (axios)
├─ styles/ # GlobalStyle, theme
└─ utils/ # 날짜 등 유틸
```
---

## ⚙️ 실행 방법

### 1. 프론트엔드
```bash
# 설치
npm install

# 실행 (Vite)
npm run dev

```

## 📊 서비스 흐름

1. 로그인: Google OAuth2 → 서버에서 JWT 쿠키 발급

2. 메인 화면: 캘린더/주간기록/분석 리포트 3개 영역 표시

3. 일일 내역 입력: 모달에서 병원명·복용일수·처방전 업로드

4. 주간 기록 확인: 자동으로 1주차 ~ 5주차 그룹핑

5. 분석 리포트: 기간 선택 → 서버 분석 → PDF 생성 및 다운로드



## 📑 향후 발전 방향

- OCR 기반 처방전 자동 인식

- 환자 맞춤형 알림(복용 시간/금기 약물 경고)

- 병원/약국 연계 API 확장

- 모바일 앱 연동
