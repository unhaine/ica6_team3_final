# 커뮤니티 페이지 와이어프레임

## 0. ASCII Wireframe

```text
+----------------------------------+
|      커뮤니티                [S] |
+----------------------------------+
| [전체] [NEW] [TRENDING] [HOT]    |
+----------------------------------+
|                                  |
| (A) 요리왕김씨             [...] |
| +------------------------------+ |
| |                              | |
| |           [ IMAGE ]          | |
| |                              | |
| +------------------------------+ |
| (H) 128  (M) 24                  |
| 오늘 만든 제육볶음~              |
|                                  |
| (A) 집밥요정               [...] |
| +------------------------------+ |
| |                              | |
| |           [ IMAGE ]          | |
| |                              | |
| +------------------------------+ |
|                                  |
+----------------------------------+
|  [H]   [F]   [R]   [C]   [P]   |
+----------------------------------+
```

## 1. 텍스트 와이어프레임

```text
[Header]
- Title: "커뮤니티"
- Right: [Search Icon]

[Filter Bar]
- [Carousel: [전체] [NEW] [TRENDING] [HOT]]

[Main Content] (Scrollable)
- [Post Item]
  - [Post Header: Avatar, Username | More Icon]
  - [Post Image: Large Square]
  - [Interactions: Heart (Like count), Message (Comment count)]
  - [Caption: Long text]
```

## 2. 사용된 공용 컴포넌트

- `IconButton` (@/components/elements)
- `SelectableChip` (@/components/elements)
- `AvatarThumbnail` (@/components/elements)
- `Typography` (@/components/elements)
- `MediaCard` (@/components/elements)
- `Header` (@/components/modules)
- `Footer` (@/components/modules)
- `FilterCarousel` (@/components/modules)

## 3. 공용 컴포넌트가 아닌 것

- 포스트 아이템 레이아웃 (MediaCard와 Typography 등을 조합한 인라인 레이아웃)
