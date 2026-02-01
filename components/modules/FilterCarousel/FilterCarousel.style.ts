export const STYLES = {
  /** 상단 고정 필터 바의 기본 래퍼 스타일 (높이 및 정렬 통일) */
  stickySection: "shrink-0 z-10 bg-surface/80 backdrop-blur-md border-b border-border h-14 flex items-center",
  /** 스크롤바 숨김 및 가로 스크롤 설정 */
  container: "flex w-full overflow-x-auto scrollbar-hide snap-x",
  /** 내부 컨텐츠 여백 및 간격 - 화면 끝에서 16px(px-4) 지점에서 시작 */
  content: "flex gap-2 px-4 items-center",
} as const;
