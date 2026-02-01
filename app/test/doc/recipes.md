# 추천 레시피 페이지 와이어프레임

## 0. ASCII Wireframe

```text
+----------------------------------+
|      추천 레시피             [S] |
+----------------------------------+
| [전체] [한식] [양식] [초급] ...    |
+----------------------------------+
|                                  |
|  +----------------------------+  |
|  | +------+  계란 프라이 덮밥  |  |
|  | | IMG  |  (🍚 한식)        |  |
|  | |      |  ⏱️ 15분 | ⏱️ 초급 |  |
|  | +------+  By 집밥요정      |  |
|  |           ❤️128 🔖24 👁️800 |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | +------+  참치 김치찌개    |  |
|  | | IMG  |  (🍲 한식)        |  |
|  | |      |  ⏱️ 25분 | ⏱️ 초급 |  |
|  | +------+  By 요리왕        |  |
|  +----------------------------+  |
|                                  |
+----------------------------------+
|  [H]   [F]   [R]   [C]   [P]   |
+----------------------------------+
```

## 1. 텍스트 와이어프레임

```text
[Header]
- Title: "추천 레시피"
- Right: [Search Icon]

[Category Filter] (Sticky Top)
- [Carousel: [전체] [한식] [양식] [중식] [초급] ...]

[Main Content] (Scrollable)
- [List: Recipe Cards]
  - [Layout: Horizontal MediaCard]
    - [Left: Image (Square)]
    - [Center: Title, Badge (Category)]
    - [Sub-info: Clock icon + Time, Hat icon + Difficulty]
    - [Bottom Left: Author Name]
    - [Bottom Right: Stats (Heart, Bookmark, Eye count)]
```

## 2. 사용된 공용 컴포넌트

- `IconButton` (@/components/elements)
- `SelectableChip` (@/components/elements)
- `MediaCard` (@/components/elements)
- `Spinner` (@/components/elements)
- `EmptyState` (@/components/elements)
- `Header` (@/components/modules)
- `Footer` (@/components/modules)
- `FilterCarousel` (@/components/modules)
- `DataList` (@/components/modules)

## 3. 공용 컴포넌트가 아닌 것

- 없음 (대부분 공용 컴포넌트 조합으로 구성됨)
