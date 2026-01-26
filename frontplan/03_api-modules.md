# 🔌 API 모듈 구조

> 각 기능별 API를 모듈화하여 `/app/api/[기능명]/`에 분리
> 각 폴더에 `README.md` 포함

---

## 📁 폴더 구조

```
/app/api
│
├── /vision                     # 이미지 분석 (기존)
│   └── /analyze
│       ├── route.ts            # 통합 라우터
│       ├── /gemini-flash       # 객체 탐지 ✅
│       │   ├── route.ts
│       │   └── README.md
│       ├── /receipt-ocr        # 영수증 OCR ✅
│       │   ├── route.ts
│       │   └── README.md
│       └── /cloud-vision       # Cloud Vision ✅
│           ├── route.ts
│           └── README.md
│
├── /ingredients                # 식재료 관리 (신규)
│   ├── route.ts                # CRUD
│   └── README.md
│
├── /recipes                    # 레시피 추천 (신규)
│   ├── route.ts                # 추천 목록
│   ├── /[id]
│   │   └── route.ts            # 상세 조회
│   └── README.md
│
└── /verify                     # 요리 인증 (신규)
    ├── route.ts                # AI 싱크로율 판단
    └── README.md
```

---

## 1. Vision API (기존)

### 📍 /api/vision/analyze

**통합 라우터** - 쿼리 파라미터로 API 선택

| 파라미터 | 값             | 설명                    |
| -------- | -------------- | ----------------------- |
| `api`    | `gemini-flash` | 객체 탐지 + 바운딩 박스 |
| `api`    | `receipt-ocr`  | 영수증 텍스트 인식      |
| `api`    | `cloud-vision` | Google Cloud Vision     |
| `api`    | `compare`      | 두 API 결과 비교        |

**사용 예시**:

```typescript
// 냉장고 사진 분석
const res = await fetch("/api/vision/analyze?api=gemini-flash", {
  method: "POST",
  body: JSON.stringify({ image: base64Image }),
});

// 영수증 분석
const res = await fetch("/api/vision/analyze?api=receipt-ocr", {
  method: "POST",
  body: JSON.stringify({ image: base64Image }),
});
```

---

### 📍 /api/vision/analyze/gemini-flash

**기능**: Gemini Flash 2.0을 사용한 냉장고 사진 객체 탐지

**Request**:

```typescript
POST /api/vision/analyze/gemini-flash
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**:

```typescript
{
  "detectedItems": [
    {
      "id": "gf-0-abc1",
      "label": "우유",
      "confidence": 0.95,
      "boundingBox": {
        "x": 0.1,      // 0~1 정규화 좌표
        "y": 0.2,
        "width": 0.15,
        "height": 0.25
      },
      "source": "gemini-flash"
    }
  ],
  "allLabels": ["우유", "당근", "김치"],
  "apiSource": "gemini-flash"
}
```

---

### 📍 /api/vision/analyze/receipt-ocr

**기능**: GPT-4o를 사용한 영수증/구매내역 텍스트 인식

**Request**:

```typescript
POST /api/vision/analyze/receipt-ocr
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

**Response**:

```typescript
{
  "items": [
    {
      "name": "삼겹살",
      "quantity": 1,
      "unit": "팩",
      "price": 15900
    }
  ],
  "store": "이마트",
  "date": "2026-01-25",
  "apiSource": "receipt-ocr"
}
```

---

## 2. Ingredients API (신규)

### 📍 /api/ingredients

**기능**: 사용자 식재료 CRUD

| Method | 기능             |
| ------ | ---------------- |
| GET    | 식재료 목록 조회 |
| POST   | 식재료 등록      |
| PATCH  | 식재료 수정      |
| DELETE | 식재료 삭제      |

**MVP 구현**: 실제 DB 대신 메모리/로컬스토리지 사용

**Request (POST)**:

```typescript
POST /api/ingredients
Content-Type: application/json

{
  "items": [
    {
      "name": "우유",
      "quantity": 1,
      "unit": "L",
      "expiryDate": "2026-02-02",
      "category": "dairy"
    }
  ]
}
```

**Response**:

```typescript
{
  "success": true,
  "data": {
    "created": 3,
    "items": [...]
  }
}
```

---

## 3. Recipes API (신규)

### 📍 /api/recipes

**기능**: 보유 식재료 기반 레시피 추천

**Request (GET)**:

```typescript
GET /api/recipes?ingredients=우유,당근,양파&limit=10
```

**Response**:

```typescript
{
  "success": true,
  "data": [
    {
      "id": "recipe-001",
      "title": "돼지고기 김치찌개",
      "thumbnail": "https://...",
      "matchRate": 0.95,
      "cookingTime": 30,
      "servings": 2,
      "matchedIngredients": ["돼지고기", "김치", "양파"],
      "missingIngredients": ["두부"],
      "youtubeUrl": "https://youtube.com/..."
    }
  ]
}
```

### 📍 /api/recipes/[id]

**기능**: 레시피 상세 조회

**Response**:

```typescript
{
  "id": "recipe-001",
  "title": "돼지고기 김치찌개",
  "description": "얼큰하고 맛있는 김치찌개",
  "thumbnail": "https://...",
  "youtubeUrl": "https://...",
  "cookingTime": 30,
  "servings": 2,
  "difficulty": "easy",
  "ingredients": [
    { "name": "돼지고기 목살", "quantity": 200, "unit": "g" },
    { "name": "배추김치", "quantity": 300, "unit": "g" }
  ],
  "instructions": [
    { "step": 1, "description": "돼지고기를 한입 크기로 썬다" },
    { "step": 2, "description": "냄비에 기름을 두르고 볶는다" }
  ]
}
```

---

## 4. Verify API (신규)

### 📍 /api/verify

**기능**: AI 싱크로율 판단 (레시피 원본 vs 사용자 요리 사진)

**Request**:

```typescript
POST /api/verify
Content-Type: application/json

{
  "recipeId": "recipe-001",
  "image": "data:image/jpeg;base64,..."
}
```

**Response**:

```typescript
{
  "success": true,
  "data": {
    "syncRate": 87,
    "feedback": "색감과 플레이팅이 레시피와 매우 유사합니다!",
    "ranking": 15,
    "badges": ["첫 요리 인증", "80점 이상"]
  }
}
```

**구현 방법**:

- Gemini Vision으로 두 이미지 비교 분석
- 프롬프트 엔지니어링으로 점수화

---

## 📝 각 README.md 내용 예시

### /api/ingredients/README.md

````markdown
# 🥬 Ingredients API

식재료 관리를 위한 CRUD API

## Endpoints

| Method | Path                     | Description    |
| ------ | ------------------------ | -------------- |
| GET    | /api/ingredients         | 전체 목록 조회 |
| POST   | /api/ingredients         | 식재료 추가    |
| PATCH  | /api/ingredients?id={id} | 수정           |
| DELETE | /api/ingredients?id={id} | 삭제           |

## 사용 예시

```typescript
// 식재료 추가
await fetch("/api/ingredients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    items: [{ name: "우유", quantity: 1, unit: "L" }],
  }),
});
```
````

## 데이터 구조

```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category?: string;
  createdAt: string;
}
```

```

---

*최종 업데이트: 2026-01-26*
```
