"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useHeaderState } from './Header.hook';
import { STYLES } from './Header.style';
import { HeaderProps } from './Header.type';

/**
 * Header Component (Shell)
 * @description A shell component that renders content based on Global Header Context.
 */
export const Header = ({ className, ...props }: HeaderProps) => {
    const state = useHeaderState();

    if (!state.isVisible) return null;

    return (
        <header className={cn(STYLES.header(!!state.transparent), className)} {...props}>
            {/* Left Section */}
            <div className={STYLES.leftSection}>
                {state.left}
            </div>

            {/* Center Section */}
            <div className={STYLES.centerSection}>
                {state.center || (state.title && (
                    <h1 className={STYLES.title}>{state.title}</h1>
                ))}
            </div>

            {/* Right Section */}
            <div className={STYLES.rightSection}>
                {state.right}
            </div>
        </header>
    );
};
