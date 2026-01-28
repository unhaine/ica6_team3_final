"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { AppHeader } from '@/components/modules/AppHeader';
import { BottomNav } from '@/components/modules/BottomNav';
import { Typography } from '@/components/elements/Typography';
import { Icon } from '@/components/elements/Icon';
import Image from 'next/image';
import { IconButton } from '@/components/elements/IconButton';

import { useSession, signOut } from 'next-auth/react';

export default function TestHomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setTheme, theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix: Avoid calling setState synchronously in useEffect to prevent cascading renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <main className="flex flex-col min-h-screen bg-background pb-20">
      <AppHeader 
        title="홈" 
        showLogout={true}
        rightAction={
            <IconButton 
                icon="Settings"
                variant="ghost"
                onClick={() => toast.info('설정 메뉴는 아직 준비 중입니다.')} 
                ariaLabel="설정"
            />
        }
      />

      <div className="flex-1 flex flex-col p-4 gap-6 overflow-y-auto">
        {/* Welcome Section */}
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <Image 
                        src={session?.user?.image || "/rat.png"} 
                        alt="User" 
                        fill 
                        className="object-cover" 
                    />
                </div>
                <div>
                    <Typography variant="h3" weight="bold">
                        {session?.user?.name ? `${session.user.name} 셰프님!` : '안녕하세요, 셰프님!'}
                    </Typography>
                    <Typography variant="body2" color="muted">오늘도 맛있는 요리를 만들어보세요.</Typography>
                </div>
            </div>
            
            {session ? (
                <button 
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors flex flex-col items-center gap-1"
                >
                    <Icon name="LogOut" size={20} />
                    <span className="text-[10px] font-bold">로그아웃</span>
                </button>
            ) : (
                <button 
                    onClick={() => router.push('/login')}
                    className="p-2 text-primary hover:text-primary/80 transition-colors flex flex-col items-center gap-1"
                >
                    <Icon name="LogIn" size={20} />
                    <span className="text-[10px] font-bold">로그인</span>
                </button>
            )}
        </div>

        {/* Feature: Theme Toggle */}
        <section className="space-y-3">
            <Typography variant="subtitle1" weight="bold">앱 설정 (테스트)</Typography>
            <div className="p-4 rounded-xl bg-card border shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name={currentTheme === 'dark' ? 'Moon' : 'Sun'} className="text-primary" />
                        <Typography>다크 모드</Typography>
                    </div>
                    {mounted && (
                        <div className="flex bg-muted p-1 rounded-lg">
                            {['light', 'system', 'dark'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t)}
                                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                                        theme === t 
                                        ? 'bg-background shadow text-primary font-bold' 
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {t === 'light' ? 'Light' : t === 'dark' ? 'Dark' : 'Auto'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                     <Typography>알림 테스트</Typography>
                     <div className="flex gap-2">
                        <button 
                            onClick={() => toast.success('성공적으로 저장되었습니다!')}
                            className="px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-600 rounded-md font-medium hover:bg-emerald-500/20"
                        >
                            Success
                        </button>
                        <button 
                            onClick={() => toast.error('문제가 발생했습니다.')}
                            className="px-3 py-1.5 text-xs bg-red-500/10 text-red-600 rounded-md font-medium hover:bg-red-500/20"
                        >
                            Error
                        </button>
                     </div>
                </div>
            </div>
        </section>

      </div>

      <BottomNav />
    </main>
  );
}
