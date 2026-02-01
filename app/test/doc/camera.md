# 카메라 (AI 인식) 페이지 와이어프레임

## 0. ASCII Wireframe

```text
/* Step 1: Capture */          /* Step 2: Detect */
+-----------------------+      +-----------------------+
|                       |      | [<]   객체 탐지    [X] |
|                       |      +-----------------------+
|      [ Camera ]       |      |                       |
|      [  View  ]       |      |  +-----------------+  |
|                       |      |  | [B] Tomato      |  |
|      ( Guide )        |      |  +-----------------+  |
|                       |      |                       |
+-----------------------+      |      ( Analyzing... ) |
|  [G]    [O]    [X]    |      +-----------------------+
+-----------------------+      |     [ 인식 완료 ]      |
                               +-----------------------+

/* Step 3: Confirm */
+-----------------------+
| [<]  인식 결과 확인  [X] |
+-----------------------+
|                       |
|  (I) 토마토   (1개) [X]|
|  (I) 대파     (1단) [X]|
|  (I) 우유     (1개) [X]|
|                       |
+-----------------------+
|   [ 냉장고에 저장 ]    |
+-----------------------+
```

## 1. 텍스트 와이어프레임

### [Step 1: Capture]

```text
[Header] (Hidden)

[Main]
- [Live Camera View/Placeholder]
- [Overlay: Guide Box]
- [Bottom Controls]
  - [Gallery Button] [Capture Button] [X Button]
```

### [Step 2: Detect]

```text
[Header]
- Left: [Back Arrow]
- Title: "객체 탐지"
- Right: [X]

[Main]
- [Taken Image Container]
  - [Overlay: Bounding Boxes] (Draggable/Resizable)
  - [Overlay: Labels/Delete buttons]
- [Loading Overlay] (During Analysis)

[Bottom Actions]
- [Button] 인식 완료
```

### [Step 3: Confirm]

```text
[Header]
- Left: [Back Arrow]
- Title: "인식 결과 확인"
- Right: [X]

[Main]
- [Recognized Items List]
  - [Row: Item Image | Item Name | Quantity | Delete Button]
- [Action Button] 냉장고에 저장하기
```

## 2. 사용된 공용 컴포넌트

- `IconButton` (@/components/elements)
- `LoadingOverlay` (@/components/elements) - _확인 필요 (DetectStep에서 쓰임)_
- `Header` (@/components/modules)
- `Footer` (@/components/modules) - _카메라 페이지에서는 숨김 처리_

## 3. 공용 컴포넌트가 아닌 것

- `CaptureStep` (Local Component)
- `DetectStep` (Local Component)
- `ConfirmStep` (Local Component)
- `BoundingBox` (Local Logic/SVG)
- `ConfirmItemRow` (Local Component)
- `EditItemModal` (Local Component)
