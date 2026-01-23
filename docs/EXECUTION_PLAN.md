# 실행 계획 (POC)

> 핵심 기술 검증: 이미지 업로드 → Vision API 객체 탐지 → 드래그 가능한 바운딩 박스 표시

## 목표

Google Vision API를 활용한 식료품 인식 및 Bounding Box 인터랙션의 **기술적 가능성 검증**

## Phase 개요

| Phase   | 목표                             | 예상 시간 |
| ------- | -------------------------------- | :-------: |
| Phase 1 | 프로젝트 세팅 + 이미지 업로드 UI |   30분    |
| Phase 2 | Google Vision API 연동           |   45분    |
| Phase 3 | 드래그 가능한 바운딩 박스 구현   |   1시간   |

**총 예상 시간**: 약 2시간 15분

---

## Phase 1: 프로젝트 세팅 + 이미지 업로드 UI

### 목표

Next.js 프로젝트 생성 및 이미지 업로드 기능 구현

### 작업 항목

- [x] 1.1 Next.js 프로젝트 초기화 (App Router)
- [ ] 1.2 Tailwind CSS 설정
- [ ] 1.3 이미지 업로드 컴포넌트 구현
  - 파일 선택 버튼
  - 드래그 앤 드롭 지원
  - 이미지 미리보기
- [ ] 1.4 업로드된 이미지 상태 관리

### 결과물

```
/
├── 이미지 업로드 영역
├── 이미지 미리보기
└── "분석하기" 버튼
```

### 완료 조건

- [ ] 이미지 파일 선택 가능
- [ ] 선택한 이미지가 화면에 미리보기로 표시

---

## Phase 2: Google Vision API 연동

### 목표

업로드된 이미지를 Vision API로 전송하여 객체 탐지 결과 받아오기

### 사전 준비

- [ ] Google Cloud 프로젝트 생성
- [ ] Vision API 활성화
- [ ] API 키 발급 및 환경 변수 설정

### 작업 항목

- [ ] 2.1 API Route 생성 (`/api/vision/analyze`)
- [ ] 2.2 이미지 Base64 인코딩
- [ ] 2.3 Vision API Object Localization 호출
- [ ] 2.4 응답 파싱 및 정규화
  - Bounding Box 좌표 (normalized vertices → 0~1)
  - 라벨 및 신뢰도

### API 응답 예시

```json
{
  "detectedItems": [
    {
      "id": "1",
      "label": "Apple",
      "confidence": 0.92,
      "boundingBox": { "x": 0.1, "y": 0.2, "width": 0.15, "height": 0.2 }
    }
  ]
}
```

### 완료 조건

- [ ] 이미지 업로드 시 Vision API 호출 성공
- [ ] 콘솔에 탐지 결과 출력

---

## Phase 3: 드래그 가능한 바운딩 박스 구현

### 목표

Vision API 결과를 이미지 위에 드래그 가능한 박스로 표시

### 작업 항목

- [ ] 3.1 Canvas 라이브러리 선택 및 설치 (Konva.js)
- [ ] 3.2 BoundingBoxCanvas 컴포넌트 구현
  - 이미지 렌더링
  - 박스 오버레이 렌더링
- [ ] 3.3 박스 드래그 기능 구현
- [ ] 3.4 라벨 + 신뢰도 표시
- [ ] 3.5 박스 좌표 업데이트 상태 관리

### UI 구조

```
┌─────────────────────────────────────┐
│ ┌───────────┐                       │
│ │🍎 사과 92%│                       │
│ ├───────────┤  ┌──────────┐        │
│ │           │  │🥛 우유   │        │
│ │  [드래그] │  │   87%    │        │
│ │           │  └──────────┘        │
│ └───────────┘                       │
│                 [이미지 영역]        │
└─────────────────────────────────────┘
```

### 완료 조건

- [ ] Vision API 결과가 이미지 위에 박스로 표시
- [ ] 박스를 드래그하여 위치 변경 가능
- [ ] 라벨과 신뢰도가 박스 위에 표시

---

## 기술 스택 (POC)

| 영역       | 기술                    | 이유                      |
| ---------- | ----------------------- | ------------------------- |
| Framework  | Next.js 14 (App Router) | API Routes 내장           |
| Styling    | Tailwind CSS            | 빠른 스타일링             |
| Canvas     | react-konva             | React 친화적, 드래그 지원 |
| Vision API | Google Cloud Vision     | Object Localization       |

---

## 폴더 구조 (예상)

```
refrigerai/
├── app/
│   ├── page.tsx              # 메인 페이지
│   ├── layout.tsx            # 레이아웃
│   ├── globals.css           # 글로벌 스타일
│   └── api/
│       └── vision/
│           └── analyze/
│               └── route.ts  # Vision API 연동
├── components/
│   ├── ImageUploader.tsx     # 이미지 업로드
│   └── BoundingBoxCanvas.tsx # 바운딩 박스 캔버스
├── .env.local                # API 키
└── package.json
```

---

## 현재 진행 상태

| Phase   | 상태 | 비고 |
| ------- | :--: | ---- |
| Phase 1 |  ⏳  |      |
| Phase 2 |  ⏳  |      |
| Phase 3 |  ⏳  |      |

---

_최종 업데이트: 2026-01-23_
