# 🎨 디자인 토큰 시스템 구축 및 마이그레이션 계획

본 문서는 프로젝트 전반에 디자인 토큰(Design Tokens)을 도입하여 일관된 디자인 시스템과 완벽한 다크 모드를 지원하기 위한 단계별 실행 계획입니다.

## 🎯 목표 (Goal)

1. **하드코딩 색상 제거**: `text-slate-900`, `bg-white` 등 고정된 색상 값을 제거합니다.
2. **Semantic Token 적용**: 역할과 의미에 기반한 토큰(예: `bg-surface`, `text-primary`)을 정의하고 적용합니다.
3. **다크 모드 완벽 지원**: 시스템 테마 설정에 따라 자동으로 색상이 전환되는 구조를 완성합니다.

## 📐 디자인 토큰 구조 (Proposed Token Structure)

Tailwind CSS v4의 `@theme` 기능과 CSS Variables를 활용하여 토큰을 구성합니다.

|      카테고리       | 토큰명 (Token Name)                      | 역할 (Role)                      | 비고 |
| :-----------------: | :--------------------------------------- | :------------------------------- | :--- |
| **배경 (Surface)**  | `bg-background`                          | 페이지 전체 기본 배경            |      |
|                     | `bg-surface`                             | 카드, 모달, 패널 등 컨텐츠 영역  |      |
|                     | `bg-surface-alt`                         | 사이드바, 구분된 영역 (Muted)    |      |
|                     | `bg-surface-active`                      | 호버, 클릭 등 상호작용 상태      |      |
|  **텍스트 (Text)**  | `text-primary`                           | 본문, 제목 (가장 진한 텍스트)    |      |
|                     | `text-secondary`                         | 부제목, 설명 (중간 대비)         |      |
|                     | `text-tertiary`                          | 비활성, 플레이스홀더 (낮은 대비) |      |
|                     | `text-inverse`                           | 반전된 배경 위의 텍스트          |      |
| **테두리 (Border)** | `border-default`                         | 기본 테두리                      |      |
|                     | `border-subtle`                          | 연한 구분선                      |      |
|  **상태 (Status)**  | `bg-primary` / `text-primary-foreground` | 브랜드 메인 컬러                 |      |
|                     | `bg-error` / `text-error-foreground`     | 오류/위험 상태                   |      |

---

## 🚀 실행 단계 (Phases)

### Phase 1: 스타일 토큰 정의 (Foundation Setup)

**목표**: `app/globals.css`에 Semantic Token을 정의하고 Tailwind 설정에 연결합니다.

1.  **CSS 변수 재정비**: `app/globals.css`의 `:root` 및 `.dark` 영역에 위에서 정의한 Semantic Token에 대한 값을 할당합니다 (`oklch` 활용 권장).
2.  **Tailwind Theme 확장**: `@theme inline` 블록 내에 새로운 토큰(예: `--color-surface`)을 연동하여 유틸리티 클래스(`bg-surface`)로 사용할 수 있게 만듭니다.

### Phase 2: 핵심 컴포넌트 리팩토링 (Core Components)

**목표**: `components/elements` 내의 기본 컴포넌트들이 토큰을 사용하도록 수정합니다.

1.  **Typography (`components/elements/Typography`)**:
    - `Typography.style.ts` 내의 색상 매핑을 하드코딩된 Tailwind 클래스에서 Semantic Token(`text-primary` 등)으로 변경합니다.
2.  **ActionCard & ActionButton**:
    - 배경색을 `bg-white` → `bg-surface`로 변경.
    - 테두리색을 `border-slate-xxx` → `border-border`로 변경.
    - 그림자(Shadow) 색상 또한 변수화된 토큰 사용 고려.

### Phase 3: 페이지 및 레이아웃 적용 (Page & Layout Integration)

**목표**: `app/test` 디렉토리 내의 페이지와 레이아웃에 디자인 토큰을 적용하여 실제 동작을 검증합니다.

1.  **레이아웃 (`app/test/layout.tsx`)**:
    - 배경색 `bg-slate-100`을 제거하고 `bg-surface-alt` 또는 `bg-background` 적용.
    - 모바일 셸 컨테이너(`max-w-[480px]`)의 배경을 `bg-surface`로 설정.
2.  **메인 페이지 (`app/test/page.tsx`)**:
    - "AI 추천", 메뉴명 등의 텍스트 색상을 `text-slate-900` → `text-primary`로 교체.
    - 설명 텍스트를 `text-slate-500` → `text-secondary`로 교체.
    - 카드 배경 및 아이콘 컨테이너 색상 토큰화.

### Phase 4: 전체 스캔 및 확장 (Global Audit)

**목표**: 프로젝트 전체에 걸쳐 남아있는 하드코딩된 색상을 찾아 수정합니다.

1.  **코드 검색**: `grep`을 사용하여 주 색상 코드(`slate-`, `gray-`, `white`, `black`)가 직접 사용된 곳을 식별합니다.
2.  **일괄 적용**: 식별된 지점을 적절한 Semantic Token으로 대체합니다.

### Phase 5: 검증 (Verification)

**목표**: 다크 모드 전환 시 UI 깨짐이 없는지 확인합니다.

1.  **테마 토글 테스트**: 라이트 ↔ 다크 모드 반복 전환.
2.  **가독성 확인**: 텍스트 대비(Contrast)가 충분한지 확인.
3.  **일관성 확인**: 페이지 간 배경색 및 톤 앤 매너 일치 여부 점검.
