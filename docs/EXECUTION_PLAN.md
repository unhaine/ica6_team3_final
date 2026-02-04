# Execution Plan

## 1. Setup & Configuration (완료)
- [x] Next.js 14 환경 설정
- [x] Tailwind CSS + Shadcn UI 설정
- [x] PostgreSQL (Supabase) + Prisma ORM 연동
- [x] NextAuth (Google, Naver) 설정

## 2. Core Features
### 2.1 식료품 관리 (Inventory)
- [ ] 식료품 목록 조회/검색 UI (`/inventory`)
- [ ] 수동 식료품 추가 기능
- [ ] 식료품 수정/삭제 기능
- [ ] 소비기한 임박 알림 로직

### 2.2 비전 AI 연동 (AI Vision)
- [ ] Google Cloud Vision / Gemini Pro Vision 설정
- [ ] 영수증/냉장고 사진 업로드 UI
- [ ] 이미지 분석 API Route 구현
- [ ] 분석 결과 사용자 검증 및 수정 UI

### 2.3 레시피 기능 (Recipe)
- [ ] 공공데이터/만개의 레시피 데이터 DB 마이그레이션 (`scripts/seed.ts`)
- [ ] 보유 재료 기반 레시피 추천 알고리즘
- [ ] 레시피 상세 페이지 및 유튜브 영상 연동

## 3. UI/UX Refinement
- [ ] 반응형 레이아웃 최적화
- [ ] 다크 모드 지원
- [ ] 로딩 상태 및 에러 핸들링 (Skeleton UI)

## 4. Testing & Deployment
- [ ] 전체 기능 테스트
- [ ] Vercel 배포
