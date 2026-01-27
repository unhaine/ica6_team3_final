'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { SocialButton } from '@/components/elements/SocialButton';
import { Typography } from '@/components/elements/Typography';

export default function LoginPage() {
    const router = useRouter();

    const handleSocialLogin = async (provider: string) => {
        console.log(`${provider} login clicked`);
            if (provider === 'google') {
            await signIn('google', { callbackUrl: '/test' });
        } else {
            // 카카오, 네이버 등은 추가 설정 후 연동 가능
            router.push('/test');
        }
    };

    const handleGuestLogin = () => {
        router.push('/test');
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center p-6 pt-20 relative">
            <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Logo & Header section - matching /test/page.tsx mood */}
                <div className="text-center space-y-3">
                    <div className="flex justify-center mb-24">
                    <Typography variant="h2" weight="black" color="primary" className="tracking-tighter italic">
                    냉! 파! 고! 수!
                    </Typography>
                    </div>
                </div>

                {/* Login Container - Removed borders and shadows as requested */}
                <div className="space-y-8 bg-transparent">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <SocialButton provider="kakao" onClick={() => handleSocialLogin('kakao')} />
                            <SocialButton provider="naver" onClick={() => handleSocialLogin('naver')} />
                            <SocialButton provider="google" onClick={() => handleSocialLogin('google')} />
                        </div>
                    </div>

                    {/* Guest login action */}
                    <div className="pt-4">
                        <button
                            onClick={handleGuestLogin}
                            className="w-full py-3 text-slate-400 hover:text-primary text-sm font-medium transition-colors duration-200 border-none bg-transparent"
                        >
                            둘러보기 (게스트 접속)
                        </button>
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
