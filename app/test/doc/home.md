# 홈 (추천) 페이지 와이어프레임

## 0. ASCII Wireframe

```text
+----------------------------------+
| [O]   태규님, 오늘의 메뉴 👨‍🍳   [B] |
+----------------------------------+
|                                  |
|  ✨ AI 추천                      |
|  +----------------------------+  |
|  | 🥇 1순위                    |  |
|  |                            |  |
|  |      계란 프라이 덮밥       |  |
|  |                            |  |
|  |  (15분) | (쉬움) | (1인분)  |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | ⏰ Urgent Ingredients      |  |
|  | 우유(D-2), 계란(D-5) 활용  |  |
|  +----------------------------+  |
|                                  |
|  [ 🍳 이 메뉴로 결정!        ]  |
|                                  |
|  +------------+  +------------+  |
|  | 🥈 2순위    |  | 🥉 3순위    |  |
|  | 참치김치찌개 |  | 사음만 국수 |  |
|  +------------+  +------------+  |
|                                  |
|      ( ) 다른 추천 받기         |
|                                  |
+----------------------------------+
|  [H]   [F]   [R]   [C]   [P]   |
+----------------------------------+
```

## 1. 텍스트 와이어프레임

```text
[Header]
- Title: "{User}님, 오늘의 메뉴 👨‍🍳"
- Left: [Camera Icon] -> /test/camera
- Right: [Bell Icon]

[Main Content] (Scrollable)
- Section: AI 추천
  - [Icon: Sparkles] AI 추천 타이틀
  - [ActionCard: 1순위 추천]
    - [Tag: 🥇 1순위]
    - "계란 프라이 덮밥" (h2, bold)
    - [Metadata: 15분 | 쉬움 | 1인분]
  - [Info Box: 유통기한 임박]
    - "🤖 유통기한 임박 재료 활용!"
    - "우유(D-2), 계란(D-5)을 활용해요"
  - [Button: 메뉴 결정] 🍳 이 메뉴로 결정!

  - Grid (2 columns)
    - [ActionCard: 2순위] 참치김치찌개
    - [ActionCard: 3순위] 사음만 국수

- [Button: Refresh] 다른 추천 받기 (2/3 남음)
```

## 2. 사용된 공용 컴포넌트

- `Typography` (@/components/elements)
- `IconButton` (@/components/elements)
- `ActionCard` (@/components/elements)
- `ActionButton` (@/components/elements)
- `Tag` (@/components/elements)
- `Header` (@/components/modules)
- `Footer` (@/components/modules)

## 3. 공용 컴포넌트가 아닌 것

- 유통기한 임박 알림 박스 (Inline Tailwind CSS)
- 추천 새로고침 버튼 (Native Button + Tailwind CSS)
