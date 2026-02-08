# UI 컴포넌트 사용 현황 및 정리 분석 (2026-02-07)

`components/ui` 디렉토리 내의 Shadcn UI 기반 컴포넌트들에 대한 사용 현황 분석 결과입니다.

## 1. 전무하게 사용되지 않는 컴포넌트 (삭제 권장)

프로젝트 내에서 단 한 번도 호출되지 않는 컴포넌트들입니다. 프로젝트 경량화를 위해 삭제를 고려할 수 있습니다.

- `AspectRatio`
- `CarouselView`
- `Collapsible`
- `Drawer`

## 2. Playground(테스트용)에서만 사용 중인 컴포넌트

현재 실제 서비스 페이지에서는 사용되지 않지만, `app/playground/page.tsx`에서 참조되고 있습니다. 디자인 시스템 확장을 위해 남겨둘 수 있습니다.

- `Alert`
- `Badge` (Elements `Tag`에서 내부적으로 사용)
- `Checkbox`
- `Label`
- `RadioGroup`
- `Select`
- `Separator`
- `Skeleton`
- `Tabs`

## 3. 실제 앱 서비스에서 활발히 사용 중인 핵심 컴포넌트

다른 모듈이나 실제 기능 페이지에서 필수적으로 사용되고 있는 컴포넌트들입니다.

- `Button`: 거의 모든 인터랙션 요소의 기초 (`ActionButton` 포함)
- `Card`: 정보 레이아웃의 기초 (`ActionCard` 포함)
- `Input`: 데이터 입력 및 수정 모달
- `DropdownMenu`: 커뮤니티 게시글 관리 메뉴 등
- `Popover`: 에디터 도구 및 안내문
- `Progress`: 로딩 및 진행도 표시 (`ProgressBar` 포함)

---

_참고: 이 분석은 `grep` 검색 결과를 바탕으로 작성되었습니다._
