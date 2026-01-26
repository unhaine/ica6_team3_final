# API 설계 (API Architecture)

## 기술 방식
- **Supabase Client**: 기본적인 CRUD(Create, Read, Update, Delete)는 클라이언트(Next.js)에서 Supabase SDK를 통해 직접 호출합니다. (RLS로 보안 적용)
- **Next.js API Routes**: 비즈니스 로직이 복잡하거나 외부 API(Google Vision, YouTube 등)를 호출해야 하는 경우 서버 사이드 API를 구축합니다.

## 주요 API Endpoint

### 1. Vision Analysis (AI)
- **POST** `/api/analyze/image`
    - **Input**: 이미지 파일 (FormData)
    - **Process**:
        1. 이미지를 Google Vision API로 전송 -> 텍스트/객체 추출
        2. 추출된 데이터를 Gemini 1.5 Pro에 프롬프트와 함께 전송 -> 정형화된 JSON 포맷(재료명, 수량 추정치)으로 변환 요청
    - **Output**:
        ```json
        {
          "detected_ingredients": [
            {"name": "대파", "quantity": "1단", "confidence": 0.95},
            {"name": "삼겹살", "quantity": "600g", "confidence": 0.88}
          ]
        }
        ```

### 2. Recipe Recommendation (Custom Logic)
- **GET** `/api/recipes/recommend`
    - **Input**: `user_id` (Header or Query)
    - **Process**:
        1. `user_ingredients` 테이블에서 'AVAILABLE' 상태인 재료 조회
        2. `recipes` 테이블에서 재료 매칭 알고리즘 실행 (PostgreSQL Function or Application Logic)
        3. 일치율 80% 이상 필터링 및 정렬
    - **Output**: 레시피 리스트 (매칭률 포함)

### 3. Community AI Scoring
- **POST** `/api/community/score`
    - **Input**: `user_image_url`, `recipe_original_image_url`
    - **Process**: Gemini Pro Vision을 사용하여 두 이미지의 시각적 유사도 분석 및 점수 산출
    - **Output**: `{"score": 85, "comment": "색감이 아주 비슷하네요!"}`

## 외부 인터페이스
- **YouTube Data API**: 레시피 상세 페이지 진입 시 클라이언트 사이드에서 호출하거나, 초기 로딩 속도를 위해 서버에서 캐싱된 데이터를 내려줌.
- **식약처 DB**: 주기적으로(Weekly) 마스터 DB 업데이트용 배치 스크립트 별도 운영.
