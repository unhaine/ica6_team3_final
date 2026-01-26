# 🧩 프론트엔드 컴포넌트 계획서

> **목표**: 재사용성과 확장성을 고려한 체계적인 컴포넌트 구조 설계
> **기준**: Mobile-First (375px) + 반응형 대응
> **기술 스택**: Next.js 15, TypeScript, shadcn/ui, Tailwind CSS

---

## 📐 컴포넌트 아키텍처

### 계층 구조

```
┌─────────────────────────────────────────────────────────┐
│                        Pages                            │
│  (app/test/*, 페이지 단위 레이아웃)                      │
├─────────────────────────────────────────────────────────┤
│                       Modules                           │
│  (기능 단위 복합 컴포넌트, Elements 조합)                │
├─────────────────────────────────────────────────────────┤
│                       Elements                          │
│  (기본 UI 컴포넌트, 최소 단위)                          │
├─────────────────────────────────────────────────────────┤
│                    shadcn/ui Base                       │
│  (Button, Card, Input 등 기초 컴포넌트)                 │
└─────────────────────────────────────────────────────────┘
```

### 의존성 규칙

| From    | To        | 허용 |
| ------- | --------- | :--: |
| Module  | Element   |  ✅  |
| Module  | shadcn/ui |  ✅  |
| Module  | Module    |  ⚠️  |
| Element | shadcn/ui |  ✅  |
| Element | Module    |  ❌  |
| Element | Element   |  ⚠️  |

> ⚠️ 동일 레벨 참조는 순환 의존성에 주의하여 최소화

---

## 📁 파일 구조 규칙

### 컴포넌트 폴더 구조

```
/components
├── /elements           # 기본 컴포넌트
│   └── /ComponentName
│       ├── ComponentName.tsx       # 메인 컴포넌트
│       ├── ComponentName.type.ts   # 타입 정의
│       ├── ComponentName.style.ts  # 스타일 상수/유틸 (옵션)
│       ├── ComponentName.hook.ts   # 커스텀 훅 (옵션)
│       └── index.ts                # 배럴 익스포트
│
├── /modules            # 복합 컴포넌트
│   └── /ModuleName
│       ├── ModuleName.tsx
│       ├── ModuleName.type.ts
│       ├── ModuleName.style.ts
│       ├── ModuleName.hook.ts
│       ├── /parts                  # 내부 서브 컴포넌트 (옵션)
│       │   └── SubComponent.tsx
│       └── index.ts
│
└── /ui                 # shadcn/ui 컴포넌트
    ├── button.tsx
    ├── card.tsx
    └── ...
```

### 네이밍 규칙

| 항목          | 규칙                    | 예시                     |
| ------------- | ----------------------- | ------------------------ |
| 폴더명        | PascalCase              | `ImageUploader`          |
| 컴포넌트 파일 | PascalCase.tsx          | `ImageUploader.tsx`      |
| 타입 파일     | PascalCase.type.ts      | `ImageUploader.type.ts`  |
| 스타일 파일   | PascalCase.style.ts     | `ImageUploader.style.ts` |
| 훅 파일       | PascalCase.hook.ts      | `ImageUploader.hook.ts`  |
| 타입 네이밍   | 접두어 + Props/State 등 | `ImageUploaderProps`     |

---

## 🔧 shadcn/ui 기반 컴포넌트

### 필수 설치 목록

| 컴포넌트      | 용도                    | 우선순위 |
| ------------- | ----------------------- | :------: |
| `button`      | 모든 버튼, CTA          |    P0    |
| `card`        | 카드 레이아웃           |    P0    |
| `input`       | 텍스트 입력             |    P0    |
| `select`      | 드롭다운 선택 (단위 등) |    P0    |
| `progress`    | 진행률, 매칭률 표시     |    P0    |
| `skeleton`    | 로딩 상태 UI            |    P0    |
| `alert`       | 안내 메시지, 팁         |    P1    |
| `badge`       | 태그, 상태 라벨         |    P1    |
| `tabs`        | 타입 선택 토글          |    P1    |
| `collapsible` | 접이식 섹션             |    P1    |
| `toast`       | 알림 메시지             |    P1    |
| `sheet`       | 바텀시트 (모바일 모달)  |    P2    |
| `dialog`      | 확인/취소 다이얼로그    |    P2    |
| `avatar`      | 사용자 프로필           |    P2    |

### 설치 명령어

```bash
# P0 (필수)
npx shadcn@latest add button card input select progress skeleton

# P1 (핵심)
npx shadcn@latest add alert badge tabs collapsible toast

# P2 (확장)
npx shadcn@latest add sheet dialog avatar
```

---

## 🎯 Elements (기본 컴포넌트)

### E01. Icon

```
/elements/Icon
├── Icon.tsx
├── Icon.type.ts
└── index.ts
```

| 항목   | 내용                                 |
| ------ | ------------------------------------ |
| 목적   | 통일된 아이콘 렌더링                 |
| Props  | `name`, `size`, `color`, `className` |
| 의존성 | `lucide-react`                       |
| 비고   | 아이콘 사이즈 프리셋 제공            |

---

### E02. Typography

```
/elements/Typography
├── Typography.tsx
├── Typography.type.ts
├── Typography.style.ts
└── index.ts
```

| 항목  | 내용                                           |
| ----- | ---------------------------------------------- |
| 목적  | 텍스트 스타일 통일 (제목, 본문, 캡션 등)       |
| Props | `variant`, `as`, `weight`, `color`, `children` |
| 변형  | `h1`, `h2`, `h3`, `body`, `caption`, `label`   |

---

### E03. Spinner

```
/elements/Spinner
├── Spinner.tsx
├── Spinner.type.ts
└── index.ts
```

| 항목  | 내용                     |
| ----- | ------------------------ |
| 목적  | 로딩 스피너 표시         |
| Props | `size`, `color`, `label` |
| 변형  | `sm`, `md`, `lg`         |

---

### E04. EmptyState

```
/elements/EmptyState
├── EmptyState.tsx
├── EmptyState.type.ts
└── index.ts
```

| 항목  | 내용                                     |
| ----- | ---------------------------------------- |
| 목적  | 데이터 없음 상태 표시                    |
| Props | `icon`, `title`, `description`, `action` |

---

### E05. ImagePlaceholder

```
/elements/ImagePlaceholder
├── ImagePlaceholder.tsx
├── ImagePlaceholder.type.ts
└── index.ts
```

| 항목  | 내용                          |
| ----- | ----------------------------- |
| 목적  | 이미지 로딩/에러 시 대체 표시 |
| Props | `aspectRatio`, `icon`, `text` |

---

### E06. ProgressBar

```
/elements/ProgressBar
├── ProgressBar.tsx
├── ProgressBar.type.ts
└── index.ts
```

| 항목   | 내용                                        |
| ------ | ------------------------------------------- |
| 목적   | 진행률 시각화 (매칭률, 업로드 등)           |
| Props  | `value`, `max`, `showLabel`, `variant`      |
| 변형   | `default`, `success`, `warning`, `gradient` |
| 의존성 | shadcn `Progress` 래핑                      |

---

### E07. Tag

```
/elements/Tag
├── Tag.tsx
├── Tag.type.ts
└── index.ts
```

| 항목   | 내용                                   |
| ------ | -------------------------------------- |
| 목적   | 라벨, 카테고리 태그 표시               |
| Props  | `label`, `variant`, `size`, `onRemove` |
| 변형   | `default`, `owned`, `missing`          |
| 의존성 | shadcn `Badge` 래핑                    |

---

### E08. IconButton

```
/elements/IconButton
├── IconButton.tsx
├── IconButton.type.ts
└── index.ts
```

| 항목   | 내용                                   |
| ------ | -------------------------------------- |
| 목적   | 아이콘만 있는 버튼                     |
| Props  | `icon`, `size`, `variant`, `ariaLabel` |
| 의존성 | shadcn `Button`, `Icon`                |

---

### E09. NumberInput

```
/elements/NumberInput
├── NumberInput.tsx
├── NumberInput.type.ts
├── NumberInput.hook.ts
└── index.ts
```

| 항목  | 내용                                      |
| ----- | ----------------------------------------- |
| 목적  | 숫자 입력 (수량 등)                       |
| Props | `value`, `onChange`, `min`, `max`, `step` |
| 기능  | 증가/감소 버튼, 직접 입력 지원            |

---

### E10. UnitSelect

```
/elements/UnitSelect
├── UnitSelect.tsx
├── UnitSelect.type.ts
└── index.ts
```

| 항목   | 내용                                 |
| ------ | ------------------------------------ |
| 목적   | 단위 선택 드롭다운                   |
| Props  | `value`, `onChange`, `units`         |
| 기본값 | `['g', 'kg', 'ml', 'L', '개', '팩']` |
| 의존성 | shadcn `Select`                      |

---

### E11. ActionButton

```
/elements/ActionButton
├── ActionButton.tsx
├── ActionButton.type.ts
└── index.ts
```

| 항목   | 내용                                       |
| ------ | ------------------------------------------ |
| 목적   | CTA 버튼 (주요 액션)                       |
| Props  | `children`, `icon`, `loading`, `fullWidth` |
| 변형   | `primary`, `secondary`, `ghost`            |
| 의존성 | shadcn `Button`, `Spinner`                 |

---

### E12. TipAlert

```
/elements/TipAlert
├── TipAlert.tsx
├── TipAlert.type.ts
└── index.ts
```

| 항목   | 내용                           |
| ------ | ------------------------------ |
| 목적   | 팁, 안내 메시지 표시           |
| Props  | `title`, `description`, `icon` |
| 의존성 | shadcn `Alert`                 |

---

## 📦 Modules (복합 컴포넌트)

### M01. AppHeader

```
/modules/AppHeader
├── AppHeader.tsx
├── AppHeader.type.ts
└── index.ts
```

| 항목      | 내용                                         |
| --------- | -------------------------------------------- |
| 목적      | 앱 상단 헤더 (로고, 프로필)                  |
| Props     | `title`, `showBack`, `onBack`, `rightAction` |
| 사용 화면 | 모든 페이지                                  |
| Elements  | `Icon`, `IconButton`, `Typography`           |

---

### M02. BottomNav

```
/modules/BottomNav
├── BottomNav.tsx
├── BottomNav.type.ts
├── BottomNav.hook.ts
└── index.ts
```

| 항목      | 내용                      |
| --------- | ------------------------- |
| 목적      | 하단 네비게이션 바        |
| Props     | `items`, `activeKey`      |
| 사용 화면 | 메인, 업로드, 레시피 목록 |
| Elements  | `Icon`, `Typography`      |

---

### M03. ImageUploader

```
/modules/ImageUploader
├── ImageUploader.tsx
├── ImageUploader.type.ts
├── ImageUploader.hook.ts
├── ImageUploader.style.ts
├── /parts
│   └── UploadZone.tsx
└── index.ts
```

| 항목      | 내용                                           |
| --------- | ---------------------------------------------- |
| 목적      | 이미지 업로드 (드래그 앤 드롭, 클릭)           |
| Props     | `onUpload`, `accept`, `maxSize`, `uploadType`  |
| 상태      | `idle`, `uploading`, `success`, `error`        |
| 사용 화면 | 사진 등록, 요리 인증                           |
| Elements  | `Icon`, `Spinner`, `ProgressBar`, `Typography` |

---

### M04. ImagePreview

```
/modules/ImagePreview
├── ImagePreview.tsx
├── ImagePreview.type.ts
└── index.ts
```

| 항목     | 내용                                    |
| -------- | --------------------------------------- |
| 목적     | 업로드된 이미지 미리보기                |
| Props    | `src`, `alt`, `onRemove`, `aspectRatio` |
| Elements | `IconButton`, `ImagePlaceholder`        |

---

### M05. TypeSelector

```
/modules/TypeSelector
├── TypeSelector.tsx
├── TypeSelector.type.ts
└── index.ts
```

| 항목      | 내용                           |
| --------- | ------------------------------ |
| 목적      | 냉장고/영수증 타입 선택 토글   |
| Props     | `value`, `onChange`, `options` |
| 사용 화면 | 사진 등록                      |
| Elements  | `Icon`, `Typography`           |
| 의존성    | shadcn `Tabs`                  |

---

### M06. BoundingBoxCanvas

```
/modules/BoundingBoxCanvas
├── BoundingBoxCanvas.tsx
├── BoundingBoxCanvas.type.ts
├── BoundingBoxCanvas.hook.ts
├── BoundingBoxCanvas.style.ts
├── /parts
│   ├── BoundingBox.tsx
│   └── BoxLabel.tsx
└── index.ts
```

| 항목      | 내용                                     |
| --------- | ---------------------------------------- |
| 목적      | 이미지 위 바운딩박스 표시/편집           |
| Props     | `image`, `boxes`, `onChange`, `editable` |
| 기능      | 드래그 이동, 라벨 수정, 삭제, 추가       |
| 사용 화면 | AI 분석 결과 (냉장고)                    |
| Elements  | `IconButton`, `Typography`               |
| 의존성    | `react-konva` (Canvas 라이브러리)        |

---

### M07. IngredientList

```
/modules/IngredientList
├── IngredientList.tsx
├── IngredientList.type.ts
├── IngredientList.hook.ts
└── index.ts
```

| 항목      | 내용                                                 |
| --------- | ---------------------------------------------------- |
| 목적      | 식재료 목록 표시                                     |
| Props     | `items`, `editable`, `onUpdate`, `onDelete`, `onAdd` |
| 사용 화면 | AI 분석 결과 (영수증), 레시피 상세                   |
| Elements  | `IngredientCard` (M08)                               |

---

### M08. IngredientCard

```
/modules/IngredientCard
├── IngredientCard.tsx
├── IngredientCard.type.ts
├── IngredientCard.hook.ts
└── index.ts
```

| 항목     | 내용                                                            |
| -------- | --------------------------------------------------------------- |
| 목적     | 개별 식재료 카드 (수정/삭제 가능)                               |
| Props    | `ingredient`, `editable`, `onUpdate`, `onDelete`                |
| 기능     | 인라인 편집, 스와이프 삭제                                      |
| Elements | `Icon`, `NumberInput`, `UnitSelect`, `IconButton`, `Typography` |
| 의존성   | shadcn `Card`, `Input`                                          |

---

### M09. RecipeCard

```
/modules/RecipeCard
├── RecipeCard.tsx
├── RecipeCard.type.ts
└── index.ts
```

| 항목      | 내용                                                   |
| --------- | ------------------------------------------------------ |
| 목적      | 레시피 추천 카드                                       |
| Props     | `recipe`, `onClick`                                    |
| 표시 정보 | 썸네일, 제목, 매칭률, 조리시간, 인분                   |
| 사용 화면 | 레시피 추천, 메인 화면                                 |
| Elements  | `ProgressBar`, `Tag`, `Typography`, `ImagePlaceholder` |
| 의존성    | shadcn `Card`                                          |

---

### M10. RecipeIngredientList

```
/modules/RecipeIngredientList
├── RecipeIngredientList.tsx
├── RecipeIngredientList.type.ts
└── index.ts
```

| 항목      | 내용                                        |
| --------- | ------------------------------------------- |
| 목적      | 레시피 재료 목록 (보유/미보유 표시)         |
| Props     | `ingredients`, `ownedIds`                   |
| 사용 화면 | 레시피 상세                                 |
| Elements  | `Tag`, `Icon`, `ActionButton`, `Typography` |

---

### M11. CookingSteps

```
/modules/CookingSteps
├── CookingSteps.tsx
├── CookingSteps.type.ts
└── index.ts
```

| 항목      | 내용                  |
| --------- | --------------------- |
| 목적      | 조리 순서 단계별 표시 |
| Props     | `steps`               |
| 사용 화면 | 레시피 상세           |
| Elements  | `Typography`          |
| 의존성    | shadcn `Collapsible`  |

---

### M12. CategoryChips

```
/modules/CategoryChips
├── CategoryChips.tsx
├── CategoryChips.type.ts
└── index.ts
```

| 항목      | 내용                                 |
| --------- | ------------------------------------ |
| 목적      | 카테고리 필터 가로 스크롤 칩         |
| Props     | `categories`, `selected`, `onChange` |
| 사용 화면 | 레시피 추천                          |
| Elements  | `Tag`                                |

---

### M13. VerifyResult

```
/modules/VerifyResult
├── VerifyResult.tsx
├── VerifyResult.type.ts
└── index.ts
```

| 항목      | 내용                        |
| --------- | --------------------------- |
| 목적      | 요리 인증 결과 점수 표시    |
| Props     | `score`, `feedback`, `rank` |
| 사용 화면 | 요리 인증                   |
| Elements  | `ProgressBar`, `Typography` |

---

### M14. IngredientSummary

```
/modules/IngredientSummary
├── IngredientSummary.tsx
├── IngredientSummary.type.ts
└── index.ts
```

| 항목      | 내용                     |
| --------- | ------------------------ |
| 목적      | 보유 식재료 요약 카드    |
| Props     | `count`, `expiringCount` |
| 사용 화면 | 메인 화면                |
| Elements  | `Icon`, `Typography`     |
| 의존성    | shadcn `Card`            |

---

### M15. AnalyzingOverlay

```
/modules/AnalyzingOverlay
├── AnalyzingOverlay.tsx
├── AnalyzingOverlay.type.ts
└── index.ts
```

| 항목      | 내용                                   |
| --------- | -------------------------------------- |
| 목적      | AI 분석 중 오버레이 표시               |
| Props     | `isVisible`, `progress`, `message`     |
| 사용 화면 | 사진 등록                              |
| Elements  | `Spinner`, `ProgressBar`, `Typography` |

---

### M16. YouTubeButton

```
/modules/YouTubeButton
├── YouTubeButton.tsx
├── YouTubeButton.type.ts
└── index.ts
```

| 항목      | 내용                   |
| --------- | ---------------------- |
| 목적      | YouTube 영상 링크 버튼 |
| Props     | `videoId`, `videoUrl`  |
| 사용 화면 | 레시피 상세            |
| Elements  | `Icon`, `ActionButton` |

---

### M17. ErrorBoundary

```
/modules/ErrorBoundary
├── ErrorBoundary.tsx
├── ErrorBoundary.type.ts
└── index.ts
```

| 항목     | 내용                         |
| -------- | ---------------------------- |
| 목적     | 에러 UI 처리                 |
| Props    | `fallback`, `onRetry`        |
| Elements | `EmptyState`, `ActionButton` |

---

## 📊 화면별 컴포넌트 매핑

### 1. 메인화면 (`/test`)

| 영역        | Module              | Elements                 |
| ----------- | ------------------- | ------------------------ |
| 상단        | `AppHeader`         | Icon, Typography         |
| Hero        | -                   | Typography, ActionButton |
| 식재료 요약 | `IngredientSummary` | Icon, Typography         |
| 추천 레시피 | `RecipeCard` (복수) | ProgressBar, Tag         |
| 하단        | `BottomNav`         | Icon, Typography         |

### 2. 사진 등록 (`/test/upload`)

| 영역        | Module                | Elements                            |
| ----------- | --------------------- | ----------------------------------- |
| 상단        | `AppHeader`           | Icon, Typography                    |
| 타입 선택   | `TypeSelector`        | Icon, Typography (큰 카드형)        |
| 이미지 제어 | `ImageControl` (신규) | ActionButton (이미지 중앙 오버레이) |
| 업로드 후   | `ImagePreview`        | IconButton                          |
| 분석 중     | `AnalyzingOverlay`    | Spinner, ProgressBar                |
| 팁          | `TipAlert`            | Icon, Typography                    |
| CTA         | -                     | ActionButton                        |

### 3. AI 분석 결과 (`/test/review`)

#### 3a. 냉장고 (`?type=fridge`)

| 영역   | Module              | Elements               |
| ------ | ------------------- | ---------------------- |
| 상단   | `AppHeader`         | Icon, Typography       |
| 캔버스 | `BoundingBoxCanvas` | IconButton, Typography |
| CTA    | -                   | ActionButton           |

#### 3b. 영수증 (`?type=receipt`)

| 영역        | Module           | Elements                |
| ----------- | ---------------- | ----------------------- |
| 상단        | `AppHeader`      | Icon, Typography        |
| 식재료 목록 | `IngredientList` | -                       |
| 식재료 카드 | `IngredientCard` | NumberInput, UnitSelect |
| CTA         | -                | ActionButton            |

### 4. 레시피 추천 (`/test/recipes`)

| 영역             | Module              | Elements         |
| ---------------- | ------------------- | ---------------- |
| 상단             | `AppHeader`         | Icon, Typography |
| 보유 식재료 정보 | -                   | Tag, Typography  |
| 카테고리 필터    | `CategoryChips`     | Tag              |
| 레시피 목록      | `RecipeCard` (복수) | ProgressBar, Tag |
| 하단             | `BottomNav`         | Icon, Typography |

### 5. 레시피 상세 (`/test/recipes/[id]`)

| 영역      | Module                 | Elements                |
| --------- | ---------------------- | ----------------------- |
| 상단      | `AppHeader`            | Icon, IconButton        |
| 이미지    | `ImagePreview`         | ImagePlaceholder        |
| 유튜브    | `YouTubeButton`        | Icon                    |
| 재료      | `RecipeIngredientList` | Tag, Icon, ActionButton |
| 조리 순서 | `CookingSteps`         | Typography              |
| CTA       | -                      | ActionButton            |

### 6. 요리 인증 (`/test/verify`)

| 영역   | Module          | Elements                |
| ------ | --------------- | ----------------------- |
| 상단   | `AppHeader`     | Icon, Typography        |
| 업로드 | `ImageUploader` | Icon, Spinner           |
| 결과   | `VerifyResult`  | ProgressBar, Typography |
| CTA    | -               | ActionButton            |

---

## ⚙️ 공통 훅 (Hooks)

### 파일 구조

```
/hooks
├── useImageUpload.ts      # 이미지 업로드 로직
├── useLocalStorage.ts     # 로컬스토리지 CRUD
├── useIngredients.ts      # 식재료 상태 관리
├── useAnalysis.ts         # AI 분석 API 호출
├── useRecipes.ts          # 레시피 추천 API 호출
└── useVerify.ts           # 요리 인증 API 호출
```

| Hook              | 용도                          | 사용 화면            |
| ----------------- | ----------------------------- | -------------------- |
| `useImageUpload`  | 파일 업로드 상태/진행률 관리  | 사진 등록, 요리 인증 |
| `useLocalStorage` | localStorage 타입 세이프 접근 | 전체                 |
| `useIngredients`  | 식재료 CRUD 상태 관리         | 분석 결과, 메인      |
| `useAnalysis`     | AI 분석 API 호출 및 상태      | 사진 등록            |
| `useRecipes`      | 레시피 추천 데이터 페칭       | 레시피 추천/상세     |
| `useVerify`       | 요리 인증 API 호출 및 상태    | 요리 인증            |

---

## 📝 타입 정의 가이드

### 공통 타입 (`/types`)

```
/types
├── ingredient.ts      # 식재료 관련 타입
├── recipe.ts          # 레시피 관련 타입
├── analysis.ts        # AI 분석 결과 타입
├── common.ts          # 공통 유틸리티 타입
└── api.ts             # API 응답 타입
```

### 타입 예시

```typescript
// types/ingredient.ts
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: IngredientUnit;
  expiryDate?: string;
}

export type IngredientUnit = "g" | "kg" | "ml" | "L" | "개" | "팩" | "줌";

// types/recipe.ts
export interface Recipe {
  id: string;
  title: string;
  thumbnailUrl: string;
  matchRate: number;
  cookingTime: number;
  servings: number;
  category: RecipeCategory;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  youtubeUrl?: string;
}

export type RecipeCategory = "한식" | "양식" | "중식" | "일식" | "기타";
```

---

## 🎨 스타일 가이드

### 스타일 상수 패턴 (`*.style.ts`)

```typescript
// Component.style.ts
export const componentStyles = {
  container: "flex flex-col gap-4",
  header: "text-lg font-semibold",
} as const;

// variant별 스타일
export const variantStyles = {
  default: "bg-background text-foreground",
  primary: "bg-primary text-primary-foreground",
} as const;
```

### 반응형 기준

| 브레이크포인트 | 사이즈    | 용도          |
| -------------- | --------- | ------------- |
| (기본)         | < 640px   | 모바일 (기본) |
| `sm`           | >= 640px  | 가로형 모바일 |
| `md`           | >= 768px  | 태블릿        |
| `lg`           | >= 1024px | 데스크탑      |

---

## ✅ 개발 우선순위

### Phase 0: 기반 설정

- [ ] shadcn/ui P0 컴포넌트 설치
- [ ] 폴더 구조 생성
- [ ] 공통 타입 정의

### Phase 1: Elements (기본)

| 순서 | 컴포넌트         | 의존성           |
| :--: | ---------------- | ---------------- |
|  1   | Icon             | lucide-react     |
|  2   | Typography       | -                |
|  3   | Spinner          | -                |
|  4   | ActionButton     | Button, Spinner  |
|  5   | ProgressBar      | Progress         |
|  6   | EmptyState       | Icon, Typography |
|  7   | Tag              | Badge            |
|  8   | IconButton       | Button, Icon     |
|  9   | NumberInput      | Input            |
|  10  | UnitSelect       | Select           |
|  11  | TipAlert         | Alert            |
|  12  | ImagePlaceholder | Icon             |

### Phase 2: Modules (핵심 흐름)

| 순서 | 컴포넌트          | 의존성                              |
| :--: | ----------------- | ----------------------------------- |
|  1   | AppHeader         | Icon, IconButton, Typography        |
|  2   | BottomNav         | Icon, Typography                    |
|  3   | ImageUploader     | Icon, Spinner, ProgressBar          |
|  4   | ImagePreview      | IconButton, ImagePlaceholder        |
|  5   | TypeSelector      | Icon, Typography, Tabs              |
|  6   | IngredientCard    | NumberInput, UnitSelect, IconButton |
|  7   | IngredientList    | IngredientCard                      |
|  8   | BoundingBoxCanvas | IconButton, react-konva             |

### Phase 3: Modules (레시피/인증)

| 순서 | 컴포넌트             | 의존성                  |
| :--: | -------------------- | ----------------------- |
|  1   | RecipeCard           | ProgressBar, Tag, Card  |
|  2   | CategoryChips        | Tag                     |
|  3   | RecipeIngredientList | Tag, Icon, ActionButton |
|  4   | CookingSteps         | Typography, Collapsible |
|  5   | YouTubeButton        | Icon, ActionButton      |
|  6   | VerifyResult         | ProgressBar, Typography |
|  7   | AnalyzingOverlay     | Spinner, ProgressBar    |

### Phase 4: 완성도

| 순서 | 컴포넌트          | 의존성                   |
| :--: | ----------------- | ------------------------ |
|  1   | IngredientSummary | Icon, Typography, Card   |
|  2   | ErrorBoundary     | EmptyState, ActionButton |

---

## 🚨 주의사항

### 코드 품질

1. **any 타입 절대 금지** - 모든 props, state, 이벤트 핸들러에 명시적 타입 지정
2. **Props 인터페이스 분리** - `ComponentName.type.ts`에 정의
3. **매직 넘버 금지** - 상수로 추출하여 `*.style.ts` 또는 상단에 정의

### 성능

1. **React.memo** - 리렌더링 최적화가 필요한 리스트 아이템에 적용
2. **useCallback/useMemo** - 불필요한 재생성 방지 (의존성 배열 주의)
3. **이미지 최적화** - Next.js `Image` 컴포넌트 사용

### 접근성

1. **Semantic HTML** - 적절한 HTML 태그 사용 (button, nav, main 등)
2. **ARIA 레이블** - IconButton 등에 `aria-label` 필수
3. **키보드 접근성** - Tab, Enter, Escape 키 지원

### 디자인 원칙

1. **카드/이모티콘/그림자 최소화** - 꼭 필요한 경우에만 사용
2. **일관된 간격** - Tailwind spacing scale 활용
3. **색상 토큰** - CSS 변수 기반 색상 사용 (`bg-background`, `text-foreground`)

---

_최종 업데이트: 2026-01-26_
