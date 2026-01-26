# 냉파 고수 (가칭)

> AI 기반 냉장고 관리 및 레시피 추천 서비스

## 이 프로젝트는?

이 서비스는 냉장고나 영수증 사진을 분석하여 식재료를 자동으로 등록하고 관리해주는 AI 기반 서비스입니다. 소비기한 자동 알림과 보유 재료를 활용한 맞춤형 레시피 추천을 통해 식재료 낭비를 줄이고 합리적인 소비를 돕습니다.

## 목표

- [ ] **Scan & Manage**: 사진 한 장으로 끝나는 스마트한 재료 관리
- [ ] **Trustworthy Data**: 사용자 교정을 통한 데이터 정확도 99% 확보
- [ ] **Seamless Action**: 추천-구매-조리-공유로 이어지는 끊김 없는 사용자 경험 제공

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|----------|
| Frontend | Next.js | 빠른 렌더링, SEO 최적화, 최신 React 기능 활용 |
| Backend | Supabase | 인증, DB, 실시간 기능을 통합 제공하여 빠른 개발 가능 |
| Database | PostgreSQL | Supabase 내장 DB, 강력한 관계형 데이터 관리 |
| AI/Vision | Google Vision API, Gemini 1.5 Pro | 이미지 내 식재료 인식 및 추출, 자연어 처리 |
| External API | YouTube API, 공공데이터 API | 레시피 영상 연동 및 소비기한 데이터 매칭 |

## 문서 목록

| 문서 | 설명 | 상태 |
|------|------|:----:|
| [01_SERVICE_OVERVIEW](./01_SERVICE_OVERVIEW.md) | 서비스 개요 | ⏳ |
| [02_FEATURES](./02_FEATURES.md) | 기능 명세 | ⏳ |
| [03_DATABASE](./03_DATABASE.md) | DB 구조 | ⏳ |
| [04_API](./04_API.md) | API 설계 | ⏳ |
| [05_UI_STRUCTURE](./05_UI_STRUCTURE.md) | UI 구조 | ⏳ |
| [99_DECISIONS](./99_DECISIONS.md) | 기술 결정 | ⏳ |

## 시작하려면

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 프로젝트 현황

- 📊 진행 상황: [PROGRESS.md](../PROGRESS.md)
- 📝 세션 기록: [SESSION_LOG.md](../SESSION_LOG.md)
- ✅ 할 일: [TODO.md](../TODO.md)

---

*최종 업데이트: 2026-01-26*
