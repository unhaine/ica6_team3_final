# 데이터베이스 구조

## 개요

- **DBMS**: PostgreSQL
- **ORM**: Prisma

## ERD (Entity Relationship Diagram)

```
[User] 1 ──── N [Ingredient]
   │              │
   │              N
   │              │
   │          [Recipe]
   │              │
   │              N
   │              │
   └── 1 ──── N [Post]
               │
               N
               │
           [Comment]
               │
               N
               │
            [Like]
```

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    User     │     │   Ingredient     │     │ IngredientMaster│
│─────────────│     │──────────────────│     │─────────────────│
│ id (PK)     │◄────│ userId (FK)      │     │ id (PK)         │
│ email       │     │ masterId (FK)    │────►│ name            │
│ password    │     │ name             │     │ category        │
│ name        │     │ quantity         │     │ shelfLifeDays   │
│ avatarUrl   │     │ unit             │     │ createdAt       │
│ provider    │     │ purchaseDate     │     └─────────────────┘
│ createdAt   │     │ expiryDate       │
│ updatedAt   │     │ status           │     ┌─────────────────┐
└─────────────┘     │ createdAt        │     │     Recipe      │
       │            └──────────────────┘     │─────────────────│
       │                                     │ id (PK)         │
       │            ┌──────────────────┐     │ title           │
       │            │   ImageUpload    │     │ description     │
       │            │──────────────────│     │ ingredients     │
       └───────────►│ userId (FK)      │     │ instructions    │
                    │ originalUrl      │     │ youtubeUrl      │
                    │ type             │     │ thumbnail       │
                    │ analyzedData     │     │ cookingTime     │
                    │ createdAt        │     │ servings        │
                    └──────────────────┘     │ difficulty      │
                                             │ createdAt       │
┌─────────────┐     ┌──────────────────┐     └─────────────────┘
│    Post     │     │    Comment       │
│─────────────│     │──────────────────│     ┌─────────────────┐
│ id (PK)     │◄────│ postId (FK)      │     │      Like       │
│ userId (FK) │     │ userId (FK)      │     │─────────────────│
│ title       │     │ content          │     │ id (PK)         │
│ content     │     │ createdAt        │     │ postId (FK)     │
│ imageUrl    │     │ updatedAt        │     │ userId (FK)     │
│ category    │     └──────────────────┘     │ createdAt       │
│ viewCount   │                              └─────────────────┘
│ likeCount   │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

---

## 테이블 정의

### users

사용자 정보

| 컬럼         | 타입         | 설명                                | 제약조건         |
| ------------ | ------------ | ----------------------------------- | ---------------- |
| id           | UUID         | 고유 ID                             | PK               |
| email        | VARCHAR(255) | 이메일                              | UNIQUE, NOT NULL |
| password     | VARCHAR(255) | 비밀번호 (해시, 소셜로그인 시 NULL) |                  |
| name         | VARCHAR(100) | 이름/닉네임                         | NOT NULL         |
| avatar_url   | TEXT         | 프로필 이미지                       |                  |
| provider     | ENUM         | local/kakao/google                  | DEFAULT 'local'  |
| provider_id  | VARCHAR(255) | 소셜 로그인 고유 ID                 |                  |
| push_enabled | BOOLEAN      | 푸시 알림 허용                      | DEFAULT true     |
| created_at   | TIMESTAMP    | 생성일                              | DEFAULT NOW()    |
| updated_at   | TIMESTAMP    | 수정일                              |                  |

---

### ingredient_masters

식재료 마스터 데이터 (식약처 데이터 기반)

| 컬럼            | 타입         | 설명                                             | 제약조건                   |
| --------------- | ------------ | ------------------------------------------------ | -------------------------- |
| id              | UUID         | 고유 ID                                          | PK                         |
| name            | VARCHAR(100) | 식재료명                                         | UNIQUE, NOT NULL           |
| category        | ENUM         | vegetable/meat/seafood/dairy/grain/seasoning/etc | NOT NULL                   |
| shelf_life_days | INT          | 권장 소비기한 (일)                               | NOT NULL                   |
| storage_method  | ENUM         | refrigerator/freezer/room                        | DEFAULT 'refrigerator'     |
| source          | VARCHAR(50)  | 데이터 출처                                      | DEFAULT '식품의약품안전처' |
| created_at      | TIMESTAMP    | 생성일                                           | DEFAULT NOW()              |

---

### ingredients

사용자 보유 식재료

| 컬럼            | 타입          | 설명                          | 제약조건                |
| --------------- | ------------- | ----------------------------- | ----------------------- |
| id              | UUID          | 고유 ID                       | PK                      |
| user_id         | UUID          | 소유자                        | FK → users, NOT NULL    |
| master_id       | UUID          | 마스터 데이터                 | FK → ingredient_masters |
| name            | VARCHAR(100)  | 식재료명 (사용자 입력)        | NOT NULL                |
| quantity        | DECIMAL(10,2) | 수량                          | DEFAULT 1               |
| unit            | VARCHAR(20)   | 단위 (개, g, ml 등)           | DEFAULT '개'            |
| purchase_date   | DATE          | 구매일                        | DEFAULT NOW()           |
| expiry_date     | DATE          | 소비기한                      |                         |
| status          | ENUM          | active/used/expired/discarded | DEFAULT 'active'        |
| image_upload_id | UUID          | 업로드 이미지 참조            | FK → image_uploads      |
| created_at      | TIMESTAMP     | 생성일                        | DEFAULT NOW()           |
| updated_at      | TIMESTAMP     | 수정일                        |                         |

---

### image_uploads

업로드된 이미지 및 분석 결과

| 컬럼          | 타입      | 설명                                  | 제약조건             |
| ------------- | --------- | ------------------------------------- | -------------------- |
| id            | UUID      | 고유 ID                               | PK                   |
| user_id       | UUID      | 업로더                                | FK → users, NOT NULL |
| original_url  | TEXT      | 원본 이미지 URL                       | NOT NULL             |
| type          | ENUM      | receipt/fridge/purchase_history/other | NOT NULL             |
| analyzed_data | JSONB     | AI 분석 결과 (식재료 목록)            |                      |
| status        | ENUM      | pending/analyzing/completed/failed    | DEFAULT 'pending'    |
| created_at    | TIMESTAMP | 생성일                                | DEFAULT NOW()        |

---

### recipes

레시피 정보

| 컬럼          | 타입         | 설명                                      | 제약조건         |
| ------------- | ------------ | ----------------------------------------- | ---------------- |
| id            | UUID         | 고유 ID                                   | PK               |
| title         | VARCHAR(200) | 레시피 제목                               | NOT NULL         |
| description   | TEXT         | 레시피 설명                               |                  |
| thumbnail_url | TEXT         | 썸네일 이미지                             |                  |
| ingredients   | JSONB        | 필요 식재료 목록 [{name, quantity, unit}] | NOT NULL         |
| instructions  | JSONB        | 조리 순서 [{step, description}]           |                  |
| youtube_url   | TEXT         | 유튜브 영상 링크                          |                  |
| cooking_time  | INT          | 조리 시간 (분)                            |                  |
| servings      | INT          | 인분                                      | DEFAULT 2        |
| difficulty    | ENUM         | easy/medium/hard                          | DEFAULT 'medium' |
| category      | VARCHAR(50)  | 카테고리 (한식, 양식 등)                  |                  |
| source        | ENUM         | system/ai/user                            | DEFAULT 'system' |
| view_count    | INT          | 조회수                                    | DEFAULT 0        |
| created_at    | TIMESTAMP    | 생성일                                    | DEFAULT NOW()    |
| updated_at    | TIMESTAMP    | 수정일                                    |                  |

---

### posts

커뮤니티 게시글

| 컬럼          | 타입         | 설명                       | 제약조건               |
| ------------- | ------------ | -------------------------- | ---------------------- |
| id            | UUID         | 고유 ID                    | PK                     |
| user_id       | UUID         | 작성자                     | FK → users, NOT NULL   |
| title         | VARCHAR(200) | 제목                       | NOT NULL               |
| content       | TEXT         | 내용                       | NOT NULL               |
| image_url     | TEXT         | 첨부 이미지                |                        |
| category      | ENUM         | recipe_share/tips/question | DEFAULT 'recipe_share' |
| view_count    | INT          | 조회수                     | DEFAULT 0              |
| like_count    | INT          | 좋아요 수 (캐싱)           | DEFAULT 0              |
| comment_count | INT          | 댓글 수 (캐싱)             | DEFAULT 0              |
| created_at    | TIMESTAMP    | 생성일                     | DEFAULT NOW()          |
| updated_at    | TIMESTAMP    | 수정일                     |                        |

---

### comments

게시글 댓글

| 컬럼       | 타입      | 설명      | 제약조건             |
| ---------- | --------- | --------- | -------------------- |
| id         | UUID      | 고유 ID   | PK                   |
| post_id    | UUID      | 게시글    | FK → posts, NOT NULL |
| user_id    | UUID      | 작성자    | FK → users, NOT NULL |
| content    | TEXT      | 댓글 내용 | NOT NULL             |
| created_at | TIMESTAMP | 생성일    | DEFAULT NOW()        |
| updated_at | TIMESTAMP | 수정일    |                      |

---

### likes

게시글 좋아요

| 컬럼       | 타입      | 설명    | 제약조건             |
| ---------- | --------- | ------- | -------------------- |
| id         | UUID      | 고유 ID | PK                   |
| post_id    | UUID      | 게시글  | FK → posts, NOT NULL |
| user_id    | UUID      | 사용자  | FK → users, NOT NULL |
| created_at | TIMESTAMP | 생성일  | DEFAULT NOW()        |

**제약조건**: UNIQUE(post_id, user_id) - 중복 좋아요 방지

---

### notifications

푸시 알림 기록

| 컬럼       | 타입         | 설명                                    | 제약조건             |
| ---------- | ------------ | --------------------------------------- | -------------------- |
| id         | UUID         | 고유 ID                                 | PK                   |
| user_id    | UUID         | 수신자                                  | FK → users, NOT NULL |
| type       | ENUM         | expiry_warning/duplicate_item/community | NOT NULL             |
| title      | VARCHAR(200) | 알림 제목                               | NOT NULL             |
| message    | TEXT         | 알림 내용                               |                      |
| data       | JSONB        | 추가 데이터 (링크 등)                   |                      |
| is_read    | BOOLEAN      | 읽음 여부                               | DEFAULT false        |
| created_at | TIMESTAMP    | 생성일                                  | DEFAULT NOW()        |

---

## 인덱스

```sql
-- 사용자 조회
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider ON users(provider, provider_id);

-- 식재료 조회
CREATE INDEX idx_ingredients_user_id ON ingredients(user_id);
CREATE INDEX idx_ingredients_status ON ingredients(status);
CREATE INDEX idx_ingredients_expiry_date ON ingredients(expiry_date);
CREATE INDEX idx_ingredients_user_status ON ingredients(user_id, status);

-- 마스터 데이터 검색
CREATE INDEX idx_ingredient_masters_name ON ingredient_masters(name);
CREATE INDEX idx_ingredient_masters_category ON ingredient_masters(category);

-- 레시피 검색
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);

-- 게시글 조회
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- 댓글 조회
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- 좋아요 조회
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE UNIQUE INDEX idx_likes_unique ON likes(post_id, user_id);

-- 알림 조회
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
```

---

## 마이그레이션 히스토리

| 버전 |    날짜    | 설명                                                  | 작성자 |
| :--: | :--------: | ----------------------------------------------------- | :----: |
| 001  | 2026-01-26 | 초기 테이블 생성 (users, ingredients, recipes, posts) |   AI   |
| 002  |            | 식약처 마스터 데이터 import                           |        |
| 003  |            | 알림 테이블 추가                                      |        |

---

## 주의사항 / 메모

- **소비기한 계산**: `purchase_date + ingredient_masters.shelf_life_days` 로 자동 계산
- **이미지 저장**: 이미지는 Cloudinary 또는 S3에 업로드하고 URL만 저장
- **JSONB 필드**: recipes.ingredients, recipes.instructions 는 Prisma의 Json 타입 사용
- **소프트 딜리트**: 실제 데이터 삭제보다 status 변경 권장 (ingredients.status)

---

_최종 업데이트: 2026-01-26_
