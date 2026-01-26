# API 설계

## 기본 정보

| 항목 | 값 |
|------|-----|
| Base URL (개발) | `http://localhost:3000/api` |
| Base URL (운영) | `https://api.example.com` |
| 인증 방식 | Bearer Token (JWT) |
| 요청 형식 | JSON |
| 응답 형식 | JSON |

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

### 페이지네이션
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 엔드포인트

<!-- 
AI 가이드: 아래는 예시입니다. 실제 프로젝트의 API 명세로 교체하세요. 
-->

### 🔐 인증 (Auth)

#### POST /auth/register
회원가입

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}
```

**Errors**
| 코드 | 상황 |
|:----:|------|
| 400 | 필수 필드 누락 |
| 409 | 이메일 중복 |

**상태**: ⏳

---

#### POST /auth/login
로그인

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "홍길동"
    }
  }
}
```

**Errors**
| 코드 | 상황 |
|:----:|------|
| 401 | 이메일/비밀번호 불일치 |

**상태**: ⏳

---

### 👤 사용자 (Users)

#### GET /users/me
내 정보 조회 🔒

**Response** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "avatar_url": null,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

**상태**: ⏳

---

#### PATCH /users/me
내 정보 수정 🔒

**Request**
```json
{
  "name": "김길동",
  "avatar_url": "https://..."
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "data": { ... }
}
```

**상태**: ⏳

---

### 📝 게시글 (Posts)

#### GET /posts
게시글 목록

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|:----:|:------:|------|
| page | number | ❌ | 1 | 페이지 번호 |
| limit | number | ❌ | 20 | 페이지당 개수 |
| status | string | ❌ | | draft/published |
| search | string | ❌ | | 검색어 |

**Response** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "제목",
      "status": "published",
      "created_at": "2026-01-01T00:00:00Z",
      "user": {
        "id": "uuid",
        "name": "홍길동"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**상태**: ⏳

---

#### POST /posts
게시글 생성 🔒

**Request**
```json
{
  "title": "제목",
  "content": "내용",
  "status": "draft"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "data": { ... }
}
```

**상태**: ⏳

---

#### GET /posts/:id
게시글 상세

**상태**: ⏳

---

#### PATCH /posts/:id
게시글 수정 🔒

**상태**: ⏳

---

#### DELETE /posts/:id
게시글 삭제 🔒

**상태**: ⏳

---

## API 구현 상태

| 메서드 | 엔드포인트 | 설명 | 상태 |
|:------:|------------|------|:----:|
| POST | /auth/register | 회원가입 | ⏳ |
| POST | /auth/login | 로그인 | ⏳ |
| GET | /users/me | 내 정보 | ⏳ |
| PATCH | /users/me | 정보 수정 | ⏳ |
| GET | /posts | 목록 | ⏳ |
| POST | /posts | 생성 | ⏳ |
| GET | /posts/:id | 상세 | ⏳ |
| PATCH | /posts/:id | 수정 | ⏳ |
| DELETE | /posts/:id | 삭제 | ⏳ |

---

## 범례

- 🔒 인증 필요
- ⏳ 예정 / 🔄 진행중 / ✅ 완료

---

*최종 업데이트: YYYY-MM-DD*
