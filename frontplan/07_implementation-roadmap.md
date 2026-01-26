# 🗺️ 프론트엔드 구현 로드맵 (7 Steps)

> **목표**: 계획된 컴포넌트들을 논리적 순서에 따라 안정적으로 구현하고, 각 단계마다 동작 확인 가능하도록 진행

---

## 🛠️ Step 1: 프로젝트 기반 & 기초 테마 설정 (Foundation)

**목표**: 디자인 시스템의 뼈대와 필수 도구 설치

- [ ] **shadcn/ui 기초 컴포넌트 설치**
  - 명령어: `npx shadcn@latest add button card input select progress skeleton alert badge tabs collapsible toast`
- [ ] **전역 스타일 설정 (`globals.css`)**
  - 프로젝트 메인 컬러, 폰트(Outfit/Inter), 그림자, 보더 라운드 값 조정
- [ ] **폴더 구조 생성**
  - `components/elements`, `components/modules`, `hooks`, `types`, `styles`
- [ ] **공통 타입 정의 (`types/*.ts`)**
  - `Ingredient`, `Recipe`, `AnalysisResult` 등 핵심 인터페이스 작성

---

## 🎨 Step 2: 공통 엘리먼트 구현 (Atomic Elements)

**목표**: 재사용 가능한 최소 단위 컴포넌트 완성

- [ ] **Icon & Typography**
  - `lucide-react` 기반 아이콘 래퍼 및 가독성 높은 타이포그래피 설정
- [ ] **ActionButton & IconButton**
  - 로딩 상태를 포함한 범용 버튼 구현
- [ ] **ProgressBar & Tag (Badge)**
  - 매칭률 및 상태 표시를 위한 디자인 최적화
- [ ] **NumberInput & UnitSelect**
  - 식재료 수량 수정을 위한 입력 필드 세트 구현

---

## 🔄 Step 3: 공통 훅 & 데이터 flow (Core Logic)

**목표**: 컴포넌트 간 데이터 전달 및 영속성 관리 로직 구축

- [ ] **`useLocalStorage`**
  - 브라우저에 식재료 및 분석 데이터를 타입 세이프로 저장
- [ ] **`useIngredients`**
  - 식재료 추가/수정/삭제 상태를 중앙 집중식으로 관리 (Context 또는 전역 저장소 고려)
- [ ] **`useImageUpload` & `useAnalysis`**
  - 파일 업로드 상태 및 AI API 응답 처리 로직 구현 (Mocking 포함)

---

## 📸 Step 4: 사진 등록 및 분석 UI (The Analysis Loop)

**목표**: 서비스의 핵심인 분석 및 검토 화면 완성

- [ ] **`TypeSelector` (Large Cards)**
  - [냉장고] [영수증]의 명확한 선택 UI 및 파일 선택 트리거
- [ ] **`ImagePreview` with Overlay Button**
  - 선택된 이미지 위에 중앙 정렬된 [AI 분석하기] 버튼 구현
- [ ] **`AnalyzingOverlay` (Interactive State)**
  - 분석 중 블러 처리 및 애니메이션 효과
- [ ] **`BoundingBoxCanvas` (냉장고형) / `IngredientList` (영수증형)**
  - 각 타입에 맞는 검토 화면 전환 로직

---

## 🍳 Step 5: 레시피 추천 및 상세 (The Discovery Loop)

**목표**: 분석 결과로 실제 요리 정보를 제공하는 단계 구현

- [ ] **`RecipeCard` & `CategoryChips`**
  - 매칭률 순 정렬 및 한/양/중식 필터링 UI
- [ ] **`RecipeIngredientList`**
  - 보유한 재료(✅)와 부족한 재료(🛒)를 명확히 구분하는 UI
- [ ] **`CookingSteps` & `YouTubeButton`**
  - 단계별 가독성을 높인 조리법과 영상 연계 버튼

---

## 🏆 Step 6: 요리 인증 및 보상 UI (The Feedback Loop)

**목표**: 사용자에게 성취감을 주는 인증 시스템 구현

- [ ] **`VerifyResult` (Score & Feedback)**
  - 원형 프로그레스 바와 함께 AI 피드백을 보여주는 점수 화면
- [ ] **`CommunityShare` UI**
  - 인증 결과를 공유하기 위한 카드 레이아웃 (Mock)
- [ ] **요리 완료 애니메이션 효과**
  - 성취감을 극대화할 수 있는 마이크로 인터랙션 추가

---

## 🏠 Step 7: 메인 대시보드 & 최종 폴리싱 (The Hub)

**목표**: 모든 기능의 진입점을 완성하고 사용자 경험 최적화

- [ ] **`AppHeader` & `BottomNav`**
  - 전체 페이지를 연결하는 내비게이션 완성
- [ ] **`IngredientSummary` Dashboard**
  - "우리집 냉장고 현황" 및 "소비기한 임박" 알림 섹션
- [ ] **전체 화면 반응형 검수**
  - 모바일 최적화 상태 및 엣지 케이스 처리 (에러 화면 등)
- [ ] **성능 및 접근성 최적화**
  - 이미지 최적화 및 ARIA 레이블 최종 점검

---

## 📝 개발 진행 원칙 (Coding Standard)

1.  **Strict Typing**: `any` 사용 시 빌드 실패 수준의 엄격한 타입 적용
2.  **Atomic Structure**: `Module`은 반드시 `Element`를 참조하며, 그 반대는 절대 금지
3.  **No Placeholders**: 실제 동작하는 Mock 데이터로 실감나는 UI 구성
4.  **Micro-Interaction**: 버튼 클릭, 로딩, 페이지 전환 시 부드러운 트랜지션 필수
5.  **Clean Code**: 파일당 라수 제한 준수 (`*.tsx`, `*.type.ts`, `*.style.ts`, `*.hook.ts` 분리)

---

_최종 업데이트: 2026-01-26_
