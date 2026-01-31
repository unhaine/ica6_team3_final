# 수정 내역

## 📅 2026-01-31

### 수정한 파일 (1개)

---

#### 1. `app/api/vision/analyze/gemini-flash/route.ts`

**수정 내용:** Gemini API 모델 버전 업그레이드

- `gemini-1.5-flash` (v1) → `gemini-2.0-flash` (v1) (지난 작업에서 수행)

#### 2. `app/test/camera/page.tsx` (신규)

**수정 내용:** 통합 카메라 서비스 페이지 구현

- 사진 촬영/업로드, AI 객체 탐지(바운딩 박스), 결과 확인 및 수정 기능을 하나의 흐름으로 통합
- `framer-motion`을 활용한 단계별 전환 애니메이션 적용
- 분석 완료 후 `/test/fridge`로 리다이렉션 로직 추가

**이유:**

- 사용자가 냉장고 상태를 스캔하고 식재료를 등록하는 핵심 사용자 경험(UX)을 테스트하기 위함
- UI 구조 설계서(05_UI_STRUCTURE.md)의 명세 반영

---

## 📅 2026-01-28

### 수정한 파일 (6개)

---

#### 1. `app/api/vision/analyze/gemini-flash/route.ts`

**수정 내용:** Gemini API 모델 버전 변경

- `gemini-2.0-flash-exp` (v1beta) → `gemini-1.5-flash` (v1)

**이유:**

- Gemini 2.0 실험 버전이 더 이상 지원되지 않아 500 에러 발생
- 안정 버전으로 변경하여 정상 작동 확인

---

#### 2. `lib/auth.ts`

**수정 내용:** Prisma Adapter 비활성화

- `adapter: PrismaAdapter(prisma)` 주석 처리
- JWT 전략만 사용

**이유:**

- Prisma Adapter + JWT 전략 충돌로 Google 로그인 시 500 에러 발생
- JWT만 사용하도록 변경하여 로그인 정상화
- ⚠️ **참고**: 현재 사용자 정보가 DB에 저장되지 않음 (JWT에만 저장)

---

#### 3. `app/test/page.tsx`

**수정 내용:** 테마 아이콘 Hydration 에러 수정

- 테마 아이콘을 `mounted` 상태 확인 후 렌더링

**이유:**

- 서버/클라이언트 렌더링 결과 불일치로 Hydration 에러 발생
- 초기 렌더링 시 고정 아이콘(Sun) 표시 후, 마운트 후 실제 테마 아이콘 표시

---

#### 4. `next.config.ts`

**수정 내용:** Google 프로필 이미지 도메인 추가

- `lh3.googleusercontent.com` 허용

**이유:**

- Google 로그인 후 프로필 이미지가 Next.js Image 보안 정책에 의해 차단됨
- 해당 도메인을 허용하여 이미지 정상 표시

---

## ✅ 해결된 이슈

1. ✅ Gemini API "model not found" 에러
2. ✅ Google 로그인 500 에러 (AdapterError)
3. ✅ Hydration mismatch 에러
4. ✅ Google 프로필 이미지 표시 안 됨

---

## 🚀 현재 상태

- Google 로그인 정상 작동
- 냉장고 이미지 분석 정상 작동 (Gemini 1.5 Flash)
- 테스트 페이지 에러 없음

---

---

#### 5. `lib/auth.ts` (재수정)

**수정 내용:** Prisma Adapter 다시 활성화

- 주석 처리했던 `adapter: PrismaAdapter(prisma)` 활성화
- `session: { strategy: "jwt" }` 주석 처리

**이유:**

- 사용자 정보를 DB에 저장하기 위함
- Google 로그인 시 User + Account 테이블에 저장
- 이메일 회원가입 시 User 테이블에 저장

---

#### 6. `prisma.config.ts`

**수정 내용:** dotenv import 추가

- `import "dotenv/config"` 추가

**이유:**

- Prisma migrate 실행 시 DATABASE_URL 환경 변수 인식 안 되는 문제 해결

---

## 🗄️ 데이터베이스

**테이블 동기화 완료:**

- `prisma db push` 실행
- `prisma generate` 실행
- 총 9개 테이블 생성/업데이트

**테이블 목록:**

1. User (사용자)
2. Account (OAuth 계정)
3. Session (세션)
4. VerificationToken (인증 토큰)
5. GroceryItem (식료품)
6. ReceiptScan (영수증)
7. FridgePhotoAnalysis (냉장고 분석)
8. Recipe (레시피 - 208,183개)
9. FavoriteRecipe (즐겨찾기)

---

## ⚠️ 알아둘 점

**NextAuth 테이블 구조:**

- **User 테이블**: 모든 사용자 기본 정보 (이메일 회원가입 + OAuth)
- **Account 테이블**: OAuth 로그인 정보만 (Google, Naver, Kakao)
- **이메일 회원가입**: User 테이블에만 저장됨 (표준 방식)

**Prisma Adapter 활성화:**

- ✅ Google 로그인 시 User + Account + Session에 저장
- ✅ 이메일 회원가입 시 User에만 저장
- ✅ Database session strategy 사용 (JWT 대신)
