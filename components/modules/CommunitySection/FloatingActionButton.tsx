"use client";

import { LucideIcon } from "lucide-react";

interface FloatingActionButtonProps {
    icon: LucideIcon;
    onClick: () => void;
    ariaLabel: string;
    className?: string;
    colorClass?: string;
    borderColorClass?: string;
}

export const FloatingActionButton = ({
    icon: Icon,
    onClick,
    ariaLabel,
    className = "",
    colorClass = "bg-purple-600",
    borderColorClass = "border-purple-600"
}: FloatingActionButtonProps) => {
    return (
        <div className={`absolute bottom-8 right-5 z-50 ${className}`}>
            <button
                onClick={onClick}
                className="group relative flex items-center justify-center transition-transform active:scale-95 shadow-xl rounded-full"
                aria-label={ariaLabel}
            >
                {/* Outer Ring */}
                <div className={`w-14 h-14 rounded-full border-2 bg-white flex items-center justify-center ${borderColorClass}`}>
                    {/* Inner Circle */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${colorClass}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </button>
        </div>
    );
};
