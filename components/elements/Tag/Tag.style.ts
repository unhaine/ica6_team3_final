/** Tag 스타일 상수 */
export const STYLES = {
    /** 기본 태그 스타일 */
    tag: "font-medium rounded-full flex items-center gap-1 transition-colors",
    /** 삭제 버튼 */
    removeButton: "ml-1 hover:text-foreground/80 focus:outline-none",
} as const;

/** 사이즈별 클래스 */
export const SIZE_CLASSES = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
} as const;

/** Variant별 클래스 */
export const VARIANT_CLASSES = {
    default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    owned: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    missing: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    primary: 'bg-primary text-primary-foreground',
    outline: 'border-border text-muted-foreground bg-transparent',
} as const;

/** 사이즈별 아이콘 크기 */
export const ICON_SIZES = {
    sm: 10,
    md: 14,
    lg: 16,
} as const;
