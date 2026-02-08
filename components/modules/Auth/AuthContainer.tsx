'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AuthContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const AuthContainer = ({ children, className }: AuthContainerProps) => {
    return (
        <main className="-mt-px h-[calc(100dvh-4rem)] bg-white text-slate-900 flex flex-col items-center p-6 relative overflow-hidden border-none! shadow-none! outline-none!">
            <div className={cn(
                "w-full max-w-md space-y-12 mt-8",
                "animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards",
                className
            )}>
                {children}
            </div>
        </main>
    );
};
