# 🛠 기술 스택

> MVP 개발에 사용되는 기술 스택 정의

---

## Frontend

| 기술             | 버전   | 용도                    |
| ---------------- | ------ | ----------------------- |
| **Next.js**      | 15.x   | 프레임워크 (App Router) |
| **React**        | 19.x   | UI 라이브러리           |
| **TypeScript**   | 5.x    | 타입 안전성             |
| **Tailwind CSS** | 3.x    | 스타일링                |
| **shadcn/ui**    | latest | UI 컴포넌트             |

### shadcn/ui 설치 컴포넌트

```bash
npx shadcn@latest add button card input select checkbox
npx shadcn@latest add progress skeleton alert badge
npx shadcn@latest add sheet tabs collapsible toast
```

---

## Canvas / 이미지

| 기술            | 용도               |
| --------------- | ------------------ |
| **react-konva** | 바운딩 박스 캔버스 |
| **use-image**   | Konva 이미지 로딩  |
| **sharp**       | 서버 이미지 최적화 |

---

## AI / Vision

| 기술                    | 용도             |
| ----------------------- | ---------------- |
| **Gemini Flash 2.0**    | 냉장고 객체 탐지 |
| **GPT-4o Vision**       | 영수증 OCR       |
| **Google Cloud Vision** | 대체 객체 탐지   |

### API 키 환경변수

```env
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_VISION_API_KEY=your_google_vision_key
```

---

## 상태 관리 (MVP)

| 방식              | 용도                    |
| ----------------- | ----------------------- |
| `useState`        | 로컬 컴포넌트 상태      |
| `useReducer`      | 복잡한 상태 (분석 결과) |
| `localStorage`    | 임시 데이터 저장        |
| URL Search Params | 페이지 간 데이터 전달   |

### 상태 흐름 예시

```typescript
// 분석 결과 전달
const router = useRouter();
const analysisResult = { ... };

// URL 파라미터로 전달 (작은 데이터)
router.push(`/test/review?data=${encodeURIComponent(JSON.stringify(result))}`);

// localStorage로 전달 (큰 데이터)
localStorage.setItem('analysisResult', JSON.stringify(result));
router.push('/test/review');
```

---

## 데이터 (MVP)

| 항목          | 방식                |
| ------------- | ------------------- |
| 식재료 목록   | localStorage        |
| 레시피 데이터 | 정적 JSON 파일      |
| 분석 결과     | 메모리 / URL params |

### 레시피 데이터 구조

```
/public
└── /data
    └── recipes.json    # 정적 레시피 데이터
```

---

## 개발 도구

| 도구     | 용도        |
| -------- | ----------- |
| ESLint   | 코드 린팅   |
| Prettier | 코드 포맷팅 |
| VS Code  | 에디터      |

---

## 배포

| 환경     | 플랫폼         |
| -------- | -------------- |
| 개발     | localhost:3000 |
| 스테이징 | Vercel Preview |
| 프로덕션 | Vercel         |

---

_최종 업데이트: 2026-01-26_
