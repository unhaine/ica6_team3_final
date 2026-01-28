# Wireframe Descriptions

This document outlines the UI structure and content derived from the project wireframes.

## 1. Landing Page (`wireframe_landing`)

**Header**

- Logo: "냉파고수" (Naengpa Gosu - Fridge Digging Master)

**Hero Section**

- Illustration: Smartphone scanning a fridge with food items flying into it.
- Main Copy: "냉장고 파먹기, AI로 3초 만에" (Empty your fridge, in 3 seconds with AI).

**Features**

- Icon 1 (Camera): "자동 인식" (Automatic Recognition)
- Icon 2 (Bell): "유통기한 알림" (Expiry Date Alert)
- Icon 3 (Book): "레시피 추천" (Recipe Recommendation)

**Action**

- Big Green Button: "시작하기" (Start)

---

## 2. Onboarding Flow (`wireframe_onboarding`)

### Screen 1: Household Size

- **Title**: "몇 명을 위한 요리를 하시나요?" (How many people are you cooking for?)
- **Options** (Cards with icons):
  - 1인 (1 Person)
  - 2인 (2 People)
  - 3인 (3 People) - _Selected State example_
  - 4인+ (4+ People)
- **Footer**: "다음" (Next) Button

### Screen 2: Dietary Restrictions

- **Title**: "못 먹는 재료가 있나요?" (Do you have any dietary restrictions?)
- **Options** (Chips/Tags):
  - 계란 (Eggs) - _Selected State example_
  - 우유 (Milk)
  - 땅콩 (Peanuts)
  - 갑각류 (Shellfish) - _Selected State example_
  - 밀 (Wheat)
- **Footer**: "다음" (Next) Button

---

## 3. Dashboard/Home (`wireframe_dashboard`)

**Header**

- Greeting: "안녕하세요, 태규님! 👨‍🍳" (Hello, Taegyu!)
- Notification Icon (with badge)

**Status Card**

- Progress Bar: "냉장고 채움 상태: 80%" (Fridge Fullness: 80%)
- Alert: "⚠️ 3일 내 소비 권장: 우유, 두부" (consume within 3 days: Milk, Tofu)

**Storage Categories** (Circular Icons)

- 냉장 (Fridge) - _Active/Selected_
- 냉동 (Freezer)
- 실온 (Pantry/Room Temp)
- 조미료 (Seasoning)

**Recommended Recipes Section**

- Card List (Horizontal Scroll):
  - Card 1: "매운 두부조림" (Spicy Braised Tofu) | Match: 95%
  - Card 2: "버섯 야채 볶음" (Mushroom Vegetable Stir-fry) | Match: 90%
  - Card 3: "김치찌개" (Kimchi Stew)...

**Navigation Bar**

- Home (Active)
- My Fridge
- Add (+)
- Recipes
- Profile

---

## 4. My Fridge / Inventory (`wireframe_inventory`)

**Header**

- Title: "나의 냉장고" (My Fridge)
- Search Icon

**Filters/Sort**

- Tabs: 전체 (All) | 유통기한순 (By Expiry) | 등록순 (By RegDate) | 가나다순 (A-Z)

**Item List**

- **Item 1**: "우유" (Milk) | Tag: D-2 | Qty: 1개
- **Item 2**: "계란" (Eggs) | Tag: D-7 | Qty: 1개
- **Item 3**: "버터" (Butter) | Tag: D-15 | Qty: 1개
- **Swipe Action Example**: Swiping left on an item reveals "수정" (Edit) and "삭제" (Delete) buttons.
- **Item 4**: "사과" (Apple) | Tag: D-3 | Qty: 2개

**Empty State / Prompt**

- Dashed Box Area: "사진을 찍어 채워보세요" (Take a photo to fill) with Camera Icon.

**Floating Action Button (FAB)**

- (+) Button for manual add

---

## 5. Camera & Correction (`wireframe_camera`)

### Screen 1: Camera

- **Viewfinder**: Square guide frame.
- **Instruction**: "영수증이나 냉장고 내부가 잘 보이게 찍어주세요" (Please take a clear picture of the receipt or inside of the fridge).
- **Controls**: Flash toggle, Shutter button, Gallery picker.

### Screen 2: Correction (Review)

- **Header**: Back button, Title "Correction".
- **Thumbnail**: Small preview of captured image.
- **Detected Items List**:
  - Row 1: Icon | 사과 (Apple) | 1개 | 2023.11.25 | X (Remove)
  - Row 2: Icon | 우유 (Milk) | 1L | 2023.12.01 | X
  - Row 3: Icon | 양파 (Onion) | 2개 | 2023.11.30 | X
- **Action**: "+ 직접 추가하기" (Add manually) link.
- **Footer**: "냉장고에 넣기" (Put in Fridge) Button.

---

## 6. Recipe Detail (`wireframe_recipe`)

**Header**

- Hero Image (Placeholder)
- Menu Title: "계란 프라이" (Fried Egg)
- Rating: 4.5 Stars

**Info Bar**

- Time: 20분 (20 min)
- Difficulty: 난이도 중 (Medium)
- Servings: 2인분 (2 Servings)

**Ingredients Section**

- List items with status:
  - ✓ 계란 2개 (Eggs x2) [보유중] (In Stock)
  - X 쪽파 1줌 (Green Onion x1 handful) [부족함] (Missing) -> "구매" (Buy) Button
  - ✓ 소금 약간 (Salt pinch)

**Cooking Steps**

- Step 1: Text instruction with thumbnail (Preheat pan...).
- Step 2: "계란을 조심스럽게 깨뜨려 올립니다..." (Crack the egg carefully...).

**Media**

- YouTube Embed placeholder.

**Footer**

- Sticky Button: "요리 시작하기" (Start Cooking)
