"use client";

import React from "react";
import { AvatarThumbnail, Typography } from "@/components/elements";
import { cn } from "@/lib/utils";

interface PostUserProps {
    name: string;
    image?: string | null;
    caption?: string;
    onFollow?: () => void;
    isFollowing?: boolean;
    showFollowButton?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export const PostUser = ({
    name,
    image,
    caption,
    onFollow,
    isFollowing,
    showFollowButton = false,
    size = "sm",
    className
}: PostUserProps) => {
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="flex items-center gap-2">
                <AvatarThumbnail 
                    src={image || ''} 
                    fallback={name?.[0] || 'U'} 
                    size={size === "sm" ? "sm" : "md"} 
                />
                <div className="flex flex-col">
                    <Typography 
                        weight="bold" 
                        variant={size === "sm" ? "caption" : "body2"}
                        className={size === "sm" ? "text-slate-900" : ""}
                    >
                        {name || '익명'}
                    </Typography>
                    {caption && (
                        <Typography variant="caption" className="text-text-tertiary text-[10px] leading-tight">
                            {caption}
                        </Typography>
                    )}
                </div>
            </div>

            {showFollowButton && onFollow && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onFollow();
                    }}
                    className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold transition-all ml-4",
                        isFollowing
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : "bg-emerald-500 text-white hover:bg-emerald-600"
                    )}
                >
                    {isFollowing ? '팔로잉' : '팔로우'}
                </button>
            )}
        </div>
    );
};
