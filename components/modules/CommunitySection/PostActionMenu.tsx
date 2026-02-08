"use client";

import React from "react";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

interface PostActionMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
    triggerClassName?: string;
    align?: "start" | "end" | "center";
}

export const PostActionMenu = ({
    onEdit,
    onDelete,
    className,
    triggerClassName,
    align = "end"
}: PostActionMenuProps) => {
    return (
        <div className={className} onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger className={cn(
                    "p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none",
                    triggerClassName
                )}>
                    <MoreHorizontal size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align={align}>
                    <DropdownMenuItem onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>수정</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>삭제</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
