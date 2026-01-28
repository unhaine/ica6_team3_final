# 📜 컴포넌트 작성 규칙 헌법

> Version: 1.0.0  
> 최종 수정일: 2026-01-27  
> 적용 범위: `components/elements`, `components/modules`, `components/ui`

---

## 제1장 총칙

### 제1조 (목적)

본 헌법은 RefrigerAI 프로젝트의 컴포넌트 작성에 있어 **통일성, 가독성, 유지보수성, 확장성, 재사용성**을 보장하기 위한 표준 규칙을 정한다.

### 제2조 (적용 범위)

본 규칙은 `components/` 디렉토리 하위의 모든 React 컴포넌트에 적용된다.

### 제3조 (레이어 정의)

컴포넌트는 다음 3개 레이어로 분류한다:

| 레이어       | 경로                   | 설명                                 | 예시                    |
| ------------ | ---------------------- | ------------------------------------ | ----------------------- |
| **UI**       | `components/ui/`       | 기본 UI 프리미티브 (shadcn/ui 기반)  | Button, Input, Card     |
| **Elements** | `components/elements/` | UI를 조합한 재사용 가능한 단위 요소  | Icon, Tag, ActionButton |
| **Modules**  | `components/modules/`  | 비즈니스 로직이 포함된 복합 컴포넌트 | AppHeader, BoundingBox  |

---

## 제2장 디렉토리 구조

### 제4조 (컴포넌트 디렉토리 구조)

모든 컴포넌트는 **독립된 폴더**로 관리하며, 다음 파일 구조를 따른다:

```
ComponentName/
├── ComponentName.tsx          # 필수: 메인 컴포넌트
├── ComponentName.type.ts      # 필수: 타입 정의
├── ComponentName.style.ts     # 필수: 스타일 상수
├── ComponentName.hook.ts      # 선택: 커스텀 훅 (로직 분리 시)
├── ComponentName.stories.tsx  # 권장: Storybook 스토리
├── ComponentName.test.tsx     # 권장: 테스트 파일
└── index.ts                   # 필수: 배럴 파일
```

### 제5조 (파일 명명 규칙)

1. **컴포넌트명**: PascalCase (`ActionButton`, `NumberInput`)
2. **파일 확장자**:
   - 타입: `.type.ts` (단수형)
   - 스타일: `.style.ts`
   - 훅: `.hook.ts`
3. **디렉토리명**: 컴포넌트명과 동일 (PascalCase)

```
✅ 올바른 예시:
ActionButton/ActionButton.type.ts

❌ 잘못된 예시:
ActionButton/ActionButton.types.ts  (복수형 금지)
action-button/action-button.tsx     (kebab-case 금지)
```

---

## 제3장 코드 작성 규칙

### 제6조 (컴포넌트 선언)

1. **Arrow Function + Named Export** 사용
2. Props는 구조 분해 할당으로 받음
3. 컴포넌트 상단에 JSDoc 주석 작성

```typescript
// ✅ 올바른 예시
/**
 * 액션 버튼 컴포넌트
 * @description 아이콘과 로딩 상태를 지원하는 버튼
 */
export const ActionButton = ({
    children,
    icon,
    loading = false,
    className,
    ...props
}: ActionButtonProps) => {
    return ( ... );
};

// ❌ 잘못된 예시
export default function ActionButton(props) { ... }
```

### 제7조 ('use client' 지시문)

다음 조건 중 하나라도 해당하면 파일 최상단에 `'use client'` 명시:

- useState, useEffect 등 React 훅 사용
- onClick, onChange 등 이벤트 핸들러 사용
- useRouter, usePathname 등 Next.js 클라이언트 훅 사용
- window, document 등 브라우저 API 사용

```typescript
"use client";

import { useState } from "react";
// ...
```

### 제8조 (타입 정의)

1. 모든 Props 타입은 `.type.ts` 파일에 정의
2. 인터페이스명: `ComponentNameProps`
3. 확장 가능한 구조로 설계

```typescript
// ComponentName.type.ts
import { ComponentProps } from "react";

export interface ActionButtonProps extends ComponentProps<"button"> {
  /** 버튼 내부 아이콘 */
  icon?: string;
  /** 로딩 상태 */
  loading?: boolean;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}
```

### 제9조 (스타일 정의)

1. Tailwind 클래스는 `.style.ts`로 분리
2. 스타일 상수명: `STYLES` 또는 의미있는 대문자 상수
3. `as const` 사용으로 타입 안정성 확보

```typescript
// ComponentName.style.ts

// 방법 1: 단순 상수 객체 (Elements/Modules)
export const STYLES = {
    container: "flex items-center gap-2",
    button: "h-8 w-8 rounded-full",
    input: "h-8 w-16 text-center",
} as const;

// 방법 2: CVA 사용 (UI 레이어, variant 다수 시)
import { cva } from "class-variance-authority";

export const buttonVariants = cva("base-classes", {
    variants: {
        variant: { ... },
        size: { ... },
    },
    defaultVariants: { ... },
});
```

### 제10조 (커스텀 훅)

1. 복잡한 상태 로직은 `.hook.ts`로 분리
2. 훅 이름: `useComponentName`
3. 반환값은 명확한 객체로 정의

```typescript
// ComponentName.hook.ts
export const useComponentName = (options?: Options) => {
    const [state, setState] = useState(initialState);

    const handleAction = useCallback(() => { ... }, []);

    return {
        state,
        handleAction,
    };
};
```

---

## 제4장 Import/Export 규칙

### 제11조 (배럴 파일)

모든 컴포넌트 폴더에는 `index.ts` 배럴 파일을 포함하며, 다음을 내보낸다:

```typescript
// index.ts
export * from "./ComponentName";
export * from "./ComponentName.type";
export * from "./ComponentName.style";
export * from "./ComponentName.hook"; // 존재 시
```

### 제12조 (상위 배럴 파일)

각 레이어에는 상위 배럴 파일을 유지한다:

```typescript
// components/elements/index.ts
export * from "./ActionButton";
export * from "./Icon";
export * from "./IconButton";
// ... 모든 elements 컴포넌트
```

### 제13조 (Import 경로)

1. **같은 레이어 내**: 상대 경로 (1단계까지)
2. **다른 레이어 간**: 절대 경로 (`@/`)
3. **외부 라이브러리**: 최상단 그룹

```typescript
// Import 순서
import React from "react"; // 1. React
import { useRouter } from "next/navigation"; // 2. 외부 라이브러리

import { Button } from "@/components/ui"; // 3. 다른 레이어 (절대 경로)
import { cn } from "@/lib/utils"; // 4. 유틸리티

import { Icon } from "../Icon"; // 5. 같은 레이어 (상대 경로)
import { ActionButtonProps } from "./ActionButton.type"; // 6. 로컬 파일
import { STYLES } from "./ActionButton.style";
```

---

## 제5장 접근성 및 품질

### 제14조 (접근성)

1. 인터랙티브 요소에 `aria-label` 필수
2. 아이콘만 있는 버튼에 설명적 레이블 제공
3. 폼 요소에 적절한 레이블 연결

```typescript
// ✅ 올바른 예시
<Button aria-label="수량 감소">
    <Icon name="Minus" />
</Button>

// ❌ 잘못된 예시
<Button>
    <Icon name="Minus" />
</Button>
```

### 제15조 (문서화)

1. 모든 컴포넌트에 JSDoc 주석
2. Props에 설명 주석 추가
3. 복잡한 로직에 인라인 주석

### 제16조 (Storybook)

1. 모든 컴포넌트에 Stories 파일 권장
2. 주요 variant와 상태를 커버하는 스토리 작성

---

## 제6장 부칙

### 제17조 (예외 사항)

1. `ui/` 레이어의 shadcn/ui 기반 컴포넌트는 기존 구조 유지 가능
2. 외부 라이브러리 래퍼 컴포넌트는 본 규칙을 유연하게 적용

### 제18조 (개정)

본 헌법은 팀 합의에 의해 개정될 수 있으며, 개정 시 버전과 날짜를 명시한다.

---

## 📎 빠른 참조

### 체크리스트

- [ ] 컴포넌트 폴더 생성 (PascalCase)
- [ ] `.tsx`, `.type.ts`, `.style.ts` 파일 생성
- [ ] `index.ts` 배럴 파일 작성
- [ ] Props 타입 정의 및 JSDoc 주석
- [ ] 스타일 상수 분리
- [ ] 'use client' 필요 여부 확인
- [ ] 접근성 속성 확인
- [ ] 상위 배럴 파일에 추가

### 명명 규칙 요약

| 항목        | 규칙                 | 예시                    |
| ----------- | -------------------- | ----------------------- |
| 컴포넌트    | PascalCase           | `ActionButton`          |
| 타입 파일   | `.type.ts`           | `ActionButton.type.ts`  |
| 스타일 파일 | `.style.ts`          | `ActionButton.style.ts` |
| 훅 파일     | `.hook.ts`           | `ActionButton.hook.ts`  |
| Props 타입  | `ComponentNameProps` | `ActionButtonProps`     |
| 스타일 상수 | UPPER_CASE           | `STYLES`, `COLORS`      |
| 커스텀 훅   | use + ComponentName  | `useActionButton`       |
