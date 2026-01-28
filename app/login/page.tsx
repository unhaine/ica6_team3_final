'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SocialButton } from '@/components/elements/SocialButton';
import { Typography } from '@/components/elements/Typography';

export default function LoginPage() {
    const router = useRouter();

    const handleSocialLogin = async (provider: string) => {
        if (provider === 'google') {
            await signIn('google', { callbackUrl: '/onboarding' });
        } else if (provider === 'naver') {
            await signIn('naver', { callbackUrl: '/onboarding' });
        } else if (provider === 'kakao') {
            await signIn('kakao', { callbackUrl: '/onboarding' });
        } else {
            router.push('/onboarding');
        }
    };

    const handleGuestLogin = () => {
        router.push('/home');
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center p-6 pt-20 relative">
            <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Logo & Header section - matching /test/page.tsx mood */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-24">
                    <Typography variant="h2" weight="black" color="primary" className="tracking-tighter italic">
                    냉장고양이
                    </Typography>
                    </div>
                </div>

                {/* Login Container */}
                <div className="space-y-8 bg-transparent">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <SocialButton provider="kakao" onClick={() => handleSocialLogin('kakao')} />
                            <SocialButton provider="naver" onClick={() => handleSocialLogin('naver')} />
                            <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
                            
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-100"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-400 font-medium tracking-wider">또는 이메일로 시작하기</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push('/login/email')}
                                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-300 border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-700 shadow-sm"
                            >
                                <span className="grow text-center">이메일 로그인</span>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 text-center">
                        <button 
                            onClick={() => router.push('/login/signup')}
                            className="text-sm text-slate-500 hover:text-primary transition-colors duration-200"
                        >
                            계정이 없으신가요? <span className="font-bold underline decoration-primary/30 underline-offset-4">회원가입</span>
                        </button>
                        
                        <div className="pt-2">
                            <button
                                onClick={handleGuestLogin}
                                className="w-full py-2 text-slate-400 hover:text-primary text-[13px] font-medium transition-colors duration-200 border-none bg-transparent"
                            >
                                둘러보기 (게스트 접속)
                            </button>
                        </div>
                    </div>
                </div>
                {/* Footer info - simple and clean */}
                <footer className="pt-20 text-center space-y-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                        Powered by AI Technology
                    </p>
                    <div className="flex justify-center gap-6 text-[11px] text-slate-400 font-medium">
                        <a href="#" className="hover:underline">이용약관</a>
                        <a href="#" className="hover:underline">개인정보처리방침</a>
                    </div>
                </footer>
            </div>
        </main>
    );
}
