"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFooterState } from './Footer.hook';
import { STYLES } from './Footer.style';
import { FooterProps, FooterItem as FooterItemType } from './Footer.type';

import { Home, Refrigerator, MessageSquareHeart, User, HelpCircle } from 'lucide-react';

/**
 * Footer Component (Shell)
 * @description A shell component that renders navigation items based on Global Footer Context.
 */
export const Footer = ({ className, ...props }: FooterProps) => {
    const state = useFooterState();
    const pathname = usePathname();

    // Default Items Fallback (for immediate render before context update)
    const isMainRoute = ['/home', '/inventory', '/community', '/profile'].some(path => pathname?.startsWith(path));
    const items: FooterItemType[] = (state.items && state.items.length > 0) ? state.items : (isMainRoute ? [
        { label: '홈', icon: Home, href: '/home' },
        { label: '냉장고', icon: Refrigerator, href: '/inventory' },
        { label: '커뮤니티', icon: MessageSquareHeart, href: '/community' },
        { label: '프로필', icon: User, href: '/profile' },
    ] : []);

    const isVisibleFallback = ['/home', '/inventory', '/community', '/profile'].some(path => pathname?.startsWith(path));
    const isVisible = state.isVisible ?? isVisibleFallback;

    if (!isVisible) return null;

    return (
        <nav className={cn(STYLES.container, "shrink-0 relative border-t", className)} {...props}>
            {items.map((item) => {
                const isActive = item.href === '/test' 
                    ? pathname === '/test'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                if (item.isFab) {
                    return <FooterFab key={item.href} item={item} />;
                }

                return <FooterItem key={item.href} item={item} isActive={isActive} />;
            })}
        </nav>
    );
};

// --- Sub-components (Internal) ---

const FooterFab = ({ item }: { item: FooterItemType }) => {
    const Icon = item.icon;
    return (
        <div className={STYLES.fabContainer}>
            <Link href={item.href} className={STYLES.fab}>
                <Icon className="h-7 w-7" />
                <span className="sr-only">{item.label}</span>
            </Link>
        </div>
    );
};

const FooterItem = ({ item, isActive }: { item: FooterItemType; isActive: boolean }) => {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            className={STYLES.item(isActive)}
            aria-current={isActive ? "page" : undefined}
        >
            <div className="relative">
                <Icon className={cn(STYLES.icon, isActive && "fill-current stroke-white")} />
                {item.badge && (
                    <span className={STYLES.badge}>
                        {item.badge}
                    </span>
                )}
            </div>
            <span className={STYLES.label}>{item.label}</span>
        </Link>
    );
};
