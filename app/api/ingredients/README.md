# 🥬 Ingredients API

> 사용자 식재료 관리 CRUD API

---

## 📍 Endpoints

| Method | Path                       | Description    |
| ------ | -------------------------- | -------------- |
| GET    | `/api/ingredients`         | 전체 목록 조회 |
| POST   | `/api/ingredients`         | 식재료 추가    |
| PATCH  | `/api/ingredients?id={id}` | 수정           |
| DELETE | `/api/ingredients?id={id}` | 삭제           |

---

## 📥 Request (POST)

```typescript
// Content-Type: application/json
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

---

## 📤 Response

```typescript
{
  "success": true,
  "data": {
    "created": 1,
    "items": [
      {
        "id": "ing-001",
        "name": "우유",
        "quantity": 1,
        "unit": "L",
        "expiryDate": "2026-02-02",
        "category": "dairy",
        "createdAt": "2026-01-26T12:00:00Z"
      }
    ]
  }
}
```

---

## 💻 사용 예시

```typescript
// 식재료 추가
const addIngredients = async (items) => {
  const response = await fetch("/api/ingredients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return response.json();
};

// 목록 조회
const getIngredients = async () => {
  const response = await fetch("/api/ingredients");
  return response.json();
};

// 삭제
const deleteIngredient = async (id) => {
  const response = await fetch(`/api/ingredients?id=${id}`, {
    method: "DELETE",
  });
  return response.json();
};
```

---

## 📦 데이터 구조

```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  category?:
    | "vegetable"
    | "meat"
    | "seafood"
    | "dairy"
    | "grain"
    | "seasoning"
    | "other";
  createdAt: string;
  updatedAt?: string;
}
```

---

## 📁 카테고리

| 코드        | 설명        |
| ----------- | ----------- |
| `vegetable` | 채소        |
| `meat`      | 육류        |
| `seafood`   | 해산물      |
| `dairy`     | 유제품      |
| `grain`     | 곡류        |
| `seasoning` | 양념/조미료 |
| `other`     | 기타        |

---

## ⚠️ MVP 참고

- 현재 MVP에서는 실제 DB 대신 **메모리/localStorage** 사용
- 서버 재시작 시 데이터 초기화됨

---

_최종 업데이트: 2026-01-26_
