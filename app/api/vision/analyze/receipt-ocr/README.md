# 📄 Receipt OCR - 영수증 텍스트 인식

> GPT-4o Vision을 사용한 영수증/구매내역 텍스트 인식

---

## 📍 Endpoint

```
POST /api/vision/analyze/receipt-ocr
```

또는 통합 API 사용:

```
POST /api/vision/analyze?api=receipt-ocr
```

---

## 📥 Request

```typescript
// Content-Type: application/json
{
  "image": "data:image/jpeg;base64,..."  // Base64 인코딩된 영수증 이미지
}
```

---

## 📤 Response

```typescript
{
  "items": [
    {
      "name": "삼겹살",
      "quantity": 1,
      "unit": "팩",
      "price": 15900
    },
    {
      "name": "양파",
      "quantity": 3,
      "unit": "개",
      "price": 2500
    }
  ],
  "store": "이마트 강남점",
  "date": "2026-01-25",
  "total": 18400,
  "apiSource": "receipt-ocr"
}
```

---

## 🔧 환경변수

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## 💻 사용 예시

```typescript
const analyzeReceipt = async (base64Image: string) => {
  const response = await fetch("/api/vision/analyze?api=receipt-ocr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result.items; // 식재료 목록
};
```

---

## 📷 지원 이미지 타입

| 타입        | 설명                                 |
| ----------- | ------------------------------------ |
| 종이 영수증 | 마트, 슈퍼 등에서 발행한 종이 영수증 |
| 전자 영수증 | 이메일, 앱 스크린샷                  |
| 구매 내역   | 쿠팡, 마켓컬리 등 앱 구매 내역 캡처  |

---

## ⚠️ 주의사항

1. **가독성**: 영수증이 선명하게 보이도록 찍어야 함
2. **언어**: 한국어 영수증 최적화
3. **비용**: GPT-4o Vision API 사용량에 따른 비용 발생

---

_최종 업데이트: 2026-01-26_
