# 🚀 냉파고수 MVP 개발 계획

> **목표**: 최소 기능 제품(MVP)으로 핵심 사용자 흐름 구현
> **기간**: Sprint 1 (1주)
> **위치**: `/app/test/*` (프로토타입), `/app/api/*` (API 모듈)

---

## 📋 문서 목록

| 문서                                           | 설명              | 상태 |
| ---------------------------------------------- | ----------------- | :--: |
| [01_user-flow.md](./01_user-flow.md)           | 사용자 흐름도     |  ✅  |
| [02_wireframe.md](./02_wireframe.md)           | 화면 와이어프레임 |  ✅  |
| [03_api-modules.md](./03_api-modules.md)       | API 모듈 구조     |  ✅  |
| [04_tech-stack.md](./04_tech-stack.md)         | 기술 스택         |  ✅  |
| [05_file-structure.md](./05_file-structure.md) | 파일 구조         |  ✅  |

---

## 🎯 MVP 핵심 기능

### 1. 사용자 흐름

```
[로그인] → [메인화면] → [사진등록] → [AI분석결과] → [레시피추천] → [레시피상세] → [요리인증]
                ↑                                                              ↓
                └──────────────────────── 완료 ←──────────────────────────────┘
```

### 2. 핵심 화면 (7개)

| #   | 경로                 | 화면명     | 설명                      |
| --- | -------------------- | ---------- | ------------------------- |
| 1   | `/test`              | 메인       | 홈 대시보드               |
| 2   | `/test/login`        | 로그인     | 소셜 로그인               |
| 3   | `/test/upload`       | 사진등록   | 냉장고/영수증 사진 업로드 |
| 4   | `/test/review`       | AI분석결과 | 식재료 검토/교정          |
| 5   | `/test/recipes`      | 레시피추천 | 추천 레시피 목록          |
| 6   | `/test/recipes/[id]` | 레시피상세 | 상세 조리법               |
| 7   | `/test/verify`       | 요리인증   | AI 싱크로율 평가          |

### 3. API 모듈

| 경로                               | 기능                    |  상태   |
| ---------------------------------- | ----------------------- | :-----: |
| `/api/vision/analyze/gemini-flash` | 냉장고 사진 객체 탐지   | ✅ 기존 |
| `/api/vision/analyze/receipt-ocr`  | 영수증 텍스트 인식      | ✅ 기존 |
| `/api/ingredients`                 | 식재료 CRUD             | ⏳ 예정 |
| `/api/recipes`                     | 레시피 추천/검색        | ⏳ 예정 |
| `/api/verify`                      | 요리 사진 싱크로율 판단 | ⏳ 예정 |

---

## 🛠 기술 스택

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React useState/useReducer (경량)
- **AI**: Gemini Flash 2.0, GPT-4o Vision
- **Canvas**: react-konva (바운딩 박스)

---

## 📁 폴더 구조

```
/app
├── /test                    # MVP 프로토타입 페이지
│   ├── page.tsx             # 메인
│   ├── /login/page.tsx      # 로그인
│   ├── /upload/page.tsx     # 사진 등록
│   ├── /review/page.tsx     # AI 분석 결과
│   ├── /recipes/page.tsx    # 레시피 추천
│   ├── /recipes/[id]/page.tsx # 레시피 상세
│   └── /verify/page.tsx     # 요리 인증
│
├── /api                     # API 모듈
│   ├── /vision              # 이미지 분석 (기존)
│   │   └── /analyze
│   │       ├── /gemini-flash    # 객체 탐지
│   │       └── /receipt-ocr     # 영수증 OCR
│   ├── /ingredients         # 식재료 관리 (신규)
│   ├── /recipes             # 레시피 추천 (신규)
│   └── /verify              # 요리 인증 (신규)
│
└── /devplan                 # 개발 계획서
    ├── overview.md
    ├── 01_user-flow.md
    ├── 02_wireframe.md
    ├── 03_api-modules.md
    ├── 04_tech-stack.md
    └── 05_file-structure.md
```

---

## ⚡ 개발 우선순위

### Phase 1: 핵심 흐름 (3일)

1. ✅ 사진 업로드 + AI 분석 (기존 활용)
2. ⏳ 분석 결과 검토/교정 UI
3. ⏳ 레시피 추천 화면

### Phase 2: 완성도 (2일)

4. ⏳ 레시피 상세 페이지
5. ⏳ 요리 인증 (싱크로율)
6. ⏳ 메인 대시보드

### Phase 3: 개선 (2일)

7. ⏳ 로그인/인증
8. ⏳ 반응형 모바일 최적화
9. ⏳ 에러 처리/로딩 상태

---

_최종 업데이트: 2026-01-26_
