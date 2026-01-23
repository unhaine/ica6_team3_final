# API 설계

## 기본 정보

| 항목            | 값                                    |
| --------------- | ------------------------------------- |
| Base URL (개발) | `http://localhost:3000/api`           |
| Base URL (운영) | `https://refrigerai.vercel.app/api`   |
| 인증 방식       | Bearer Token (JWT) - MVP에서는 선택적 |
| 요청 형식       | JSON / multipart/form-data            |
| 응답 형식       | JSON                                  |

## 인증 헤더

```
Authorization: Bearer {token}
```

## 공통 응답 형식

### 성공

```json
{
  "success": true,
  "data": { ... }
}
```

### 에러

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

---

## 엔드포인트

### 📷 이미지 분석 (Vision)

#### POST /vision/analyze

이미지 업로드 및 객체 탐지 수행

**Request** `multipart/form-data`

| 필드  | 타입 | 필수 | 설명        |
| ----- | ---- | :--: | ----------- |
| image | File |  ✅  | 이미지 파일 |

**Response** `200 OK`

```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "imageUrl": "https://storage.example.com/images/xxx.jpg",
    "detectedItems": [
      {
        "id": "uuid",
        "label": "Apple",
        "labelKr": "사과",
        "confidence": 0.92,
        "boundingBox": {
          "x": 0.1,
          "y": 0.2,
          "width": 0.15,
          "height": 0.2
        }
      },
      {
        "id": "uuid",
        "label": "Milk",
        "labelKr": "우유",
        "confidence": 0.87,
        "boundingBox": {
          "x": 0.5,
          "y": 0.1,
          "width": 0.1,
          "height": 0.3
        }
      }
    ]
  }
}
```

**Errors**

| 코드 | 상황                      |
| :--: | ------------------------- |
| 400  | 이미지 파일 누락          |
| 413  | 파일 크기 초과 (10MB)     |
| 415  | 지원하지 않는 이미지 포맷 |
| 500  | Vision API 호출 실패      |

**상태**: ⏳ 예정

---

### 🥕 식료품 (Groceries)

#### GET /groceries

저장된 식료품 목록 조회

**Query Parameters**

| 파라미터       | 타입   | 필수 | 기본값 | 설명          |
| -------------- | ------ | :--: | :----: | ------------- |
| refrigeratorId | string |  ❌  | 기본값 | 냉장고 ID     |
| category       | string |  ❌  |        | 카테고리 필터 |
| search         | string |  ❌  |        | 검색어        |

**Response** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "사과",
      "quantity": 3,
      "category": "과일",
      "imageUrl": null,
      "expiryDate": null,
      "createdAt": "2026-01-23T10:00:00Z"
    }
  ]
}
```

**상태**: ⏳ 예정

---

#### POST /groceries

식료품 목록 저장 (탐지 결과 확정)

**Request**

```json
{
  "sessionId": "uuid",
  "refrigeratorId": "uuid",
  "items": [
    {
      "detectedItemId": "uuid",
      "name": "사과",
      "quantity": 3,
      "category": "과일"
    },
    {
      "detectedItemId": "uuid",
      "name": "우유",
      "quantity": 1,
      "category": "유제품"
    }
  ]
}
```

**Response** `201 Created`

```json
{
  "success": true,
  "data": {
    "savedCount": 2,
    "items": [...]
  }
}
```

**Errors**

| 코드 | 상황           |
| :--: | -------------- |
| 400  | 필수 필드 누락 |
| 404  | 세션 ID 없음   |

**상태**: ⏳ 예정

---

#### PATCH /groceries/:id

식료품 정보 수정

**Request**

```json
{
  "name": "수정된 이름",
  "quantity": 5,
  "category": "채소",
  "expiryDate": "2026-02-01"
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "data": { ... }
}
```

**상태**: ⏳ 예정

---

#### DELETE /groceries/:id

식료품 삭제

**Response** `200 OK`

```json
{
  "success": true,
  "data": {
    "deletedId": "uuid"
  }
}
```

**상태**: ⏳ 예정

---

### 📦 탐지 아이템 (Detected Items)

#### PATCH /detected-items/:id

탐지된 아이템 수정 (박스 위치, 라벨 수정)

**Request**

```json
{
  "labelKr": "수정된 품목명",
  "boundingBox": {
    "x": 0.12,
    "y": 0.22,
    "width": 0.15,
    "height": 0.2
  }
}
```

**Response** `200 OK`

```json
{
  "success": true,
  "data": { ... }
}
```

**상태**: ⏳ 예정

---

#### DELETE /detected-items/:id

탐지된 아이템 삭제

**상태**: ⏳ 예정

---

#### POST /detected-items

새 아이템 수동 추가

**Request**

```json
{
  "sessionId": "uuid",
  "labelKr": "직접 입력한 품목",
  "boundingBox": {
    "x": 0.3,
    "y": 0.4,
    "width": 0.1,
    "height": 0.15
  }
}
```

**상태**: ⏳ 예정

---

### 🧊 냉장고 (Refrigerators)

#### GET /refrigerators

냉장고 목록 조회

**상태**: ⏳ 예정

---

#### POST /refrigerators

새 냉장고 추가

**Request**

```json
{
  "name": "회사 냉장고"
}
```

**상태**: ⏳ 예정

---

## API 구현 상태

| 메서드 | 엔드포인트          | 설명             | 상태 |
| :----: | ------------------- | ---------------- | :--: |
|  POST  | /vision/analyze     | 이미지 분석      |  ⏳  |
|  GET   | /groceries          | 식료품 목록      |  ⏳  |
|  POST  | /groceries          | 식료품 저장      |  ⏳  |
| PATCH  | /groceries/:id      | 식료품 수정      |  ⏳  |
| DELETE | /groceries/:id      | 식료품 삭제      |  ⏳  |
| PATCH  | /detected-items/:id | 탐지 아이템 수정 |  ⏳  |
| DELETE | /detected-items/:id | 탐지 아이템 삭제 |  ⏳  |
|  POST  | /detected-items     | 탐지 아이템 추가 |  ⏳  |
|  GET   | /refrigerators      | 냉장고 목록      |  ⏳  |
|  POST  | /refrigerators      | 냉장고 추가      |  ⏳  |

---

## 범례

- 🔒 인증 필요
- ⏳ 예정 / 🔄 진행중 / ✅ 완료

---

_최종 업데이트: 2026-01-23_
