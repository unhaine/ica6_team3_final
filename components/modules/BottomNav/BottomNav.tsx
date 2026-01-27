"use client";

import { BottomNavProps } from './BottomNav.types';
import { Icon } from '@/components/elements/Icon';
import { Typography } from '@/components/elements/Typography';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav = ({ className }: BottomNavProps) => {
    const pathname = usePathname();

    const navItems = [
        { label: '홈', icon: 'House', href: '/test' },
        { label: '업로드', icon: 'CirclePlus', href: '/test/upload' },
        { label: '레시피', icon: 'Utensils', href: '/test/recipes' },
    ] as const;

    return (
        <nav 
            className={cn(
                "fixed bottom-0 left-0 z-50 w-full h-16 bg-background/80 backdrop-blur-md border-t flex items-center justify-around px-2 pb-safe",
                className
            )}
        >
            {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/test' && pathname?.startsWith(item.href));
                
                return (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Icon 
                        name={item.icon} 
                        size={24} 
                        strokeWidth={isActive ? 2.5 : 2}
                    />
                    <Typography 
                        variant="caption" 
                        weight={isActive ? "semibold" : "medium"}
                    >
                        {item.label}
                    </Typography>
                </Link>
                );
            })}
        </nav>
    );
};
