/** ActionButton 스타일 상수 */
export const STYLES = {
    /** 버튼 기본 스타일 */
    button: "relative transition-all duration-200 active:scale-95",
    /** 전체 너비 */
    fullWidth: "w-full",
    /** 로딩 시 텍스트 */
    loadingText: "opacity-80",
    /** 아이콘 마진 */
    iconLeft: "mr-2",
    iconRight: "ml-2",
} as const;

/** 사이즈별 아이콘 크기 */
export const ICON_SIZES = {
    sm: 16,
    default: 20,
    lg: 24,
} as const;
