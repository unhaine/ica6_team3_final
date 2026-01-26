# RefrigerAI

> AI 기반 냉장고 관리 및 맞춤 레시피 추천 서비스

## 이 프로젝트는?

냉장고나 영수증 사진을 분석하여 식재료를 자동 등록하고, 소비기한 관리 및 맞춤형 레시피를 제안하는 서비스입니다. 특히 **AI 인식 오류를 사용자가 직접 교정하는 프로세스**를 통해 데이터의 신뢰도를 높이고, 부족한 재료는 즉시 구매로 연결합니다.

## 목표

- [x] 이미지/영수증 기반 식재료 자동 등록
- [ ] AI 분석 결과 사용자 교정 기능
- [ ] 식품의약품안전처 소비기한 데이터 연동
- [ ] AI 기반 맞춤 레시피 추천 (80% 매칭)
- [ ] 요리 커뮤니티 + AI 싱크로율 판단

## 기술 스택

| 영역      | 기술                    | 선택 이유                      |
| --------- | ----------------------- | ------------------------------ |
| Frontend  | Next.js 15 + TypeScript | App Router, 서버 컴포넌트 지원 |
| Backend   | Next.js API Routes      | 별도 서버 불필요, 풀스택       |
| Database  | PostgreSQL + Prisma     | 관계형 데이터 관리에 적합      |
| AI/Vision | Google Vision API       | 이미지 내 식재료 인식          |
| AI/LLM    | Gemini 1.5 Pro          | 레시피 추천 및 싱크로율 판단   |
| 배포      | Vercel                  | Next.js 최적화 배포            |

## 문서 목록

| 문서                                            | 설명        | 상태 |
| ----------------------------------------------- | ----------- | :--: |
| [01_SERVICE_OVERVIEW](./01_SERVICE_OVERVIEW.md) | 서비스 개요 |  ✅  |
| [02_FEATURES](./02_FEATURES.md)                 | 기능 명세   |  ✅  |
| [03_DATABASE](./03_DATABASE.md)                 | DB 구조     |  ✅  |
| [04_API](./04_API.md)                           | API 설계    |  ✅  |
| [05_UI_STRUCTURE](./05_UI_STRUCTURE.md)         | UI 구조     |  ✅  |
| [99_DECISIONS](./99_DECISIONS.md)               | 기술 결정   |  ✅  |

## 시작하려면

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local

# 개발 서버 실행
npm run dev
```

## 프로젝트 현황

- 📊 진행 상황: [PROGRESS.md](../PROGRESS.md)
- 📝 세션 기록: [SESSION_LOG.md](../SESSION_LOG.md)
- ✅ 할 일: [TODO.md](../TODO.md)

---

_최종 업데이트: 2026-01-26_
