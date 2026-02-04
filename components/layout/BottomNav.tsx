'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';

const navItems = [
    { name: '홈', icon: 'Home', path: '/' },
    { name: '냉장고', icon: 'Refrigerator', path: '/inventory' },
    { name: '커뮤니티', icon: 'Users', path: '/community' },
    { name: '프로필', icon: 'User', path: '/profile' },
];

export const BottomNav = () => {
    const pathname = usePathname();
    const router = useRouter();

    // 특정 페이지(로그인 등)에서는 네비게이션을 숨길 수 있음
    const hideNavPaths = ['/login', '/onboarding', '/', '/test'];
    if (hideNavPaths.some(path => pathname === path || (path !== '/' && pathname?.startsWith(path)))) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            {/* Bottom Nav Bar */}
            <nav className="bg-white/80 backdrop-blur-lg border-t border-slate-200 px-6 py-2 flex justify-between items-center pb-safe-area-inset-bottom">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));

                    return (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Icon name={item.icon as any} size={24} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
