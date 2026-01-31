# Plan: 카메라 페이지 구현 (/app/test/camera)

## 🎯 목표

- 냉장고 사진 촬영/업로드를 통한 식재료 자동 인식 프로세스 구현
- AI 객체 탐지 및 바운딩 박스 표시
- 인식 결과 확인 및 수정 후 냉장고 저장
- 최종 완료 시 `/app/test/fridge`로 이동

## 🛠️ 주요 기능 및 단계

### Step 1: 사진 촬영/업로드 (Capture)

- 카메라 뷰포트 시뮬레이션 (또는 실제 기기 카메라 연동)
- 파일 업로드 기능 제공
- 디자인: Fullscreen, 깔끔한 인터페이스

### Step 2: AI 객체 탐지 (Detect)

- `gemini-2.0-flash` API 호출
- 분석 중 상태 표시 (스피너, 메시지)
- `BoundingBoxCanvas`를 활용하여 탐지된 객체 시각화 (인터랙티브 수정 가능)

### Step 3: 인식 결과 확인 및 수정 (Confirm)

- 탐지된 식재료 리스트 표시
- 라벨 수정 및 삭제 기능
- 재료 직접 추가 기능
- 최종 '냉장고에 저장' 버튼

### Step 4: 이동 (Navigation)

- 저장 완료 후 `/app/test/fridge`로 리다이렉트 (성공 토스트 메시지 포함)

## 📁 파일 구조

- `app/test/camera/page.tsx`: 메인 카메라 페이지 (상태 관리를 통한 단계별 렌더링)
- `components/modules/Camera/StepCapture.tsx`: 촬영 단계 컴포넌트 (선택 사항, 복잡할 경우 분리)
- `components/modules/Camera/StepDetect.tsx`: 탐지 단계 컴포넌트
- `components/modules/Camera/StepConfirm.tsx`: 확인 단계 컴포넌트

## 🎨 디자인 가이드 (05_UI_STRUCTURE.md 참고)

- 글래스모피즘 아카이브 효과 적용
- 에메랄드(Primary) 색상 포인트 사용
- 둥근 모서리와 부드러운 애니메이션 (Framer Motion 등 활용)
