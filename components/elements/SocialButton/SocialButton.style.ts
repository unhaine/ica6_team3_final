import type { ProviderConfig } from './SocialButton.type';

/** 버튼 기본 스타일 */
export const STYLES = {
    button: 'flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] shadow-lg hover:shadow-xl',
    iconWrapper: 'shrink-0',
    textWrapper: 'grow text-center',
} as const;

/** 소셜 제공자별 아이콘 (JSX는 컴포넌트에서 정의) */
export const PROVIDER_STYLES: Record<string, Omit<ProviderConfig, 'icon'>> = {
    google: {
        name: 'Google',
        bgColor: 'bg-white',
        textColor: 'text-gray-700',
    },
    kakao: {
        name: '카카오톡',
        bgColor: 'bg-[#FEE500]',
        textColor: 'text-[#191919]',
    },
    naver: {
        name: '네이버',
        bgColor: 'bg-[#03C75A]',
        textColor: 'text-white',
    },
    apple: {
        name: 'Apple',
        bgColor: 'bg-black',
        textColor: 'text-white',
    },
} as const;
