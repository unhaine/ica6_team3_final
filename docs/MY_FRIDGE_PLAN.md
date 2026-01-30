# 🧊 My Fridge 페이지 구현 계획 (최종: Swipe Interaction 추가)

## 1. 개요 및 분석

사용자의 추가 요구사항("스와이프 삭제/수정", "DB 연동 고려")을 반영하여, **단위 기능(Swipe)을 분리**하고 이를 조합해서 사용할 수 있는 아키텍처를 확정합니다.

---

## 2. 모듈 상세 설계

### 2.1 🛹 `DataList` (Module)

> "데이터 순회 및 레이아웃 관리 전담"

- **역할**: 순수하게 데이터를 받아 `renderItem`으로 그리거나 나열하는 역할만 수행.
- **DB 연동 고려**: `onEndReached` (무한 스크롤), `refreshing` (당겨서 새로고침) 등의 Props를 미래에 확장하기 좋은 구조.

### 2.2 🤏 `SwipeableRow` (Module / UI)

> ✨ [NEW] "모든 요소를 스와이프 가능하게 만듦"

`ActionCard` 자체에 기능을 넣는 대신, **Wrapper Component**로 구현하여 범용성을 극대화합니다.

- **위치**: `components/modules/SwipeableRow`
- **구현 기술**: `framer-motion` (Drag Gestures)
- **Props**:
  - `children`: 슬라이드될 메인 컨텐츠 (예: `ActionCard`)
  - `rightAction`: 오른쪽에서 나타날 액션 (예: 삭제 버튼)
  - `leftAction`: 왼쪽에서 나타날 액션 (예: 수정 혹은 완료)
  - `onSwipeRight`: 오른쪽 스와이프 콜백
  - `onSwipeLeft`: 왼쪽 스와이프 콜백

### 2.3 🧱 `ActionCard` (Element)

> "보여지는 뷰(View) 담당"

- 스와이프 기능 없이, 클릭 이벤트와 시각적 스타일(`dashed` 등)만 담당.
- `SwipeableRow`의 `children`으로 들어갑니다.

---

## 3. 최종 조립 예시 (User Scenario)

DB에서 리스트를 받아와 수정/삭제하는 시나리오는 다음과 같이 구현됩니다.

```tsx
/* Page Component */
export default function MyFridgePage() {
  const { items, removeItem, updateItem } = useFridgeDB(); // DB hook

  return (
    <DataList
      data={items}
      className="flex flex-col space-y-3"
      // renderItem에서 "스와이프 기능"과 "카드 UI"를 합성(Composition)
      renderItem={(item) => (
        <SwipeableRow
          key={item.id}
          // 오른쪽 스와이프 시 나타날 뒷면(Back) UI
          rightAction={
            <div className="bg-red-500 text-white flex items-center px-4">
              삭제
            </div>
          }
          // 실제 삭제 로직 (DB 연동)
          onSwipeRight={() => removeItem(item.id)}
        >
          {/* 앞면(Front) UI */}
          <ActionCard onClick={() => openDetail(item)}>
            <DataRow
              left={<AvatarThumbnail src={item.image} />}
              title={item.name}
              subTitle={item.quantity}
            />
          </ActionCard>
        </SwipeableRow>
      )}
    />
  );
}
```

## 4. 개발 순서

1. `components/modules/SwipeableRow` (framer-motion 기반 구현)
2. `components/modules/DataList`
3. `components/modules/FilterCarousel` (기존 계획 유지)
