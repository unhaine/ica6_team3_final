'use client';

import { AppHeaderProps } from './AppHeader.type';
import { IconButton } from '../../elements/IconButton';
import { Typography } from '@/components/elements/Typography';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const AppHeader = ({
    title,
    showBack = false,
    onBack,
    rightAction,
    transparent = false,
    className,
}: AppHeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <header 
            className={cn(
                "sticky top-0 z-50 w-full flex items-center justify-between px-4 h-16 transition-all",
                transparent ? "bg-transparent" : "bg-background/80 backdrop-blur-md ",
                className
            )}
        >
            <div className="flex items-center gap-2 min-w-10">
                {showBack && (
                    <IconButton
                        icon="ChevronLeft"
                        variant="ghost"
                        onClick={handleBack}
                        ariaLabel="뒤로 가기"
                    />
                )}
            </div>

            <div className="flex-1 flex justify-center overflow-hidden">
                {title && (
                <Typography variant="subtitle1" weight="semibold" className="truncate">{title}</Typography>
                )}
                {!title && (
                    <div className="flex items-center gap-1.5">
                        <Typography variant="h4" weight="black" color="primary" className="tracking-tighter italic">냉파고수
                        </Typography>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-end min-w-10">
                {rightAction}
            </div>
        </header>
    );
};
