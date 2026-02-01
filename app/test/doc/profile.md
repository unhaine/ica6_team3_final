# 프로필 페이지 와이어프레임

## 0. ASCII Wireframe

```text
+----------------------------------+
|            프로필                |
+----------------------------------+
|                                  |
|            ( AVATAR )            |
|             태규님               |
|         test@example.com         |
|                                  |
|  +----------------------------+  |
|  | (I) 가구 인원         2명 [>] |  |
|  +----------------------------+  |
|  | (I) 요리 선호    간편 요리 [>] |  |
|  +----------------------------+  |
|  | (I) 알러지           땅콩 [>] |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | (I) 피드백 보내기         [>] |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | (L) 로그아웃              [>] |  |
|  +----------------------------+  |
|                                  |
|        앱 버전 1.0.0 (MVP)       |
|                                  |
+----------------------------------+
|  [H]   [F]   [R]   [C]   [P]   |
+----------------------------------+
```

## 1. 텍스트 와이어프레임

```text
[Header]
- Title: "프로필"

[Main Content] (Scrollable)
- [Member Profile Card] (White BG, Centered)
  - [Avatar (Large, Ring)]
  - [Name (h3)]
  - [Email (body2, slate-500)]

- [Menu Groups]
  - [ActionCard: 가구 인원 | Value | Chevron]
  - [ActionCard: 요리 선호 | Value | Chevron]
  - [ActionCard: 알러지/비선호 | Value | Chevron]

  - [ActionCard: 피드백 보내기 | Chevron]

  - [ActionCard: 로그아웃 (Red Icon/Text)]

- [App Version Text]
```

## 2. 사용된 공용 컴포넌트

- `AvatarThumbnail` (@/components/elements)
- `Typography` (@/components/elements)
- `ActionCard` (@/components/elements)
- `Header` (@/components/modules)
- `Footer` (@/components/modules)

## 3. 공용 컴포넌트가 아닌 것

- 없음 (대부분 공용 컴포넌트 조합으로 구성됨)
