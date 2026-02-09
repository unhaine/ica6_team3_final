'use client';

import React from 'react';
import { SocialButton, ActionButton, Typography } from '@/components/elements';

interface LoginPanelProps {
    isExpanded: boolean;
    isFullPage?: boolean;
    onSocialLogin: (provider: string) => void;
    onEmailLogin: () => void;
}

export const LoginPanel = ({ isExpanded, isFullPage, onSocialLogin, onEmailLogin }: LoginPanelProps) => {
    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white px-6 py-8 transition-all duration-500 ease-in-out z-20 flex flex-col ${
            isFullPage ? 'h-screen rounded-none' : 'h-[65vh] rounded-t-[2.5rem]'
        } ${
            isExpanded || isFullPage
                ? 'translate-y-0' 
                : 'translate-y-full'
        }`}>
            <div className={`w-full max-w-md mx-auto space-y-4 flex-1 flex flex-col justify-start pt-2 transition-all duration-300 ${
                isFullPage ? 'opacity-0 translate-y-8' : 'opacity-100'
            }`}>
                <SocialButton provider="kakao" onClick={() => onSocialLogin('kakao')} />
                <SocialButton provider="naver" onClick={() => onSocialLogin('naver')} />
                <SocialButton provider="google" onClick={() => onSocialLogin('google')} />
                
                {/* Divider */}
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-300"></span>
                    </div>
                    <div className="relative flex justify-center">
                        <Typography variant="caption" weight="medium" className="bg-white px-3 text-slate-500">
                            또는
                        </Typography>
                    </div>
                </div>

                {/* Email Login */}
                <ActionButton
                    onClick={onEmailLogin}
                    fullWidth
                    className="h-12 rounded-2xl font-bold text-base shadow-lg shadow-purple-600/20 bg-purple-600 text-white hover:bg-purple-700"
                >
                    이메일 로그인
                </ActionButton>
            </div>
        </div>
    );
};
