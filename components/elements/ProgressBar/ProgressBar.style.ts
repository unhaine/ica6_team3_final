/** ProgressBar 스타일 상수 */
export const STYLES = {
    /** 컨테이너 */
    container: "space-y-2",
    /** 라벨 영역 */
    labelContainer: "flex justify-between items-center",
    /** 프로그래스 바 높이 */
    progress: "h-2",
} as const;

/** variant별 프로그레스 바 색상 */
export const VARIANT_STYLES = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-yellow-500",
    gradient: "bg-gradient-to-r from-primary to-purple-500",
} as const;
