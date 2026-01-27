'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { SocialButtonProps, ProviderConfig, SocialProvider } from './SocialButton.type';
import { STYLES, PROVIDER_STYLES } from './SocialButton.style';

/**
 * 소셜 로그인 버튼 컴포넌트
 * @description Google, Kakao, Naver, Apple 로그인을 지원하는 소셜 버튼
 */

// 제공자별 아이콘 정의 (JSX는 컴포넌트 파일에서 관리)
const providerIcons: Record<SocialProvider, React.ReactNode> = {
    google: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    ),
    kakao: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.558 1.707 4.8 4.27 6.054l-.841 3.097c-.102.375.125.753.481.815.115.02.23.003.333-.048l3.633-2.4c.371.05.748.082 1.124.082 4.97 0 9-3.185 9-7.115S16.97 3 12 3z" />
        </svg>
    ),
    naver: (
        <div className="w-5 h-5 flex items-center justify-center font-bold text-xs italic">N</div>
    ),
    apple: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M17.05 2c-.96 0-2.31.54-3.14 1.34-.78.74-1.39 1.9-1.39 3.08 0 .15.02.29.04.42.87-.04 2.15-.6 2.94-1.38.74-.74 1.25-1.74 1.25-2.92 0-.21-.02-.38-.05-.54h-.65zm.3 4.87c-.89 0-1.63.46-2.1.46-.48 0-1.14-.42-1.92-.42-1.02 0-1.96.58-2.48 1.48-.52.92-.52 2.42.06 3.42.28.52.88 1.46 1.74 1.46s1.1-.56 2.16-.56c1.04 0 1.26.54 2.18.54s1.5-.86 1.78-1.38c.64-.94.9-1.88.94-1.94-.02-.02-1.84-.71-1.84-2.82 0-1.78 1.44-2.62 1.52-2.68-.82-1.22-2.08-1.56-3.04-1.56z" />
        </svg>
    ),
};

// 제공자 설정 조합
const getProviderConfig = (provider: SocialProvider): ProviderConfig => ({
    ...PROVIDER_STYLES[provider],
    icon: providerIcons[provider],
});

export const SocialButton = ({ provider, onClick, className }: SocialButtonProps) => {
    const config = getProviderConfig(provider);

    return (
        <button
            onClick={onClick}
            className={cn(
                STYLES.button,
                config.bgColor,
                config.textColor,
                className
            )}
        >
            <span className={STYLES.iconWrapper}>{config.icon}</span>
            <span className={STYLES.textWrapper}>{config.name} 로그인</span>
        </button>
    );
};
