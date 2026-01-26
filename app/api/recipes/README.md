# 🍳 Recipes API

> 보유 식재료 기반 레시피 추천 API

---

## 📍 Endpoints

| Method | Path                | Description      |
| ------ | ------------------- | ---------------- |
| GET    | `/api/recipes`      | 추천 레시피 목록 |
| GET    | `/api/recipes/[id]` | 레시피 상세 조회 |

---

## 📥 Request (GET /api/recipes)

```
GET /api/recipes?ingredients=우유,당근,양파&limit=10&category=한식
```

### Query Parameters

| 파라미터      | 타입   | 필수 | 설명                        |
| ------------- | ------ | :--: | --------------------------- |
| `ingredients` | string |  ✅  | 보유 식재료 (쉼표 구분)     |
| `limit`       | number |  ❌  | 결과 개수 (기본 10)         |
| `category`    | string |  ❌  | 카테고리 필터               |
| `minMatch`    | number |  ❌  | 최소 매칭률 (0~1, 기본 0.5) |

---

## 📤 Response (목록)

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
      "difficulty": "easy",
      "category": "한식",
      "matchedIngredients": ["돼지고기", "김치", "양파"],
      "missingIngredients": ["두부"],
      "youtubeUrl": "https://youtube.com/..."
    }
  ],
  "total": 15
}
```

---

## 📤 Response (상세)

```typescript
{
  "id": "recipe-001",
  "title": "돼지고기 김치찌개",
  "description": "얼큰하고 맛있는 김치찌개",
  "thumbnail": "https://...",
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "cookingTime": 30,
  "servings": 2,
  "difficulty": "easy",
  "category": "한식",
  "ingredients": [
    { "name": "돼지고기 목살", "quantity": 200, "unit": "g" },
    { "name": "배추김치", "quantity": 300, "unit": "g" },
    { "name": "양파", "quantity": 0.5, "unit": "개" },
    { "name": "두부", "quantity": 0.5, "unit": "모" }
  ],
  "instructions": [
    { "step": 1, "description": "돼지고기를 한입 크기로 썬다" },
    { "step": 2, "description": "냄비에 기름을 두르고 돼지고기를 볶는다" },
    { "step": 3, "description": "김치를 넣고 함께 볶는다" },
    { "step": 4, "description": "물을 붓고 끓인다" },
    { "step": 5, "description": "두부를 넣고 5분 더 끓인다" }
  ]
}
```

---

## 💻 사용 예시

```typescript
// 추천 레시피 조회
const getRecommendedRecipes = async (ingredients: string[]) => {
  const query = ingredients.join(",");
  const response = await fetch(
    `/api/recipes?ingredients=${query}&minMatch=0.8`,
  );
  return response.json();
};

// 레시피 상세 조회
const getRecipeDetail = async (id: string) => {
  const response = await fetch(`/api/recipes/${id}`);
  return response.json();
};
```

---

## 🎯 매칭률 계산

```
매칭률 = (보유하고 있는 필요 식재료 수 / 전체 필요 식재료 수) × 100
```

예시:

- 레시피 필요 재료: 돼지고기, 김치, 양파, 두부 (4개)
- 보유 재료: 돼지고기, 김치, 양파 (3개)
- 매칭률: 3/4 = 75%

---

## 📁 데이터 소스

MVP에서는 `/public/data/recipes.json` 정적 파일 사용

---

_최종 업데이트: 2026-01-26_
