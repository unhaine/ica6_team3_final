/** Spinner 스타일 상수 */
export const STYLES = {
    /** 기본 스피너 스타일 */
    spinner: "animate-spin rounded-full",
} as const;

/** 사이즈별 클래스 */
export const SIZE_CLASSES = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
} as const;

/** 색상별 클래스 */
export const COLOR_CLASSES = {
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    white: 'border-white/30 border-t-white',
    inherit: 'border-current/30 border-t-current',
} as const;
