# 데이터베이스 구조

## 개요

- **DBMS**: (PostgreSQL / MySQL / MongoDB / Supabase 등)
- **ORM**: (Prisma / Drizzle / TypeORM 등)

## ERD (Entity Relationship Diagram)

<!-- 
AI 가이드: 아래는 예시입니다. 실제 프로젝트의 ERD로 교체하세요. 
-->
```
[User] 1 ──── N [Post]
   │              │
   │              N
   │              │
   └── N [Comment] ──── 1 [Post]
```

<!-- 복잡한 경우 ERD 툴 사용 권장: dbdiagram.io, draw.io 등 -->

---

## 테이블 정의

<!-- 
AI 가이드: 아래는 예시입니다. 실제 프로젝트의 스키마로 교체하세요. 
-->

### users

사용자 정보

| 컬럼 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | UUID | 고유 ID | PK |
| email | VARCHAR(255) | 이메일 | UNIQUE, NOT NULL |
| password | VARCHAR(255) | 비밀번호 (해시) | NOT NULL |
| name | VARCHAR(100) | 이름 | NOT NULL |
| avatar_url | TEXT | 프로필 이미지 | |
| role | ENUM | user/admin | DEFAULT 'user' |
| created_at | TIMESTAMP | 생성일 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 수정일 | |

---

### posts

게시글

| 컬럼 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | UUID | 고유 ID | PK |
| user_id | UUID | 작성자 | FK → users, NOT NULL |
| title | VARCHAR(200) | 제목 | NOT NULL |
| content | TEXT | 내용 | |
| status | ENUM | draft/published | DEFAULT 'draft' |
| view_count | INT | 조회수 | DEFAULT 0 |
| created_at | TIMESTAMP | 생성일 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 수정일 | |

---

### comments

댓글

| 컬럼 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | UUID | 고유 ID | PK |
| post_id | UUID | 게시글 | FK → posts, NOT NULL |
| user_id | UUID | 작성자 | FK → users, NOT NULL |
| content | TEXT | 내용 | NOT NULL |
| created_at | TIMESTAMP | 생성일 | DEFAULT NOW() |

---

## 인덱스

```sql
-- 자주 조회되는 컬럼에 인덱스 추가
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

---

## 마이그레이션 히스토리

| 버전 | 날짜 | 설명 | 작성자 |
|:----:|:----:|------|:------:|
| 001 | | 초기 테이블 생성 | |
| 002 | | | |

---

## 주의사항 / 메모

<!-- DB 관련 특이사항, 성능 고려사항 등 -->

---

*최종 업데이트: YYYY-MM-DD*
