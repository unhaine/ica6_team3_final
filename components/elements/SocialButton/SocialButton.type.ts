import type { ReactNode } from 'react';

/** 지원하는 소셜 로그인 제공자 */
export type SocialProvider = 'google' | 'kakao' | 'apple' | 'naver';

/** SocialButton 컴포넌트 Props */
export interface SocialButtonProps {
    /** 소셜 로그인 제공자 */
    provider: SocialProvider;
    /** 클릭 핸들러 */
    onClick?: () => void;
    /** 추가 CSS 클래스 */
    className?: string;
}

/** 소셜 제공자 설정 */
export interface ProviderConfig {
    /** 표시 이름 */
    name: string;
    /** 배경색 Tailwind 클래스 */
    bgColor: string;
    /** 텍스트색 Tailwind 클래스 */
    textColor: string;
    /** 아이콘 ReactNode */
    icon: ReactNode;
}
