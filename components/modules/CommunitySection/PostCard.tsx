"use client";

import { Cpu } from "lucide-react";
import { Post } from "@/types/community";
import { useRouter } from "next/navigation";
import { PostUser } from "./PostUser";
import { PostStats } from "./PostStats";
import { PostActionMenu } from "./PostActionMenu";

interface PostCardProps {
    post: Post;
    onLike: (post: Post) => void;
    onDelete: (postId: string) => void;
    currentUserId?: string;
}

export function PostCard({ post, onLike, onDelete, currentUserId }: PostCardProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/community/${post.id}`)}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer active:scale-[0.99] transition-transform"
        >
            {/* Thumbnail */}
            {post.imageUrl ? (
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center text-slate-300">
                    <Cpu size={24} />
                </div>
            )}

            {/* Content Info */}
            <div className="flex-1 flex flex-col justify-between py-0.5 relative">
                <div>
                    <div className="flex justify-between items-start">
                        {post.recipeId ? (
                            <div className="mb-1 inline-flex items-center gap-1 text-[10px] text-primary font-bold">
                                <Cpu size={10} />
                                <span>추천 레시피</span>
                            </div>
                        ) : <div />}

                        {/* Edit/Delete Menu */}
                        {currentUserId === post.userId && (
                            <PostActionMenu 
                                onEdit={() => router.push(`/community/edit/${post.id}`)}
                                onDelete={() => onDelete(post.id)}
                                triggerClassName="-mr-2 -mt-2"
                            />
                        )}
                    </div>
                    <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-1 pr-6">
                        {post.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <PostUser 
                        name={post.user.name || '익명'} 
                        image={post.user.image} 
                    />

                    <PostStats 
                        likeCount={post._count.likes}
                        commentCount={post._count.comments}
                        isLiked={post.isLiked}
                        onLike={(e) => {
                            e.stopPropagation();
                            onLike(post);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
