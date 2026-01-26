# 🔄 문서 업데이트 가이드

> 언제 어떤 문서를 어떻게 업데이트하는지 안내합니다.

---

## 📋 문서 업데이트 타이밍

| 이벤트 | 업데이트할 문서 | 업데이트 내용 |
|--------|----------------|---------------|
| **세션 시작** | `PROGRESS.md` | 오늘 날짜, 목표 확인 |
| **세션 종료** | `PROGRESS.md`, `SESSION_LOG.md` | 완료 항목, 다음 할 일 |
| **기능 완료** | `02_FEATURES.md`, `PROGRESS.md`, `changelog/` | 상태 ✅ 변경, Added 기록 |
| **DB 변경** | `03_DATABASE.md`, `changelog/` | 테이블/컬럼 추가, Changed |
| **API 추가** | `04_API.md`, `changelog/` | 엔드포인트 추가, Added |
| **UI 추가** | `05_UI_STRUCTURE.md`, `changelog/` | 페이지/컴포넌트 추가 |
| **버그 수정** | `PROGRESS.md` (이슈), `changelog/` | 이슈 해결, Fixed |
| **기술 결정** | `99_DECISIONS.md` | 새 결정 기록 |
| **버전 릴리즈** | `changelog/`, `00_START_HERE.md` | 버전 태그, 출시 내역 |

---

## 📝 업데이트 체크리스트

### 매 세션마다

```markdown
□ PROGRESS.md
  □ 일일 작업 기록에 오늘 날짜 섹션 추가
  □ 완료 항목 기록
  □ 변경된 문서 목록 작성
  □ 변경된 코드 목록 작성
  □ 진행률 업데이트
  □ 마지막 업데이트 시간 수정

□ SESSION_LOG.md
  □ 새 세션 기록 추가 (맨 위에)
  □ 목표, 완료, 미완료, 다음 할 일 작성

□ TODO.md (필요시)
  □ 완료 항목 → 완료 섹션으로 이동
  □ 새로운 할 일 추가
```

### 기능 완료 시

```markdown
□ docs/02_FEATURES.md
  □ 해당 기능 상태 → ✅ 완료
  □ 완료일 기록

□ changelog/ (해당 날짜 파일)
  □ Added에 기능 추가

□ PROGRESS.md
  □ 타임라인 완료 표시
  □ 진행률 업데이트
```

### DB 스키마 변경 시

```markdown
□ docs/03_DATABASE.md
  □ 테이블 정의 수정/추가
  □ ERD 업데이트
  □ 마이그레이션 히스토리에 기록

□ changelog/ (해당 날짜 파일)
  □ Changed 또는 Added에 기록
```

### API 변경 시

```markdown
□ docs/04_API.md
  □ 엔드포인트 추가/수정
  □ 구현 상태 업데이트

□ changelog/ (해당 날짜 파일)
  □ Added 또는 Changed에 기록
```

---

## 💡 팁

### 1. 작업 전에 기록할 준비하기

```markdown
# PROGRESS.md 미리 열어두기

## 📝 일일 작업 요약

| 날짜 | 주요 완료 항목 | 상세 |
|:----:|---------------|:----:|
| YYYY-MM-DD | (오늘 할 작업 미리 적어두기) | SESSION_LOG 참고 |
```

### 2. 커밋할 때 같이 업데이트

```bash
# 코드 변경 후
git add .
git commit -m "feat: 로그인 기능 구현"

# 문서도 같이 업데이트 후 커밋
# (PROGRESS.md, changelog/ 등)
git add .
git commit -m "docs: 진행상황 업데이트"
```

### 3. AI에게 문서 업데이트 요청

```
"방금 로그인 API를 구현했어.
다음 문서들을 업데이트해줘:
- docs/04_API.md에 POST /auth/login 상태를 ✅로
- changelog/에 추가"

### 4. 세션 끝날 때 일괄 업데이트

```
"오늘 세션 정리해줘:
1. SESSION_LOG.md에 오늘 기록 추가
2. PROGRESS.md 업데이트
3. changelog/ 정리
4. TODO.md에서 완료 항목 이동"
```

---

## ⚡️ Git 충돌이 난다면?

AI와 동시에 문서를 수정하다 충돌이 날 수 있습니다.

1. **PROGRESS.md**: 대시보드이므로 가장 최신 상태로 덮어쓰거나 수동 병합하세요.
2. **SESSION_LOG.md**: 서로 다른 세션이라면 순서 상관없이 둘 다 남기세요.
3. **changelog/**: 날짜별 파일이므로 충돌 확률이 적지만, 같은 날짜라면 병합하세요.

---

## 📄 문서별 상세 가이드

### PROGRESS.md

**핵심 역할**: 프로젝트의 "현재 상태"를 한눈에 파악

**일일 작업 기록 예시**:
```markdown
## 📝 일일 작업 요약

> 상세 기록은 SESSION_LOG.md에 작성합니다.

| 날짜 | 주요 완료 항목 | 상세 |
|:----:|---------------|:----:|
| 2026-01-15 | 로그인 기능 구현, 대시보드 UI | SESSION_LOG 참고 |
```

### changelog/YYYY-MM-DD.md

**핵심 역할**: 변경 시마다 이력 기록

**예시**:
```markdown
## Added
- 로그인 기능 (POST /auth/login)
- 로그인 페이지 UI
- JWT 토큰 기반 인증

## Fixed
- 버튼 클릭 시 더블 클릭 방지
```

### SESSION_LOG.md

**핵심 역할**: 세션별 상세 기록 (삽질, 배운 것 포함)

**예시**:
```markdown
## 2026-01-15 오후 세션

### 🎯 목표
- 로그인 API 완성
- 로그인 페이지 UI

### ✅ 완료
- JWT 토큰 발급 구현
- 로그인 폼 UI
- 에러 메시지 표시

### 🐛 이슈 / 버그
- bcrypt가 Edge Runtime에서 안 됨 → bcryptjs로 교체

### 💡 배운 것
- Next.js App Router에서 Edge Runtime 제한 주의
- bcrypt 대신 bcryptjs 사용

### 📌 다음 할 일
1. 회원가입 API
2. 세션 만료 처리
```

---

## 🔄 주기별 업데이트 요약

| 주기 | 문서 | 내용 |
|:----:|------|------|
| **실시간** | `PROGRESS.md` | 완료 항목, 변경 파일 |
| **세션 종료** | `SESSION_LOG.md` | 세션 기록 |
| **기능 완료** | `changelog/`, 해당 설계 문서 | 변경 이력, 상태 업데이트 |
| **주간** | `PROGRESS.md` | 주간 진행 현황 정리 |
| **릴리즈** | `changelog/vX.X.X.md` | 버전 태그, 날짜 확정 |

---

*최종 업데이트: 2026-01-12*
