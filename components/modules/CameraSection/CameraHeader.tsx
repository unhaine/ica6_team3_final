"use client";

import React from "react";
import { ChevronLeft, ArrowLeft, X } from "lucide-react";
import { Typography } from "@/components/elements";
import { cn } from "@/lib/utils";

interface CameraHeaderProps {
    title?: string;
    subtitle?: string;
    onBack?: () => void;
    onClose?: () => void;
    backIcon?: "chevron" | "arrow";
    className?: string;
    variant?: "transparent" | "dark";
}

export const CameraHeader = ({
    title,
    subtitle,
    onBack,
    onClose,
    backIcon = "chevron",
    className,
    variant = "transparent"
}: CameraHeaderProps) => {
    const BackIcon = backIcon === "chevron" ? ChevronLeft : ArrowLeft;

    return (
        <div className={cn(
            "flex items-center justify-between px-4 h-16 z-20 relative shrink-0",
            variant === "dark" ? "bg-black/20 backdrop-blur-md" : "bg-transparent",
            className
        )}>
            {/* Left Slot: Back Button */}
            <div className="flex-1 flex justify-start">
                {onBack && (
                    <button 
                        onClick={onBack} 
                        className="-ml-2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="go back"
                    >
                        <BackIcon className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Center Slot: Title/Info */}
            <div className="flex-2 flex flex-col items-center justify-center text-center">
                {title && (
                    <Typography variant="h4" weight="bold" className="text-white drop-shadow-md text-lg leading-tight">
                        {title}
                    </Typography>
                )}
                {subtitle && (
                    <Typography variant="caption" className="text-white/70">
                        {subtitle}
                    </Typography>
                )}
            </div>

            {/* Right Slot: Close Button */}
            <div className="flex-1 flex justify-end">
                {onClose && (
                    <button 
                        onClick={onClose} 
                        className="-mr-2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        aria-label="close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>
        </div>
    );
};
