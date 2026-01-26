# 🎸 바이브 코딩 룰북 (Vibe Coding Rulebook)

> **AI와 함께 프로젝트를 처음부터 끝까지 만드는 방법**

바이브 코딩은 AI 코딩 어시스턴트와 대화하며 개발하는 방식입니다.  
이 룰북은 **MVP 아이디어를 받았을 때 어떻게 시작하고 진행하는지** 단계별로 안내합니다.

---

## 🎯 바이브 코딩의 핵심

| 원칙 | 설명 |
|------|------|
| **문서가 살아있다** | 프로젝트 진행에 따라 md 파일이 계속 업데이트됨 |
| **대화는 끊겨도 맥락은 유지** | 문서를 보면 어디까지 했는지 바로 파악 |
| **AI가 레퍼런스로 활용** | 잘 정리된 문서는 AI의 이해도를 높임 |
| **작게 자주 기록** | 큰 변경보다 작은 업데이트를 자주 |

---

## 📁 프로젝트 문서 구조

프로젝트 시작 시 아래 문서들을 생성하고, **진행하면서 계속 업데이트**합니다.

```
my-project/
├── QUICK_START.md           # 🚀 5분 안에 시작하기
├── VIBE_CODING_RULEBOOK.md  # 📖 상세 가이드
├── GLOSSARY.md              # 📖 용어집
├── UPDATE_GUIDE.md          # 📋 문서 업데이트 가이드
├── PROGRESS.md              # 📊 진행 상황 (매일 업데이트)
├── SESSION_LOG.md           # 📝 세션별 작업 기록
├── TODO.md                  # ✅ 할 일 목록
│
├── changelog/               # 🔄 변경 이력 (날짜별)
│   ├── 2026-01-12.md        # 날짜별 변경 기록
│   └── v0.1.0.md            # 릴리즈 기록
│
├── docs/                    # 📚 프로젝트 설계 문서
│   ├── 00_START_HERE.md     # 시작점 - 이 프로젝트가 뭔지
│   ├── 01_SERVICE_OVERVIEW.md
│   ├── 02_FEATURES.md       
│   ├── 03_DATABASE.md       
│   ├── 04_API.md            
│   ├── 05_UI_STRUCTURE.md   
│   └── 99_DECISIONS.md      
│
└── src/                     # 💻 실제 코드
```

---

# 🚀 STEP 1: 프로젝트 시작하기

## 1.1 템플릿 복사 및 준비

제공된 `VIBE_CODING_TEMPLATES` 폴더를 프로젝트 루트로 복사합니다.
`QUICK_START.md`를 읽고 기본 설정을 마칩니다.

## 1.2 시작점 문서 채우기

### `docs/00_START_HERE.md`

이 문서는 AI에게 "우리 프로젝트가 무엇인지" 알려주는 가장 중요한 문서입니다.
플레이스홀더를 실제 내용으로 채워주세요.

```markdown
# 프로젝트명

> 한 줄로 프로젝트 설명

## 이 프로젝트는?

[프로젝트에 대한 간단한 설명. 2-3문장으로 작성]

## 목표

- [ ] 목표 1
- [ ] 목표 2
...
```

## 1.3 서비스 개요 작성

### `docs/01_SERVICE_OVERVIEW.md`

서비스의 타겟 사용자와 핵심 가치를 정의합니다.

```markdown
# 서비스 개요

## 서비스 소개
...
```- 목표 1
- 목표 2
- 목표 3

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | (예: Next.js, React) |
| Backend | (예: Node.js, Supabase) |
| Database | (예: PostgreSQL, MongoDB) |
| 배포 | (예: Vercel, AWS) |

## 문서 목록

| 문서 | 설명 | 상태 |
|------|------|:----:|
| [01_SERVICE_OVERVIEW](./01_SERVICE_OVERVIEW.md) | 서비스 개요 | ✅ |
| [02_FEATURES](./02_FEATURES.md) | 기능 명세 | 🔄 |
| [03_DATABASE](./03_DATABASE.md) | DB 구조 | ⏳ |
| [04_API](./04_API.md) | API 설계 | ⏳ |
| [05_UI_STRUCTURE](./05_UI_STRUCTURE.md) | UI 구조 | ⏳ |

## 시작하려면

1. `PROGRESS.md` 읽기
2. `TODO.md` 확인
3. 개발 서버 실행: `npm run dev`

---
*최종 업데이트: YYYY-MM-DD*
```

## 1.2 서비스 개요 작성

### `docs/01_SERVICE_OVERVIEW.md`

```markdown
# 서비스 개요

## 서비스 소개

[이 서비스가 무엇인지, 어떤 문제를 해결하는지 설명]

## 타겟 사용자

- 사용자 유형 1: [설명]
- 사용자 유형 2: [설명]

## 핵심 가치

1. **가치 1**: 설명
2. **가치 2**: 설명
3. **가치 3**: 설명

## 유사 서비스 / 레퍼런스

| 서비스 | 참고할 점 |
|--------|----------|
| 서비스A | 이 부분 참고 |
| 서비스B | 저 부분 참고 |

## 수익 모델 (해당시)

- 모델 1
- 모델 2

---
*최종 업데이트: YYYY-MM-DD*
```

---

# 🚀 STEP 2: 기능 정의하기

## 2.1 기능 명세 작성

### `docs/02_FEATURES.md`

```markdown
# 기능 명세

## MVP 기능 (필수)

### F1. [기능명]
- **설명**: 기능에 대한 설명
- **사용자 스토리**: ~하면 ~할 수 있다
- **우선순위**: 🔴 높음
- **상태**: ⏳ 예정 / 🔄 진행중 / ✅ 완료

### F2. [기능명]
- **설명**: ...
- **사용자 스토리**: ...
- **우선순위**: 🟡 중간
- **상태**: ⏳ 예정

### F3. [기능명]
...

---

## 추가 기능 (나중에)

### F10. [기능명]
- **설명**: ...
- **우선순위**: 🟢 낮음 (Phase 2)

---

## 기능 목록
<!-- 
AI 가이드: 
각 기능의 '상태' 필드(⏳, 🔄, ✅)를 최신으로 유지하세요.
별도의 진행 현황 테이블은 만들지 않습니다.
-->

### F1. [기능명]
- **설명**: ...
- **상태**: ⏳ 예정 / � 진행중 / ✅ 완료

...

---
*최종 업데이트: YYYY-MM-DD*
```

---

# 🚀 STEP 3: 데이터 설계하기

## 3.1 데이터베이스 구조

### `docs/03_DATABASE.md`

```markdown
# 데이터베이스 구조

## ERD (Entity Relationship Diagram)

```
[User] 1 ──── N [Post]
   │              │
   │              N
   │              │
   └── N [Comment] ──── 1 [Post]
```

## 테이블 정의

### users

| 컬럼 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | UUID | PK | PRIMARY KEY |
| email | VARCHAR(255) | 이메일 | UNIQUE, NOT NULL |
| name | VARCHAR(100) | 이름 | NOT NULL |
| created_at | TIMESTAMP | 생성일 | DEFAULT NOW() |
| updated_at | TIMESTAMP | 수정일 | |

### posts

| 컬럼 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | UUID | PK | PRIMARY KEY |
| user_id | UUID | FK → users | NOT NULL |
| title | VARCHAR(200) | 제목 | NOT NULL |
| content | TEXT | 내용 | |
| status | ENUM | draft/published | DEFAULT 'draft' |
| created_at | TIMESTAMP | 생성일 | DEFAULT NOW() |

### comments

...

---

## 인덱스

```sql
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_comments_post_id ON comments(post_id);
```

---

## 마이그레이션 히스토리

| 버전 | 날짜 | 설명 |
|:----:|:----:|------|
| 001 | 01-10 | 초기 테이블 생성 |
| 002 | 01-12 | posts에 status 컬럼 추가 |

---
*최종 업데이트: YYYY-MM-DD*
```

---

# 🚀 STEP 4: API 설계하기

### `docs/04_API.md`

```markdown
# API 설계

## Base URL

- 개발: `http://localhost:3000/api`
- 운영: `https://api.example.com`

## 인증

- 방식: Bearer Token (JWT)
- 헤더: `Authorization: Bearer {token}`

---

## 엔드포인트

### 인증 (Auth)

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
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

**Errors**
- `401`: 이메일 또는 비밀번호 불일치
- `400`: 필수 필드 누락

---

### 사용자 (Users)

#### GET /users/me
내 정보 조회

**Response** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "홍길동",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### PATCH /users/me
내 정보 수정
...

---

### 게시글 (Posts)

#### GET /posts
게시글 목록

**Query Parameters**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|:----:|------|
| page | number | ❌ | 페이지 (기본: 1) |
| limit | number | ❌ | 개수 (기본: 20) |
| status | string | ❌ | draft/published |

**Response** `200 OK`
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

#### POST /posts
게시글 생성
...

---

## API 구현 상태

| 메서드 | 엔드포인트 | 상태 |
|:------:|------------|:----:|
| POST | /auth/login | ✅ |
| POST | /auth/register | ✅ |
| GET | /users/me | ✅ |
| PATCH | /users/me | 🔄 |
| GET | /posts | ⏳ |
| POST | /posts | ⏳ |

---
*최종 업데이트: YYYY-MM-DD*
```

---

# 🚀 STEP 5: UI 구조 설계하기

### `docs/05_UI_STRUCTURE.md`

```markdown
# UI/화면 구조

## 페이지 목록

| 경로 | 페이지명 | 설명 | 인증 | 상태 |
|------|----------|------|:----:|:----:|
| `/` | 홈 | 랜딩 페이지 | ❌ | ✅ |
| `/login` | 로그인 | 로그인 폼 | ❌ | ✅ |
| `/signup` | 회원가입 | 가입 폼 | ❌ | 🔄 |
| `/dashboard` | 대시보드 | 메인 대시보드 | ✅ | ⏳ |
| `/posts` | 게시글 목록 | 전체 글 목록 | ✅ | ⏳ |
| `/posts/new` | 글 작성 | 새 글 작성 | ✅ | ⏳ |
| `/posts/[id]` | 글 상세 | 글 보기 | ❌ | ⏳ |
| `/settings` | 설정 | 사용자 설정 | ✅ | ⏳ |

---

## 레이아웃

### 공통 레이아웃
```
┌─────────────────────────────────────┐
│           Header (Nav)              │
├─────────────────────────────────────┤
│                                     │
│            Main Content             │
│                                     │
├─────────────────────────────────────┤
│              Footer                 │
└─────────────────────────────────────┘
```

### 대시보드 레이아웃
```
┌──────┬──────────────────────────────┐
│      │         Header               │
│  S   ├──────────────────────────────┤
│  i   │                              │
│  d   │        Main Content          │
│  e   │                              │
│  b   │                              │
│  a   │                              │
│  r   │                              │
└──────┴──────────────────────────────┘
```

---

## 컴포넌트 목록

### 공통
- [ ] Header
- [ ] Footer
- [ ] Sidebar
- [ ] Button
- [ ] Input
- [ ] Card
- [ ] Modal

### 페이지별
- [ ] LoginForm
- [ ] SignupForm
- [ ] PostCard
- [ ] PostEditor
- [ ] DashboardStats

---

## 디자인 레퍼런스

- [Figma 링크] (있다면)
- [참고 사이트 1]
- [참고 사이트 2]

---
*최종 업데이트: YYYY-MM-DD*
```

---

# 📊 STEP 6: 진행 상황 관리

## 6.1 PROGRESS.md (핵심!)

**매일 혹은 세션마다 업데이트하는 가장 중요한 문서**

### `PROGRESS.md`

```markdown
# 📊 프로젝트 진행 상황

## 현재 상태

| 항목 | 내용 |
|------|------|
| **현재 단계** | Phase 1: MVP 개발 |
| **진행률** | ████████░░ 80% |
| **현재 작업** | 대시보드 페이지 구현 |
| **막힌 부분** | 없음 |
| **다음 작업** | 게시글 CRUD |

---

## 타임라인

### Phase 1: MVP (1/10 ~ 1/20)
- [x] 환경 설정 (1/10)
- [x] DB 설계 (1/11)
- [x] 인증 구현 (1/12~13)
- [x] 기본 UI (1/14~15)
- [ ] 대시보드 ← **현재**
- [ ] 게시글 CRUD
- [ ] 테스트 & 버그 수정

### Phase 2: 개선 (1/21 ~ )
- [ ] 알림 기능
- [ ] 검색 기능
- [ ] 성능 최적화

---

## 완료된 작업

### 2026-01-15
- ✅ Header/Footer 컴포넌트 완성
- ✅ 로그인/회원가입 페이지 완성
- ✅ 사용자 인증 연동

### 2026-01-14
- ✅ 기본 레이아웃 구현
- ✅ 라우팅 설정
- ✅ Supabase 연결

### 2026-01-12~13
- ✅ Supabase 프로젝트 생성
- ✅ 사용자 테이블 생성
- ✅ 인증 API 구현

---

## 알려진 이슈

| # | 이슈 | 심각도 | 상태 |
|:-:|------|:------:|:----:|
| 1 | 모바일 메뉴 안 닫힘 | 🟡 | 대기 |
| 2 | 이미지 업로드 느림 | 🟢 | 대기 |

---

## 기술 부채

- [ ] 에러 처리 통일 필요
## 📝 일일 작업 요약

> 상세 기록은 [SESSION_LOG.md](./SESSION_LOG.md)에 작성합니다.

| 날짜 | 주요 완료 항목 | 상세 |
|:----:|---------------|:----:|
| 2026-01-15 | 로그인 기능 구현, 대시보드 UI | SESSION_LOG 참고 |
| 2026-01-14 | DB 설계, API 구조 설계 | SESSION_LOG 참고 |

## 📊 문서 변경 추적
```

## 6.2 SESSION_LOG.md

세션별 상세 기록을 남깁니다.

### `SESSION_LOG.md`

```markdown
# 📝 세션 로그

> 세션별 작업 기록입니다. **새 세션은 맨 위에 추가**합니다.
> *내용이 너무 길어지면 `logs/SESSION_LOG_YYYY_QX.md`로 옮기고 비워주세요.*

---

<!-- 
AI 가이드: 
새 세션을 시작할 때 아래 템플릿을 맨 위에 추가하고 작성하세요.
-->

## 2026-01-15 오후 세션

### 목표
- 대시보드 페이지 완성

### 완료 ✅
- 대시보드 레이아웃 구현
- 통계 카드 컴포넌트 생성
- 차트 라이브러리 연동 (recharts)

### 미완료 ❌
- 실시간 데이터 연동 (다음에)

### 이슈 🐛
- recharts SSR 문제 → dynamic import로 해결

### 배운 것 📚
- Next.js에서 클라이언트 전용 라이브러리는 dynamic import 사용

### 다음 할 일 📌
1. API 연동해서 실제 데이터 표시
2. 게시글 목록 페이지 시작

---

## 2026-01-15 오전 세션

### 목표
- 인증 버그 수정
- 대시보드 시작

### 완료 ✅
- 로그인 후 리다이렉트 버그 수정
- 세션 만료 처리 추가

### 미완료 ❌
- (없음)

### 다음 할 일 📌
1. 대시보드 레이아웃

---

## 2026-01-14 세션
...
```

## 6.3 TODO.md

### `TODO.md`

```markdown
# ✅ TODO

## 🔴 긴급 (오늘)

- [ ] 대시보드 API 연동
- [ ] 로딩 스피너 추가

## 🟡 이번 주

- [ ] 게시글 목록 페이지
- [ ] 게시글 작성 페이지
- [ ] 게시글 상세 페이지
- [ ] 이미지 업로드

## 🟢 나중에

- [ ] 다크모드
- [ ] 알림 기능
- [ ] 검색 기능
- [ ] 소셜 로그인

## ✅ 완료

<!-- 
완료된 항목은 이곳으로 이동합니다.
너무 쌓이면 changelog/에 기록되었는지 확인 후 삭제하거나
ARCHIVE.md로 이동하세요.
-->

### 2026-01
- [x] 프로젝트 초기 설정 (01/10)
- [x] DB 스키마 설계 (01/11)

---
*최종 업데이트: 2026-01-15*
```

---

# 🔄 STEP 7: 일일 워크플로우

## AI와 세션 시작할 때

```
"PROGRESS.md와 SESSION_LOG.md를 읽고, 
현재 상황을 파악한 후 [오늘 할 일]을 진행해줘"
```

또는 더 구체적으로:

```
"PROGRESS.md 확인했더니 현재 대시보드 작업 중이야.
TODO.md에서 '대시보드 API 연동'을 진행해줘.
관련 API는 docs/04_API.md 참고해."
```

## 세션 중간에

작업이 완료될 때마다:

```
"TODO.md에서 [완료한 것] 체크하고,
PROGRESS.md 완료된 작업에 추가해줘"
```

## 세션 끝날 때

```
"오늘 세션 정리해줘:
1. SESSION_LOG.md에 오늘 기록 추가
2. PROGRESS.md 현재 상태 업데이트
3. TODO.md 정리"
```

---

# 📌 문서 업데이트 규칙

## 언제 어떤 문서를 업데이트하나?

| 상황 | 업데이트할 문서 |
|------|----------------|
| 기능 완료 | `PROGRESS.md`, `TODO.md`, `02_FEATURES.md` |
| DB 변경 | `03_DATABASE.md` |
| API 추가/변경 | `04_API.md` |
| 새 페이지 추가 | `05_UI_STRUCTURE.md` |
| 세션 끝 | `SESSION_LOG.md`, `PROGRESS.md` |
| 기술 결정 | `99_DECISIONS.md` |
| 이슈 발견 | `PROGRESS.md`의 알려진 이슈 |

## 문서 상태 표시

```
✅ 완료
🔄 진행중  
⏳ 예정 (아직 안 함)
❌ 취소/보류
🔴 긴급/높음
🟡 보통
🟢 낮음
```

---

# 💡 바이브 코딩 팁

## 1. 작게 자주 기록하기

```markdown
# Bad ❌ - 하루 끝에 한 번에 기록
"오늘 로그인, 회원가입, 대시보드 다 했음"

# Good ✅ - 작업마다 바로 기록
"14:30 - 로그인 폼 완성"
"15:45 - 회원가입 API 연동 완료"
"17:00 - 대시보드 레이아웃 시작"
```

## 2. 막힌 부분 명확히 기록

```markdown
# Bad ❌
"안 됨"

# Good ✅
"Supabase에서 이미지 업로드 시 413 에러 발생.
파일 크기 제한 때문인 것 같음. 
시도한 것: 클라이언트 압축 → 여전히 실패
다음 시도: Storage 정책 확인 필요"
```

## 3. AI에게 맥락 제공하기

```markdown
# Bad ❌
"로그인 만들어줘"

# Good ✅
"로그인 페이지 만들어줘.
- 기술스택: docs/00_START_HERE.md 참고
- API: docs/04_API.md의 POST /auth/login
- UI: docs/05_UI_STRUCTURE.md의 /login 페이지
- 이메일, 비밀번호 필드와 제출 버튼 필요"
```

## 4. 결정사항 기록하기

### `docs/99_DECISIONS.md`

```markdown
# 기술 결정 기록

## D001. 상태관리 라이브러리 선택

- **날짜**: 2026-01-10
- **결정**: Zustand 사용
- **대안**: Redux, Jotai, Context API
- **이유**: 
  - 보일러플레이트 적음
  - 번들 크기 작음
  - TypeScript 지원 좋음
- **참고**: https://zustand.docs.pmnd.rs/

## D002. 인증 방식

- **날짜**: 2026-01-11
- **결정**: Supabase Auth 사용
- **이유**: 
  - 이미 Supabase DB 사용 중
  - 소셜 로그인 쉽게 추가 가능
  - 무료 플랜으로 충분
```

---

# 🚀 빠른 시작 체크리스트

새 프로젝트 시작할 때:

1. **템플릿 복사**: `VIBE_CODING_TEMPLATES` 폴더를 프로젝트로 복사
2. **시작 가이드**: [`QUICK_START.md`](./QUICK_START.md) 필독
3. **문서 채우기**: `docs/00_START_HERE.md`부터 작성
4. **개발 시작**: `PROGRESS.md`에 로그 남기며 진행

---

> **Tip**: 모든 문서를 완벽하게 채울 필요는 없습니다.  
> 최소한 `00_START_HERE.md`와 `PROGRESS.md`만 있어도 AI가 충분히 맥락을 파악할 수 있습니다.
> 필요할 때마다 문서를 조금씩 업데이트하며 진행하세요. ("Living Documents")

---

*Made with 🎸 바이브*


---

# 📋 요약

1. **문서 먼저** - 코드 전에 설계 문서 작성
2. **번호 체계** - 00, 01, 02... 순서대로
3. **매일 업데이트** - PROGRESS.md, SESSION_LOG.md
4. **AI에게 맥락 제공** - 관련 문서 알려주기
5. **작게 자주** - 큰 변경보다 작은 기록을 자주

**살아있는 문서 = 프로젝트의 현재 상태를 항상 반영**

---

*이 룰북으로 첫 바이브 코딩을 시작해보세요!*  
*프로젝트를 진행하면서 자신만의 스타일로 발전시켜 나가면 됩니다.*

*최종 업데이트: 2026-01-12*
