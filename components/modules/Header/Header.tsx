"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHeaderState } from './Header.hook';
import { STYLES } from './Header.style';
import { HeaderProps } from './Header.type';
import { IconButton } from '@/components/elements';

/**
 * Header Component (Shell)
 * @description A shell component that renders content based on Global Header Context.
 */
export const Header = ({ className, ...props }: HeaderProps) => {
    const state = useHeaderState();
    const pathname = usePathname();

    // Fallback logic for instant render on known paths (avoiding effect delay)
    const isHome = pathname === '/home';
    const isMainRoute = ['/home', '/inventory', '/community', '/profile'].some(path => pathname === path || pathname?.startsWith(path + '/'));
    const isVisible = state.isVisible || isMainRoute;
    
    // Default Content for instant render on known paths
    const centerContent = state.center || (isHome && (
        <div>
        </div>
    ));
    
    const rightContent = state.right || (isHome && (
        <div>
        </div>
    ));

    if (!isVisible) return null;

    return (
        <header className={cn(STYLES.header(!!state.transparent), "shrink-0", className)} {...props}>
            {/* Left Section */}
            <div className={STYLES.leftSection}>
                {state.left}
            </div>

            {/* Center Section */}
            <div className={STYLES.centerSection}>
                {centerContent || (state.title && (
                    <h1 className={STYLES.title}>{state.title}</h1>
                ))}
            </div>

            {/* Right Section */}
            <div className={STYLES.rightSection}>
                {rightContent}
            </div>
        </header>
    );
};
