"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useFooterState } from './Footer.hook';
import { STYLES } from './Footer.style';
import { FooterProps, FooterItem as FooterItemType } from './Footer.type';

/**
 * Footer Component (Shell)
 * @description A shell component that renders navigation items based on Global Footer Context.
 */
export const Footer = ({ className, ...props }: FooterProps) => {
    const state = useFooterState();
    const pathname = usePathname();

    if (!state.isVisible || !state.items || state.items.length === 0) return null;

    return (
        <nav className={cn(STYLES.container, className)} {...props}>
            {state.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

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
                <Icon className={STYLES.icon} />
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
