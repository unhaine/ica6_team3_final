// 색상 상수
export const COLORS = {
  primary: '#10b981',
  primaryLight: '#34d399',
  danger: '#ef4444',
  white: 'white',
} as const;

// 박스 스타일
export const BOX_STYLES = {
  default: {
    stroke: COLORS.primary,
    strokeWidth: 2,
    fill: 'rgba(16, 185, 129, 0.1)',
  },
  selected: {
    stroke: COLORS.primaryLight,
    strokeWidth: 4,
    fill: 'rgba(52, 211, 153, 0.2)',
  },
} as const;

// 라벨 스타일
export const LABEL_STYLES = {
  fontSize: 14,
  padding: 4,
  height: 24,
  offsetY: -26,
  charWidth: 12,
  extraPadding: 30,
  cornerRadius: [4, 4, 4, 0] as [number, number, number, number],
} as const;

// 컨트롤 버튼 스타일
export const CONTROL_STYLES = {
  deleteButton: {
    radius: 10,
    offsetY: -10,
    fontSize: 12,
    textOffsetX: -4,
    textOffsetY: -5,
  },
  resizeHandle: {
    radius: 5,
    strokeWidth: 2,
  },
} as const;

// 컨테이너 CSS 클래스
export const CONTAINER_CLASSNAME = 
  'w-full relative bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-700 flex justify-center touchscreen-manipulation';

export const LOADING_CLASSNAME = 
  'w-full aspect-video bg-muted animate-pulse rounded-xl';

export const GUIDE_OVERLAY_CLASSNAME = 
  'absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 pointer-events-none';
