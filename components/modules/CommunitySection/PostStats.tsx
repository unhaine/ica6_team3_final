"use client";

import React from "react";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostStatsProps {
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    onLike: (e: React.MouseEvent) => void;
    onComment?: (e: React.MouseEvent) => void;
    size?: "sm" | "md";
    className?: string;
}

export const PostStats = ({
    likeCount,
    commentCount,
    isLiked,
    onLike,
    onComment,
    size = "sm",
    className
}: PostStatsProps) => {
    const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-6 h-6";
    const textSize = size === "sm" ? "text-xs" : "text-sm font-medium";
    const gap = size === "sm" ? "gap-3" : "gap-4";

    return (
        <div className={cn("flex items-center text-slate-400", gap, className)}>
            <button
                onClick={onLike}
                className={cn(
                    "flex items-center gap-1.5 active:scale-90 transition-transform",
                    isLiked ? "text-red-500" : "hover:text-red-500",
                    textSize
                )}
            >
                <Heart className={cn(iconSize, isLiked && "fill-current")} />
                <span>{likeCount}</span>
            </button>
            <div 
                className={cn("flex items-center gap-1.5", textSize)}
                onClick={onComment}
            >
                <MessageCircle className={iconSize} />
                <span>{commentCount}</span>
            </div>
        </div>
    );
};
