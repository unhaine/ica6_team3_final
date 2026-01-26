# API 설계

## 기본 정보

| 항목            | 값                                    |
| --------------- | ------------------------------------- |
| Base URL (개발) | `http://localhost:3000/api`           |
| Base URL (운영) | `https://naengpa-gosu.vercel.app/api` |
| 인증 방식       | Bearer Token (JWT)                    |
| 요청 형식       | JSON / multipart/form-data            |
| 응답 형식       | JSON                                  |

## 인증 헤더

```
Authorization: Bearer {token}
```

## 공통 응답 형식

### 성공

```json
{ "success": true, "data": { ... } }
```

### 에러

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "메시지" } }
```

---

## 엔드포인트 목록

### 🔐 인증 (Auth)

| 메서드 | 경로           | 설명        | 인증 | 상태 |
| :----: | -------------- | ----------- | :--: | :--: |
|  POST  | /auth/register | 회원가입    |  ❌  |  ⏳  |
|  POST  | /auth/login    | 로그인      |  ❌  |  ⏳  |
|  POST  | /auth/social   | 소셜 로그인 |  ❌  |  ⏳  |

### 👤 사용자 (Users)

| 메서드 | 경로      | 설명         | 인증 | 상태 |
| :----: | --------- | ------------ | :--: | :--: |
|  GET   | /users/me | 내 정보 조회 |  🔒  |  ⏳  |
| PATCH  | /users/me | 내 정보 수정 |  🔒  |  ⏳  |

### 🥬 식재료 (Ingredients)

| 메서드 | 경로                 | 설명        | 인증 | 상태 |
| :----: | -------------------- | ----------- | :--: | :--: |
|  POST  | /ingredients/analyze | 이미지 분석 |  🔒  |  ⏳  |
|  POST  | /ingredients         | 식재료 등록 |  🔒  |  ⏳  |
|  GET   | /ingredients         | 식재료 목록 |  🔒  |  ⏳  |
| PATCH  | /ingredients/:id     | 식재료 수정 |  🔒  |  ⏳  |
| DELETE | /ingredients/:id     | 식재료 삭제 |  🔒  |  ⏳  |

### 🍳 레시피 (Recipes)

| 메서드 | 경로               | 설명           | 인증 | 상태 |
| :----: | ------------------ | -------------- | :--: | :--: |
|  GET   | /recipes           | 레시피 목록    |  ❌  |  ⏳  |
|  GET   | /recipes/recommend | 맞춤 추천      |  🔒  |  ⏳  |
|  GET   | /recipes/:id       | 레시피 상세    |  ❌  |  ⏳  |
|  POST  | /recipes/generate  | AI 레시피 생성 |  🔒  |  ⏳  |

### 📝 사진 인증 / 싱크로율 (Verification)

| 메서드 | 경로              | 설명             | 인증 | 상태 |
| :----: | ----------------- | ---------------- | :--: | :--: |
|  POST  | /posts/:id/verify | AI 싱크로율 판단 |  🔒  |  ⏳  |

### 📝 커뮤니티 (Posts)

| 메서드 | 경로            | 설명        | 인증 | 상태 |
| :----: | --------------- | ----------- | :--: | :--: |
|  GET   | /posts          | 게시글 목록 |  ❌  |  ⏳  |
|  POST  | /posts          | 게시글 작성 |  🔒  |  ⏳  |
|  GET   | /posts/:id      | 게시글 상세 |  ❌  |  ⏳  |
| PATCH  | /posts/:id      | 게시글 수정 |  🔒  |  ⏳  |
| DELETE | /posts/:id      | 게시글 삭제 |  🔒  |  ⏳  |
|  POST  | /posts/:id/like | 좋아요 토글 |  🔒  |  ⏳  |

### 💬 댓글 (Comments)

| 메서드 | 경로                | 설명      | 인증 | 상태 |
| :----: | ------------------- | --------- | :--: | :--: |
|  GET   | /posts/:id/comments | 댓글 목록 |  ❌  |  ⏳  |
|  POST  | /posts/:id/comments | 댓글 작성 |  🔒  |  ⏳  |
| DELETE | /comments/:id       | 댓글 삭제 |  🔒  |  ⏳  |

### 🔔 알림 (Notifications)

| 메서드 | 경로                    | 설명      | 인증 | 상태 |
| :----: | ----------------------- | --------- | :--: | :--: |
|  GET   | /notifications          | 알림 목록 |  🔒  |  ⏳  |
| PATCH  | /notifications/:id/read | 읽음 처리 |  🔒  |  ⏳  |

---

## 주요 API 상세

### POST /ingredients/analyze

이미지 분석 및 식재료 추출

**Request** `multipart/form-data`

- image: 영수증/냉장고 이미지 파일
- type: receipt | fridge | purchase_history

**Response**

```json
{
  "success": true,
  "data": {
    "uploadId": "uuid",
    "ingredients": [
      { "name": "양파", "quantity": 3, "unit": "개", "confidence": 0.95 }
    ],
    "duplicates": [{ "name": "양파", "existingQuantity": 2 }]
  }
}
```

---

### GET /recipes/recommend

내 식재료 기반 레시피 추천

**Query Params**: minMatch (기본 0.8), limit (기본 10)

**Response**

```json
{
  "success": true,
  "data": [
    {
      "recipe": {
        "id": "uuid",
        "title": "돼지고기 김치찌개",
        "youtubeUrl": "..."
      },
      "matchRate": 0.85,
      "matchedIngredients": ["돼지고기", "김치"],
      "missingIngredients": ["두부"],
      "shoppingLinks": {
        "두부": {
          "coupang": "https://...",
          "kurly": "https://..."
        }
      }
    }
  ]
}
```

---

### POST /posts/:id/verify

AI 싱크로율 판단 (레시피 원본 vs 사용자 요리 사진 비교)

**Request** `multipart/form-data`

- image: 사용자 요리 완성 사진
- recipeId: 참조 레시피 ID

**Response**

```json
{
  "success": true,
  "data": {
    "syncRate": 87,
    "feedback": "색감과 플레이팅이 레시피와 매우 유사합니다!",
    "ranking": 15
  }
}
```

---

## 범례

- 🔒 인증 필요
- ⏳ 예정 / 🔄 진행중 / ✅ 완료

---

_최종 업데이트: 2026-01-26_
