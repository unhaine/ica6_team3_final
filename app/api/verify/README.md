# ✅ Verify API

> AI 싱크로율 판단 - 레시피 원본 vs 사용자 요리 사진 비교

---

## 📍 Endpoint

```
POST /api/verify
```

---

## 📥 Request

```typescript
// Content-Type: application/json
{
  "recipeId": "recipe-001",
  "image": "data:image/jpeg;base64,..."  // 사용자가 촬영한 요리 완성 사진
}
```

---

## 📤 Response

```typescript
{
  "success": true,
  "data": {
    "syncRate": 87,           // 0~100 점수
    "feedback": "색감과 플레이팅이 레시피와 매우 유사합니다!",
    "ranking": 15,            // 현재 순위
    "badges": [
      "첫 요리 인증",
      "80점 이상"
    ],
    "comparison": {
      "color": 90,            // 색감 유사도
      "composition": 85,      // 구도/플레이팅
      "ingredients": 88       // 재료 인식
    }
  }
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
const verifyCooking = async (recipeId: string, base64Image: string) => {
  const response = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipeId, image: base64Image }),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data;
};
```

---

## 🎯 점수 기준

| 점수   | 등급    | 피드백                      |
| ------ | ------- | --------------------------- |
| 90~100 | 🏆 완벽 | "레시피와 거의 똑같아요!"   |
| 80~89  | 🥇 훌륭 | "아주 잘 만드셨어요!"       |
| 70~79  | 🥈 좋음 | "잘 하셨어요!"              |
| 60~69  | 🥉 보통 | "나쁘지 않아요!"            |
| 0~59   | 💪 도전 | "다음엔 더 잘할 수 있어요!" |

---

## 🏅 뱃지 시스템

| 뱃지          | 조건               |
| ------------- | ------------------ |
| 첫 요리 인증  | 첫 인증 완료       |
| 80점 이상     | 80점 이상 달성     |
| 요리 고수     | 90점 이상 3회 달성 |
| 꾸준한 요리사 | 10회 인증 완료     |

---

## 🤖 AI 분석 방법

Gemini Vision을 사용하여 다음 항목 비교:

1. **색감 (Color)**: 음식 색상의 유사도
2. **구도 (Composition)**: 플레이팅, 그릇 배치
3. **재료 (Ingredients)**: 보이는 재료 인식

---

## ⚠️ 주의사항

1. 요리 사진은 **위에서 내려다보는 각도**로 촬영 권장
2. 밝은 조명에서 촬영 시 인식률 향상
3. 그릇/접시가 완전히 보이도록 촬영

---

_최종 업데이트: 2026-01-26_
