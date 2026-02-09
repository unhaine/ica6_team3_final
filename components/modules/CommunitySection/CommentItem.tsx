"use client";

import { AvatarThumbnail } from "@/components/elements";
import { Comment } from "@/types/community";

interface CommentItemProps {
    comment: Comment;
    onDelete: (commentId: string) => void;
    currentUserId?: string;
}

export function CommentItem({ comment, onDelete, currentUserId }: CommentItemProps) {
    return (
        <div className="flex gap-3">
            <AvatarThumbnail
                src={comment.user.image || ''}
                fallback={comment.user.name?.[0] || 'U'}
                size="sm"
            />
            <div className="flex-1">
                <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{comment.user.name || '알 수 없음'}</span>
                        <span className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    {currentUserId === comment.user.id && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            className="text-xs text-slate-400 hover:text-red-500"
                        >
                            삭제
                        </button>
                    )}
                </div>
                <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
            </div>
        </div>
    );
}
