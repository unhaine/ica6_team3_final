'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Typography } from '@/components/elements';
import { FridgeIllustration, LoginPanel, BackgroundElements } from '@/components/modules/Landing';
import { useLandingAnimation } from '@/hooks/useLandingAnimation';
import { useHeader } from '@/components/modules/Header/Header.hook';
import { useState } from 'react';

export default function LandingPage() {
    const router = useRouter();
    const { isExpanded, hasAppeared, isWiggling, handleExpand } = useLandingAnimation();
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    useHeader({ isVisible: false });

    const handleSocialLogin = (provider: string) => {
        const callbackUrl = '/onboarding';
        if (['google', 'naver', 'kakao'].includes(provider)) {
            signIn(provider, { callbackUrl });
        }
    };

    const handleEmailLogin = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            router.push('/login');
        }, 500);
    };

    return (
        <main className="h-screen bg-linear-to-br from-primary via-primary/95 to-primary/80 flex flex-col relative overflow-hidden">
            <style jsx global>{`
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-3deg); }
                    75% { transform: rotate(3deg); }
                }
                .animate-wiggle {
                    animation: wiggle 0.4s ease-in-out infinite;
                }
            `}</style>
            
            <BackgroundElements />

            {/* Main Illustration Section */}
            <div 
                className={`flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-10 ${isExpanded
                        ? 'h-[40vh] justify-center scale-90'
                        : 'h-screen justify-center cursor-pointer'
                }`}
                onClick={!isExpanded ? handleExpand : undefined}
            >
                <FridgeIllustration 
                    isExpanded={isExpanded} 
                    hasAppeared={hasAppeared} 
                    isWiggling={isWiggling} 
                />

                {/* Click hint */}
                <div className={`mt-8 transition-opacity duration-300 ${isExpanded ? 'opacity-0 hidden' : 'opacity-100 animate-bounce'}`}>
                    <Typography variant="body2" weight="medium" className="text-white/80">
                        탭하여 시작하기
                    </Typography>
                </div>
            </div>

            <LoginPanel 
                isExpanded={isExpanded} 
                isFullPage={isTransitioning}
                onSocialLogin={handleSocialLogin} 
                onEmailLogin={handleEmailLogin} 
            />
        </main>
    );
}
