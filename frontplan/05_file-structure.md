# 📁 파일 구조

> MVP 프로토타입 파일 구조 정의

---

## 전체 구조

```
/refrigerai
│
├── /app
│   │
│   ├── /test                        # 🎯 MVP 프로토타입 페이지
│   │   ├── layout.tsx               # 테스트 레이아웃
│   │   ├── page.tsx                 # 메인 대시보드
│   │   │
│   │   ├── /login
│   │   │   └── page.tsx             # 로그인 화면
│   │   │
│   │   ├── /upload
│   │   │   └── page.tsx             # 사진 업로드 + 분석
│   │   │
│   │   ├── /review
│   │   │   └── page.tsx             # AI 분석 결과 검토/교정
│   │   │
│   │   ├── /recipes
│   │   │   ├── page.tsx             # 레시피 추천 목록
│   │   │   └── /[id]
│   │   │       └── page.tsx         # 레시피 상세
│   │   │
│   │   └── /verify
│   │       └── page.tsx             # 요리 인증 (싱크로율)
│   │
│   ├── /api                         # 🔌 API 모듈
│   │   │
│   │   ├── /vision                  # 이미지 분석 (기존)
│   │   │   └── /analyze
│   │   │       ├── route.ts         # 통합 라우터
│   │   │       ├── /gemini-flash
│   │   │       │   ├── route.ts
│   │   │       │   └── README.md
│   │   │       ├── /receipt-ocr
│   │   │       │   ├── route.ts
│   │   │       │   └── README.md
│   │   │       └── /cloud-vision
│   │   │           ├── route.ts
│   │   │           └── README.md
│   │   │
│   │   ├── /ingredients             # 식재료 관리 (신규)
│   │   │   ├── route.ts
│   │   │   └── README.md
│   │   │
│   │   ├── /recipes                 # 레시피 추천 (신규)
│   │   │   ├── route.ts
│   │   │   ├── /[id]
│   │   │   │   └── route.ts
│   │   │   └── README.md
│   │   │
│   │   └── /verify                  # 요리 인증 (신규)
│   │       ├── route.ts
│   │       └── README.md
│   │
│   └── /devplan                     # 📋 개발 계획서
│       ├── overview.md
│       ├── 01_user-flow.md
│       ├── 02_wireframe.md
│       ├── 03_api-modules.md
│       ├── 04_tech-stack.md
│       └── 05_file-structure.md
│
├── /components                      # 🧩 공유 컴포넌트
│   ├── BoundingBoxCanvas.tsx        # 바운딩 박스 캔버스 (기존)
│   ├── ImagePreview.tsx             # 이미지 미리보기 (기존)
│   │
│   └── /ui                          # shadcn/ui 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── checkbox.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── sheet.tsx
│       ├── tabs.tsx
│       ├── collapsible.tsx
│       └── toast.tsx
│
├── /lib                             # 📚 유틸리티
│   ├── utils.ts                     # cn() 등 유틸 함수
│   └── api.ts                       # API 호출 헬퍼 (신규)
│
├── /public
│   └── /data
│       └── recipes.json             # 정적 레시피 데이터
│
└── /frontplan                       # 기획서 (기존)
    └── ...
```

---

## 각 파일 역할

### /test 페이지

| 파일                    | 역할                           |
| ----------------------- | ------------------------------ |
| `layout.tsx`            | BottomNavigation 공통 레이아웃 |
| `page.tsx`              | 메인 대시보드                  |
| `login/page.tsx`        | 소셜 로그인 (카카오/구글)      |
| `upload/page.tsx`       | 이미지 업로드 + AI 분석 요청   |
| `review/page.tsx`       | 분석 결과 검토/교정 UI         |
| `recipes/page.tsx`      | 추천 레시피 목록               |
| `recipes/[id]/page.tsx` | 레시피 상세 조리법             |
| `verify/page.tsx`       | 요리 완성 사진 인증            |

### /api 모듈

| 폴더                          | 역할             | 상태 |
| ----------------------------- | ---------------- | :--: |
| `vision/analyze/gemini-flash` | 냉장고 객체 탐지 |  ✅  |
| `vision/analyze/receipt-ocr`  | 영수증 OCR       |  ✅  |
| `vision/analyze/cloud-vision` | Cloud Vision     |  ✅  |
| `ingredients`                 | 식재료 CRUD      |  ⏳  |
| `recipes`                     | 레시피 추천/상세 |  ⏳  |
| `verify`                      | 싱크로율 판단    |  ⏳  |

### /components

| 파일                    | 역할               | 상태 |
| ----------------------- | ------------------ | :--: |
| `BoundingBoxCanvas.tsx` | 바운딩 박스 렌더링 |  ✅  |
| `ImagePreview.tsx`      | 이미지 미리보기    |  ✅  |
| `BottomNav.tsx`         | 하단 네비게이션    |  ⏳  |
| `IngredientCard.tsx`    | 식재료 카드        |  ⏳  |
| `RecipeCard.tsx`        | 레시피 카드        |  ⏳  |

---

## 네이밍 컨벤션

| 항목     | 규칙         | 예시                        |
| -------- | ------------ | --------------------------- |
| 페이지   | `page.tsx`   | `/test/upload/page.tsx`     |
| 레이아웃 | `layout.tsx` | `/test/layout.tsx`          |
| API      | `route.ts`   | `/api/ingredients/route.ts` |
| 컴포넌트 | PascalCase   | `RecipeCard.tsx`            |
| 유틸     | camelCase    | `utils.ts`                  |

---

_최종 업데이트: 2026-01-26_
