# UI 구조 (User Interface Structure)

## Site Map

```mermaid
graph TD
    A[Login] --> B[Home / Dashboard]
    B --> C[Camera / Upload]
    C --> C1[Analyze Preview & Edit]
    C1 --> B
    B --> D[My Fridge (Inventory)]
    B --> E[Recipe Recommendation]
    E --> E1[Recipe Detail]
    E1 --> E2[Shopping Link]
    E1 --> E3[Start Cooking]
    E3 --> F[Community / Share]
    F --> F1[Write Post]
    B --> G[Community Feed]
```

## 주요 화면 구성

### 1. 로그인 (Login)
- 심플한 소셜 로그인 버튼 (카카오, 구글)
- 서비스 로고 및 슬로건 노출

### 2. 홈 / 대시보드 (Home)
- **상단**: 임박한 소비기한 알림 (D-Day 배지)
- **중단**: "오늘은 이 요리 어때요?" (추천 레시피 가로 스크롤 카드)
- **하단**: 퀵 액션 버튼 (재료 추가하기 - 카메라 아이콘 강조)

### 3. 촬영 및 분석 (Camera & Analysis)
- **촬영 화면**: 카메라 뷰파인더 + 갤러리 선택 버튼
- **분석 대기**: 로딩 애니메이션 ("AI가 냉장고를 분석 중입니다...")
- **결과 수정**:
    - 리스트 형태의 인터페이스
    - 각 항목 옆에 [X] 버튼, 텍스트 터치 시 수정 모드
    - 하단 [등록 완료] 버튼 (Floating Action Button)

### 4. 나의 냉장고 (Inventory List)
- 카테고리별 탭 (전체, 냉장, 냉동, 실온)
- 각 아이템은 [이름 | D-Day | 수량] 표시
- 스와이프로 '사용 완료' 또는 '삭제' 처리

### 5. 레시피 상세 (Recipe Detail)
- **헤더**: 요리 이미지, 제목, 매칭률(%)
- **재료**: 있는 재료(초록색), 없는 재료(빨간색 + 구매 링크)
- **조리법**: Step-by-step 설명
- **영상**: 유튜브 플레이어 임베드

### 6. 커뮤니티 (Community)
- 인스타그램 스타일의 피드
- 이미지 위주, 하단에 좋아요/댓글 및 AI 점수 뱃지 표시
