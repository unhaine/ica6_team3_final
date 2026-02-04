# RefrigerAI (냉파 고수) - 통합 프로젝트 문서

> **버전**: V1.0  
> **최신 업데이트**: 2026-01-28  
> **상태**: 작성 완료

---

## 1. 프로젝트 개요 (Project Overview)
**RefrigerAI (가칭: 냉파 고수)**는 냉장고 속 식재료를 스마트하게 관리하고, AI 기반으로 레시피를 추천하여 식재료 낭비를 줄이고 사용자에게 최적의 식사 경험을 제공하는 웹 서비스입니다.
Google vision API와 LLM을 활용하여 식재료 입력의 번거로움을 최소화하는 것이 핵심 차별점입니다.

---

## 2. 비즈니스 요구사항 (Business Requirements)
1.  **식재료 낭비 절감**: 유통기한 임박 알림 및 잔반 활용 레시피 제공을 통해 가정 내 음식물 쓰레기를 줄입니다.
2.  **비용 절감**: 중복 구매 방지 및 효율적인 소비를 돕습니다.
3.  **메뉴 결정 스트레스 해소**: "오늘 뭐 먹지?"라는 사용자의 고민을 보유 재료 기반 추천으로 해결합니다.
4.  **사용자 편의성 극대화**: 수기 입력의 피로도를 Vision AI(영수증/냉장고 촬영)로 획기적으로 낮춥니다.

---

## 3. 서비스 기획 (Service Planning)
*   **Target Audience**: 1인 가구, 자취생, 알뜰한 주부, 요리 초보자.
*   **Core Logic**: `Input (사진/영수증)` -> `AI Analysis (식재료 추출)` -> `Inventory (DB 저장)` -> `Matching (보유 재료 기반 레시피 추천)`.

---

## 4. 서비스 기획: 랜딩 페이지 (Landing Page)
*   **Hero Section**:
    *   Copy: "냉장고 사진 한 장으로 시작하는 미니멀 키친 라이프"
    *   Visual: 스마트폰으로 냉장고를 찍자 식재료 리스트가 팝업되는 애니메이션.
    *   CTA: "3초 만에 시작하기 (소셜 로그인)"
*   **Features Section**:
    *   식재료 자동 인식 (영수증/사진)
    *   유통기한 마감 임박 알림
    *   냉장고 파먹기 전용 레시피 추천
*   **Stat Section**: "사용자들이 절약한 식재료 비용: ₩12,500,000+"

---

## 5. 서비스 기획: 메인 페이지 (Main Page / Dashboard)
*   **상단 (Overview)**:
    *   "냉장고가 꽉 찼어요! (80%)" 또는 "식재료가 부족해요." 상태 메시지.
    *   **유통기한 임박 배지**: "오늘까지 먹어야 할 우유가 있어요!" 🚨
*   **중간 (Inventory Quick View)**:
    *   내 냉장고 속 재료를 카테고리별(신선/냉동/소스) 아이콘으로 시각화.
    *   빠른 추가 (+ 버튼) Floating Action Button.
*   **하단 (Recipe Recommendation)**:
    *   "지금 만들 수 있는 요리": 보유 재료 100% 매칭 메뉴 Carousel.
    *   "이것만 사면 가능해요": 부족한 재료 1~2개인 메뉴와 쇼핑 링크.

---

## 6. 서비스 기획: 온보딩 (Onboarding)
1.  **Social Login**: 카카오/네이버/구글 원클릭 로그인.
2.  **Permission**: 카메라/갤러리 접근 권한 요청 (AI 인식을 위해 필수).
3.  **Initial Setup**:
    *   "가족 구성원이 몇 명인가요?" (양 조절용)
    *   "못 먹는 재료가 있나요?" (알러지 필터링)
4.  **First Action 유도**: "지금 바로 냉장고를 찍어보세요!" -> 튜토리얼 종료.

---

## 7. 기술 명세서 (Technical Specifications)
### Frontend
*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Shadcn/UI (Radix UI 기반)
*   **State Management**: React Query (Server State), Zustand (Client State)

### Backend
*   **Server**: Next.js Server Actions / API Routes
*   **Auth**: NextAuth.js (v5)
*   **Database**: PostgreSQL (Supabase Hosted)
*   **ORM**: Prisma

### AI & External APIs
*   **Vision**: Google Cloud Vision API (OCR & Label Detection)
*   **LLM**: Gemini 1.5 Flash (자연어 처리 및 데이터 구조화)
*   **Recipe Data**: 만개의 레시피 / 공공데이터포털 API

---

## 8. 데이터 설계 (Data Design)
*자세한 스키마는 `prisma/schema.prisma` 참조*

*   **User**: 사용자 계정 및 설정 정보.
*   **GroceryItem**: 개별 식재료 아이템 (이름, 수량, 유통기한, 보관장소, 등록출처).
*   **ReceiptScan** / **FridgePhotoAnalysis**: AI 인식 요청 로그 및 원본 데이터 (추후 학습 데이터로 활용).
*   **Recipe**: 요리 레시피 메타데이터 (재료, 난이도, 조리법).
*   **FavoriteRecipe**: 사용자가 찜한 레시피 (N:M 관계).

---

## 9. AI 전략 (AI Strategy)
1.  **Hybrid Recognition**:
    *   **Level 1 (Google Vision)**: 기본적인 텍스트(OCR)와 객체(Label)를 빠르게 탐지.
    *   **Level 2 (Gemini LLM)**: 탐지된 파편화된 데이터를 "식재료명 / 수량 / 유통기한" 구조로 정제하고 문맥을 파악. (예: "우유 2개 1+1" -> Quantity: 2)
2.  **Feedback Loop**: 사용자가 AI가 인식한 결과를 수정(Correction)하면, 이 데이터를 별도 저장하여 추후 모델 튜닝이나 프롬프트 개선에 활용.
3.  **Recipe Matching Algorithm**: 단순 문자열 매칭이 아닌, 재료의 유사어(계란=달걀, 파=대파)를 임베딩 벡터로 비교하여 매칭 정확도 향상 (Vector Search 도입 예정).

---

## 10. UI/UX 가이드 (UI/UX Guide)
*   **Color Palette**:
    *   Primary: `Fresh Green` (#10B981) - 신선함 상징
    *   Secondary: `Warm Orange` (#F59E0B) - 요리와 입맛 자극
    *   Danger: `Rose Red` (#EF4444) - 유통기한 임박 경고
*   **Typography**:
    *   Pretendard (가독성 높은 한글 폰트)
*   **Design Principle**:
    *   **Mobile First**: 냉장고 앞에서는 모바일 사용이 주력이므로 모바일 뷰 최적화.
    *   **Thumb-Zone Action**: 주요 버튼(촬영, 추가)은 하단에 배치.

---

## 11. 구현 계획 (Implementation Plan)
*   **Phase 1 (MVP)** - *현재 진행 중*
    *   기본 CRUD (식재료 수동 관리).
    *   소셜 로그인 연동 (Naver/Google).
    *   기본 AI 영수증/사진 인식 기능.
*   **Phase 2 (Automation)**
    *   소비기한 임박 푸시 알림.
    *   레시피 추천 알고리즘 고도화 (80% 매칭 로직).
    *   쇼핑 쇼핑몰 딥링크 연동.
*   **Phase 3 (Community)**
    *   요리 인증샷 공유 커뮤니티.
    *   냉장고 파먹기 챌린지 기능.

---

## 12. 운영 및 배포 (Ops & Deployment)
*   **Hosting**: Vercel (Frontend & Serverless Functions).
*   **Database**: Supabase (PostgreSQL managed).
*   **CI/CD**: GitHub Actions (자동 테스트 및 Vercel 배포 트리거).
*   **Monitoring**: Vercel Analytics (웹 바이탈), Sentry (에러 트래킹).
