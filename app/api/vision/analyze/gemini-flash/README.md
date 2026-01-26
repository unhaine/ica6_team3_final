# 🧊 Gemini Flash - 냉장고 객체 탐지

> Gemini Flash 2.0을 사용한 냉장고 내부 식재료 객체 탐지 및 바운딩 박스 생성

---

## 📍 Endpoint

```
POST /api/vision/analyze/gemini-flash
```

---

## 📥 Request

```typescript
// Content-Type: application/json
{
  "image": "data:image/jpeg;base64,..."  // Base64 인코딩된 이미지
}
```

---

## 📤 Response

```typescript
{
  "detectedItems": [
    {
      "id": "gf-0-abc1",
      "label": "우유",
      "confidence": 0.95,
      "boundingBox": {
        "x": 0.1,        // 0~1 정규화 좌표 (가로 위치)
        "y": 0.2,        // 0~1 정규화 좌표 (세로 위치)
        "width": 0.15,   // 0~1 정규화 너비
        "height": 0.25   // 0~1 정규화 높이
      },
      "source": "gemini-flash"
    }
  ],
  "allLabels": ["우유", "당근", "김치"],
  "apiSource": "gemini-flash"
}
```

---

## 🔧 환경변수

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## 💻 사용 예시

```typescript
const analyzeImage = async (base64Image: string) => {
  const response = await fetch("/api/vision/analyze/gemini-flash", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result.detectedItems; // 바운딩 박스 포함된 아이템 배열
};
```

---

## 🎯 바운딩 박스 사용

```tsx
import BoundingBoxCanvas from "@/components/BoundingBoxCanvas";

<BoundingBoxCanvas
  imageUrl={imageUrl}
  items={detectedItems}
  onUpdateItem={(id, newBox) => {
    // 드래그로 위치 조정 시 호출
  }}
/>;
```

---

## ⚠️ 주의사항

1. **이미지 크기**: 내부적으로 1600x1600으로 리사이즈됨
2. **지원 형식**: JPEG, PNG (HEIC는 미지원)
3. **좌표계**: 0~1 정규화 좌표 (실제 픽셀 아님)
4. **할당량**: Gemini API 무료 할당량 초과 시 에러

---

_최종 업데이트: 2026-01-26_
