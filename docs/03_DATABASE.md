# 데이터베이스 구조

## 개요

- **DBMS**: Supabase (PostgreSQL)
- **ORM**: Prisma 또는 Supabase Client SDK
- **선택 이유**: 실시간 동기화, 간편한 인증, 무료 티어 제공

## ERD (Entity Relationship Diagram)

```
[users] 1 ──── N [refrigerators]
                      │
                      1
                      │
                      N
                      │
               [scan_sessions] 1 ──── N [detected_items]
                                            │
                                            N
                                            │
                                     [grocery_items] N ──── 1 [refrigerators]
```

**관계 설명**:

- 한 사용자(User)는 여러 냉장고(Refrigerator)를 가질 수 있음
- 한 냉장고는 여러 스캔 세션(ScanSession)을 가질 수 있음
- 한 스캔 세션은 여러 탐지된 아이템(DetectedItem)을 가질 수 있음
- 최종 확정된 아이템은 GroceryItem으로 저장됨

---

## 테이블 정의

### users

사용자 정보 (MVP에서는 선택적 - 비로그인 사용 가능)

| 컬럼       | 타입         | 설명          | 제약조건         |
| ---------- | ------------ | ------------- | ---------------- |
| id         | UUID         | 고유 ID       | PK               |
| email      | VARCHAR(255) | 이메일        | UNIQUE, NOT NULL |
| name       | VARCHAR(100) | 이름          | NOT NULL         |
| avatar_url | TEXT         | 프로필 이미지 |                  |
| created_at | TIMESTAMP    | 생성일        | DEFAULT NOW()    |
| updated_at | TIMESTAMP    | 수정일        |                  |

---

### refrigerators

냉장고 정보

| 컬럼       | 타입         | 설명        | 제약조건              |
| ---------- | ------------ | ----------- | --------------------- |
| id         | UUID         | 고유 ID     | PK                    |
| user_id    | UUID         | 소유자      | FK → users, NULL 허용 |
| name       | VARCHAR(100) | 냉장고 이름 | DEFAULT '내 냉장고'   |
| created_at | TIMESTAMP    | 생성일      | DEFAULT NOW()         |
| updated_at | TIMESTAMP    | 수정일      |                       |

---

### scan_sessions

스캔 세션 (사진 업로드 및 인식 기록)

| 컬럼            | 타입      | 설명                          | 제약조건                     |
| --------------- | --------- | ----------------------------- | ---------------------------- |
| id              | UUID      | 고유 ID                       | PK                           |
| refrigerator_id | UUID      | 냉장고                        | FK → refrigerators, NOT NULL |
| image_url       | TEXT      | 업로드된 이미지 URL           | NOT NULL                     |
| status          | ENUM      | pending/processing/done/error | DEFAULT 'pending'            |
| created_at      | TIMESTAMP | 생성일                        | DEFAULT NOW()                |

---

### detected_items

Vision API 탐지 결과 (수정 전 원본)

| 컬럼            | 타입         | 설명                 | 제약조건                     |
| --------------- | ------------ | -------------------- | ---------------------------- |
| id              | UUID         | 고유 ID              | PK                           |
| scan_session_id | UUID         | 스캔 세션            | FK → scan_sessions, NOT NULL |
| label           | VARCHAR(100) | 품목명 (원본)        | NOT NULL                     |
| label_kr        | VARCHAR(100) | 품목명 (한글)        |                              |
| confidence      | FLOAT        | 신뢰도 (0~1)         | NOT NULL                     |
| bbox_x          | FLOAT        | 박스 X 좌표 (정규화) | NOT NULL                     |
| bbox_y          | FLOAT        | 박스 Y 좌표 (정규화) | NOT NULL                     |
| bbox_width      | FLOAT        | 박스 너비 (정규화)   | NOT NULL                     |
| bbox_height     | FLOAT        | 박스 높이 (정규화)   | NOT NULL                     |
| is_confirmed    | BOOLEAN      | 사용자 확정 여부     | DEFAULT FALSE                |
| created_at      | TIMESTAMP    | 생성일               | DEFAULT NOW()                |

---

### grocery_items

확정된 식료품 목록

| 컬럼            | 타입         | 설명           | 제약조건                     |
| --------------- | ------------ | -------------- | ---------------------------- |
| id              | UUID         | 고유 ID        | PK                           |
| refrigerator_id | UUID         | 냉장고         | FK → refrigerators, NOT NULL |
| name            | VARCHAR(100) | 품목명         | NOT NULL                     |
| quantity        | INT          | 수량           | DEFAULT 1                    |
| category        | VARCHAR(50)  | 카테고리       |                              |
| expiry_date     | DATE         | 유통기한       | (Phase 2)                    |
| image_url       | TEXT         | 식료품 이미지  |                              |
| source_session  | UUID         | 출처 스캔 세션 | FK → scan_sessions           |
| created_at      | TIMESTAMP    | 생성일         | DEFAULT NOW()                |
| updated_at      | TIMESTAMP    | 수정일         |                              |

---

## 인덱스

```sql
-- 스캔 세션 조회 최적화
CREATE INDEX idx_scan_sessions_refrigerator ON scan_sessions(refrigerator_id);
CREATE INDEX idx_scan_sessions_created ON scan_sessions(created_at DESC);

-- 탐지 아이템 조회 최적화
CREATE INDEX idx_detected_items_session ON detected_items(scan_session_id);

-- 식료품 조회 최적화
CREATE INDEX idx_grocery_items_refrigerator ON grocery_items(refrigerator_id);
CREATE INDEX idx_grocery_items_expiry ON grocery_items(expiry_date);
```

---

## 마이그레이션 히스토리

| 버전 |    날짜    | 설명                      | 작성자 |
| :--: | :--------: | ------------------------- | :----: |
| 001  | 2026-01-23 | 초기 테이블 생성          |   -    |
| 002  |            | (예정) 유통기한 알림 추가 |   -    |

---

## 주의사항 / 메모

- **MVP 단계**: `users` 테이블은 선택적. 비로그인 사용자는 로컬 스토리지 또는 익명 세션 사용
- **이미지 저장**: Supabase Storage 또는 Cloudinary 활용 권장
- **정규화된 좌표**: Bounding Box 좌표는 0~1 사이의 정규화된 값으로 저장하여 다양한 해상도에 대응
- **카테고리**: 향후 별도 `categories` 테이블로 분리 고려

---

_최종 업데이트: 2026-01-23_
