# 기술 의사결정 (Technical Decisions)

## 1. Frontend Framework: Next.js
- **결정**: Next.js (App Router)
- **이유**:
    - **SEO**: 레시피 정보 및 커뮤니티 콘텐츠의 검색 엔진 노출이 중요함.
    - **Vercel 배포 용이성**: 빠른 배포 및 관리.
    - **Server Components**: API 키(Vision API 등)를 서버단에서 안전하게 숨기고 관리하기 용이함.

## 2. Backend & Database: Supabase
- **결정**: Supabase (BaaS)
- **이유**:
    - **개발 속도**: 인증(Auth), DB, API를 한 번에 구축하여 개발 기간 단축 (MVP 개발에 최적).
    - **PostgreSQL**: 강력한 RDBMS 기능을 그대로 사용 가능하며, 추후 복잡한 쿼리(재료 매칭) 확장에 유리.
    - **Storage**: 사용자 업로드 이미지 저장을 위한 스토리지 제공.

## 3. AI Model: Google Vision + Gemini 1.5 Pro
- **결정**: Hybrid Approach
- **이유**:
    - **Google Vision**: 이미지 내의 텍스트(영수증 OCR) 인식에 빠르고 정확함.
    - **Gemini 1.5 Pro**: 비정형 텍스트를 JSON으로 구조화하거나, 사물(식재료 이미지) 인식 능력, 레시피 매칭 등 추론이 필요한 영역에 강점이 있음.
    - 비용 대비 효율성을 위해 1차 OCR -> 2차 LLM 정제 파이프라인 고려.

## 4. UI Library: Tailwind CSS (Vanilla CSS 기반)
- **결정**: Tailwind CSS
- **이유**:
    - 빠른 스타일링 및 커스터마이징 용이.
    - 모바일 퍼스트 디자인 구현에 직관적인 클래스 제공.
    - (User Request: "Rich Aesthetics"를 위해 커스텀 테마 설정 필요)

## 5. Deployment
- **Frontend**: Vercel
- **Database/Auth**: Supabase Cloud
