# 🏗️ Mobile UI 모듈 재구축 계획 (Header & Footer)

기존 `AppHeader`, `BottomNavBar`를 대체하고, **제어 역전(IoC)**과 **일관된 코드 스타일**을 적용한 정규화된 `Header`, `Footer` 모듈을 구축하기 위한 계획입니다.

> **핵심 원칙**:
>
> 1. **껍데기 아키텍처 (Shell Architecture)**: 모듈은 레이아웃과 슬롯만 제공하며, 내용은 페이지가 결정한다.
> 2. **규칙 준수 (Compliance)**: `COMPONENT_RULES.md`의 파일 구조 및 명명 규칙을 철저히 따른다.
> 3. **페이지 주도 제어 (Page-Driven Control)**: 모든 상태(노출 여부, 컨텐츠)는 `useHeader`, `useFooter` 훅을 통해 페이지에서 주입한다.

---

## 1. 디렉토리 구조 및 파일 구성

`components/modules/` 하위에 아래와 같이 구성합니다.

```
components/modules/
├── Header/
│   ├── Header.tsx           # 메인 컴포넌트 (Context 구독 및 렌더링)
│   ├── Header.type.ts       # Props 및 전역 State 타입
│   ├── Header.style.ts      # 스타일 상수
│   ├── Header.hook.ts       # Context, Provider, useHeader 훅
│   └── index.ts             # 배럴 파일
│
└── Footer/
    ├── Footer.tsx           # 메인 컴포넌트 (Context 구독 및 렌더링)
    ├── Footer.type.ts       # Props 및 전역 State 타입
    ├── Footer.style.ts      # 스타일 상수
    ├── Footer.hook.ts       # Context, Provider, useFooter 훅
    └── index.ts             # 배럴 파일
```

---

## 2. 모듈별 상세 설계

### 2.1. Header 모듈 (`components/modules/Header`)

**특징**: 상단 영역을 3분할(Left, Center, Right)하여 관리하며, 페이지마다 동적으로 내용을 갈아끼울 수 있습니다.

- **패턴**: `Compound Pattern` (Header.Left, Header.Center, Header.Right)
- **제어**: `useHeader({ visible, title, left, right, ... })`
- **타입 정의 (`Header.type.ts`)**:
  ```typescript
  export interface HeaderState {
    isVisible: boolean;
    title?: string;
    left?: ReactNode; // <IconButton> 등을 직접 주입
    right?: ReactNode;
    center?: ReactNode; // 타이틀 대신 검색창 등 주입 가능
    transparent?: boolean;
  }
  ```

### 2.2. Footer 모듈 (`components/modules/Footer`)

**특징**: 하단 네비게이션을 관리하며, 단순 링크 이동뿐만 아니라 FAB(Floating Action Button) 등 복잡한 요소도 수용합니다.

- **패턴**: `Compound Pattern` (Footer.Item, Footer.Fab)
- **제어**: `useFooter({ visible, items })`
  - _Note_: 아이템 리스트 자체를 페이지에서 정의해서 넘길 수도 있고, 기본 설정을 오버라이딩할 수도 있습니다.
- **타입 정의 (`Footer.type.ts`)**:
  ```typescript
  export interface FooterState {
    isVisible: boolean;
    items?: FooterItem[]; // 아이콘, 라벨, 뱃지 정보 포함
  }
  ```

---

## 3. 구현 프로세스 (Step-by-Step)

### Step 1: 기본 뼈대 생성 (Skeleton)

- `Header`, `Footer` 폴더 생성 및 `COMPONENT_RULES.md`에 맞춘 빈 파일 생성.
- `index.ts` 배럴 파일 설정.

### Step 2: Context & Hook 구현 (State Layer)

- **`Header.hook.ts`**: `HeaderContext` 생성 및 `useHeader` 훅 구현.
  - _핵심_: 페이지 이동(`unmount`) 시 상태를 초기화하거나 유지하는 전략 수립.
- **`Footer.hook.ts`**: `FooterContext` 생성 및 `useFooter` 훅 구현.

### Step 3: UI 컴포넌트 구현 (View Layer)

- 상태(`ctx`)를 구독하여 UI를 그리는 `Header.tsx`, `Footer.tsx` 구현.
- `AppHeader`와 `BottomNavBar`의 스타일을 참고하되, `Header.style.ts`로 분리하여 `STYLES` 상수로 관리.
- `Left`, `Center`, `Right` / `Item`, `Fab` 등 서브 컴포넌트 구현.

### Step 4: 통합 및 테스트 (Integration)

- `app/test2/layout.tsx`에서 기존 컴포넌트를 제거하고 신규 `HeaderProvider`, `FooterProvider` 적용.
- `app/test2/page.tsx` 등 하위 페이지에서 `useHeader`, `useFooter`를 사용하여 실제 컨텐츠 주입 테스트.

---

## 4. 사용 예시 (Usage)

### 레이아웃 (`layout.tsx`)

```tsx
export default function MobileLayout({ children }) {
  return (
    <HeaderProvider>
      <FooterProvider>
        {/* 껍데기만 배치 (내용은 비어있음) */}
        <Header />
        <main>{children}</main>
        <Footer />
      </FooterProvider>
    </HeaderProvider>
  );
}
```

### 페이지 (`page.tsx`)

```tsx
"use client";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";

export default function MainPage() {
  // 1. 헤더 설정
  useHeader({
    isVisible: true,
    title: "메인 페이지",
    right: <IconButton icon="Bell" />,
  });

  // 2. 푸터 설정
  useFooter({
    isVisible: true,
    items: NAV_ITEMS, // 페이지에서 정의한 메뉴 리스트 주입
  });

  return <div>컨텐츠...</div>;
}
```

---

## 5. 기존 모듈과의 관계

- 기존 `AppHeader`, `BottomNavBar`는 본 계획에 따라 `Header`, `Footer`로 **완전 대체**됩니다.
- 기능 이관 후 기존 폴더는 삭제하거나 `deprecated` 처리합니다.
