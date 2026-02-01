# 나의 냉장고 페이지 와이어프레임

## 0. ASCII Wireframe

```text
+----------------------------------+
|      나의 냉장고             [S] |
+----------------------------------+
| [전체] [채소] [고기] [해산물] ... |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  | (I) 방울토마토         (D-2) |  |
|  |     300g                     |  |
|  +----------------------------+  |
|  | <-- [Record] [Edit] [Delete] |  |
|                                  |
|  +----------------------------+  |
|  | (I) 우유 (D-5)               |  |
|  |     1000ml                   |  |
|  +----------------------------+  |
|                                  |
|                          [ (+) ] |
+----------------------------------+
|  [H]   [F]   [R]   [C]   [P]   |
+----------------------------------+
```

## 1. 텍스트 와이어프레임

```text
[Header]
- Title: "나의 냉장고"
- Right: [Search Icon]

[Category Filter] (Sticky Top)
- [Carousel: [전체] [채소] [고기] [해산물] ...]

[Main Content] (Scrollable)
- [List: Swipeable Items]
  - Left Swipe: [Record] [Edit] [Delete]
  - Card Content:
    - [Image Thumbnail]
    - [Title: 재료명]
    - [Subtitle: 수량]
    - [Right Badge: D-Day] (Color coded: Red for <=3, Green otherwise)

- [Floating Action Button]
  - [Camera Icon] -> /test/camera
```

## 2. 사용된 공용 컴포넌트

- `IconButton` (@/components/elements)
- `SelectableChip` (@/components/elements)
- `ActionCard` (@/components/elements)
- `DataRow` (@/components/elements)
- `AvatarThumbnail` (@/components/elements)
- `Header` (@/components/modules)
- `Footer` (@/components/modules)
- `FilterCarousel` (@/components/modules)
- `DataList` (@/components/modules)
- `SwipeableRow` (@/components/modules)

## 3. 공용 컴포넌트가 아닌 것

- 없음 (대부분 공용 컴포넌트 조합으로 구성됨)
