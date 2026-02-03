# 식료품 마스터 데이터(Dictionary) 테이블 제안

> 작성일: 2026-02-03  
> 상태: 제안/검토중

---

## 📋 현재 상황

현재 `GroceryItem` 모델은 사용자가 입력한 식료품 정보를 **그대로** 저장하고 있습니다:

```prisma
model GroceryItem {
  id          String   @id @default(cuid())
  userId      String
  name        String   // 사용자 입력 그대로
  quantity    String?
  category    String?  // 사용자 입력 또는 AI 추론
  // ...
}
```

### 🚨 현재 구조의 문제점

| 문제                   | 설명                               | 예시                                                        |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------- |
| **비표준화**           | 같은 식료품이 다른 이름으로 저장됨 | "계란", "달걀", "유정란", "무항생제계란" → 모두 다른 아이템 |
| **카테고리 불일치**    | AI/사용자마다 다른 카테고리 부여   | "두부" → 채소? 콩류? 단백질?                                |
| **유통기한 추정 불가** | 기본 유통기한 정보 없음            | 우유의 기본 유통기한이 몇 일인지 모름                       |
| **영양정보 부재**      | 레시피 매칭, 건강 추천 어려움      | 식료품별 영양성분 정보 없음                                 |
| **검색/분석 어려움**   | 통계, 트렌드 분석 제한적           | "이번 달 가장 많이 구매한 식료품" 집계 어려움               |

---

## 💡 제안: GroceryMaster (식료품 마스터) 테이블 추가

### 기본 개념

```
┌────────────────────┐          ┌─────────────────────┐
│   GroceryMaster    │          │     GroceryItem     │
│   (표준 딕셔너리)     │  1:N     │  (사용자 보유 식료품)  │
├────────────────────┤◄─────────┼─────────────────────┤
│ standardName       │          │ userId              │
│ aliases[]          │          │ masterId (FK)       │
│ category           │          │ displayName         │
│ defaultExpiryDays  │          │ quantity            │
│ storageType        │          │ expiryDate          │
│ nutritionInfo      │          │ purchaseDate        │
│ seasonality        │          │ ...                 │
└────────────────────┘          └─────────────────────┘
```

### 제안 스키마

```prisma
// ================================
// 식료품 마스터 데이터 (딕셔너리)
// ================================

model GroceryMaster {
  id                String   @id @default(cuid())

  // 기본 정보
  standardName      String   @unique  // 표준 이름 (예: "계란")
  aliases           String[] @default([])  // 별명들 (예: ["달걀", "유정란", "무항생제계란"])

  // 분류
  category          GroceryCategory  // enum: 채소, 과일, 육류, 해산물, 유제품, 곡물, 조미료, 음료, 냉동식품, 기타
  subCategory       String?  // 세부 분류 (예: 육류 > 돼지고기)

  // 보관 정보
  storageType       StorageType  // enum: 냉장, 냉동, 실온
  defaultExpiryDays Int          // 기본 유통기한 (일 단위)
  expiryHint        String?      // 유통기한 힌트 (예: "개봉 후 3일 이내 섭취 권장")

  // 영양 정보 (100g 기준, 선택적)
  calories          Int?     // 칼로리 (kcal)
  protein           Float?   // 단백질 (g)
  carbohydrates     Float?   // 탄수화물 (g)
  fat               Float?   // 지방 (g)
  sodium            Float?   // 나트륨 (mg)

  // 메타 정보
  seasonStart       Int?     // 제철 시작월 (1-12)
  seasonEnd         Int?     // 제철 종료월 (1-12)
  commonAllergens   String[] @default([])  // 알러지 유발 성분 (우유, 계란, 대두 등)
  imageUrl          String?  // 대표 이미지

  // 관계
  groceryItems      GroceryItem[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([standardName])
  @@index([category])
}

enum GroceryCategory {
  VEGETABLE     // 채소
  FRUIT         // 과일
  MEAT          // 육류
  SEAFOOD       // 해산물
  DAIRY         // 유제품
  GRAIN         // 곡물/쌀
  SEASONING     // 조미료/양념
  BEVERAGE      // 음료
  FROZEN        // 냉동식품
  PROCESSED     // 가공식품
  ETC           // 기타
}

enum StorageType {
  REFRIGERATED  // 냉장
  FROZEN        // 냉동
  ROOM_TEMP     // 실온
}

// 수정된 GroceryItem
model GroceryItem {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(...)

  // 마스터 데이터 연결 (선택적 - 매칭 안될 수도 있음)
  masterId      String?
  master        GroceryMaster? @relation(fields: [masterId], references: [id])

  displayName   String   // 사용자에게 보여주는 이름 (원본 입력값 보존)
  quantity      String?
  price         Int?
  source        String?
  expiryDate    DateTime?
  purchaseDate  DateTime?

  // ... 기존 필드들
}
```

---

## 🎯 도입 시 장점

### 1. **유통기한 자동 계산**

```typescript
// 마스터 데이터 활용
const egg = await prisma.groceryMaster.findFirst({
  where: { aliases: { has: "유정란" } },
});

// 구매일 + 기본 유통기한으로 자동 설정
const expiryDate = addDays(purchaseDate, egg.defaultExpiryDays);
```

### 2. **알러지 경고**

```typescript
// 사용자 알러지: ["계란", "우유"]
const allergicItems = groceryItems.filter((item) =>
  item.master?.commonAllergens.some((a) => userAllergies.includes(a)),
);
```

### 3. **정확한 통계/분석**

```typescript
// 월별 카테고리별 구매 통계
const stats = await prisma.groceryItem.groupBy({
  by: ["masterId"],
  _count: true,
  where: { purchaseDate: { gte: startOfMonth } },
});
```

### 4. **레시피 매칭 개선**

```typescript
// 표준화된 재료명으로 레시피 검색
const recipes = await matchRecipes(
  groceryItems.map((item) => item.master?.standardName ?? item.displayName),
);
```

### 5. **제철 식품 추천**

```typescript
const currentMonth = new Date().getMonth() + 1;
const seasonalItems = await prisma.groceryMaster.findMany({
  where: {
    seasonStart: { lte: currentMonth },
    seasonEnd: { gte: currentMonth },
  },
});
```

---

## 🔧 구현 방안

### Option A: 사전 구축 (Seeding)

- 주요 식료품 500~1000개 정도 미리 정의
- 공공데이터(식품영양성분DB 등) 활용
- 초기 데이터 품질 높음, 초기 작업량 많음

### Option B: AI 자동 생성 + 수동 검수

- OCR/사진 분석 시 새로운 식료품 감지되면 AI가 마스터 데이터 생성 제안
- 관리자가 검수 후 승인
- 점진적 확장 가능, 초기 데이터 불완전

### Option C: 하이브리드 (권장 ⭐)

1. **핵심 식료품 100~200개** 사전 정의 (우유, 계란, 양파, 돼지고기 등 필수)
2. 새 식료품 감지 시 **유사도 매칭** 시도
3. 매칭 실패 시 **임시 저장** 후 추후 배치로 마스터 추가

---

## 📊 데이터 소스 제안

| 소스                                  | 설명               | 활용              |
| ------------------------------------- | ------------------ | ----------------- |
| **식품의약품안전처 - 식품영양성분DB** | 국가 공인 영양정보 | 영양성분, 표준명  |
| **농림축산식품부 - 농산물유통정보**   | 제철 정보, 시세    | 제철 시기         |
| **한국소비자원 - 식품 유통기한 정보** | 표준 유통기한      | defaultExpiryDays |
| **Naver Shopping API**                | 상품 카테고리 정보 | category, aliases |

---

## ⚠️ 고려사항

### 1. 마스터 매칭 실패 처리

```typescript
// masterId가 null인 경우 처리
interface GroceryItemView {
  name: string; // master?.standardName ?? displayName
  category: string; // master?.category ?? inferredCategory
}
```

### 2. 동일 식료품의 다양한 형태

- "우유" vs "저지방우유" vs "무지방우유" → 같은 마스터? 다른 마스터?
- **제안**: 하위 마스터 개념 또는 `variant` 필드 도입

### 3. 브랜드 상품 처리

- "서울우유 1L" → 마스터는 "우유", 브랜드/용량은 별도 필드
- **제안**: `brand`, `size` 필드를 GroceryItem에 추가

---

## 📝 결론

**GroceryMaster 테이블 도입을 적극 권장합니다.**

현재 구조에서는 사용자마다, AI마다 다른 방식으로 식료품을 저장하기 때문에:

- 데이터 일관성 부족
- 유통기한 자동화 불가
- 통계/분석 제한적
- 레시피 매칭 정확도 저하

**하이브리드 방식(Option C)**으로 시작하면:

1. 초기 핵심 데이터만 준비 (작업량 최소화)
2. 점진적으로 마스터 데이터 확장
3. 기존 GroceryItem 호환성 유지 (masterId는 nullable)

---

## 🗳️ 다음 단계

이 제안에 동의하신다면, 다음 순서로 진행할 수 있습니다:

1. [ ] GroceryMaster, GroceryCategory, StorageType 스키마 추가
2. [ ] GroceryItem에 masterId 관계 추가
3. [ ] 초기 시드 데이터 준비 (핵심 식료품 100개)
4. [ ] 마스터 매칭 유틸리티 함수 구현
5. [ ] OCR/사진분석 시 마스터 매칭 로직 적용

---

_의견이나 추가 논의 사항이 있으시면 말씀해주세요!_ 🙂
