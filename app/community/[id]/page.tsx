"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { AvatarThumbnail, IconButton } from "@/components/elements";
import { useRouter, useParams } from 'next/navigation';
import { Cpu } from "lucide-react";
import { PostUser, PostStats, PostActionMenu, CommentItem } from "@/components/modules/CommunitySection";
import { usePostDetail } from "@/hooks/usePostDetail";

export default function PostDetailPage() {
    const router = useRouter();
    const params = useParams();
    const {
        post,
        loading,
        isLiked,
        likeCount,
        comments,
        commentText,
        setCommentText,
        submittingComment,
        isFollowing,
        session,
        handleSubmitComment,
        handleDeleteComment,
        onLike,
        onFollow,
        handleDelete
    } = usePostDetail(params?.id as string);

    useHeader({
        isVisible: true,
        title: "커뮤니티",
        left: (
            <IconButton
                icon="ChevronLeft"
                variant="ghost"
                onClick={() => router.back()}
                ariaLabel="뒤로가기"
            />
        ),
        right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
    });
    useFooter({ isVisible: false });

    if (loading) return <div className="flex justify-center items-center h-full">로딩 중...</div>;
    if (!post) return null;

    const isMe = session?.user?.id === post.userId;

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <main className="flex-1 overflow-y-auto px-0 pb-20 scrollbar-hide">
                <div className="bg-white pb-8">
                    <div className="px-4 py-4">
                        {post.recipeId && (
                            <div className="mb-3 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                                <Cpu size={12} />
                                <span>먹이 추천으로 만듦</span>
                            </div>
                        )}
                        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center justify-between">
                            <PostUser 
                                name={post.user.name || '익명 고수'} 
                                image={post.user.image}
                                caption={new Date(post.createdAt).toLocaleDateString()}
                                size="md"
                                showFollowButton={!isMe && !!session}
                                isFollowing={isFollowing}
                                onFollow={onFollow}
                                className="flex-1"
                            />

                            {isMe && (
                                <PostActionMenu 
                                    onEdit={() => router.push(`/community/edit/${post.id}`)}
                                    onDelete={() => handleDelete(post.id, () => router.push('/community'))}
                                    className="ml-2"
                                />
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-4" />

                    <div className="px-4 py-4">
                        <div
                            className="prose prose-sm max-w-none text-text-primary [&>img]:rounded-xl [&>img]:my-4 [&>p]:mb-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                <div className="bg-white border-t border-slate-100 pb-20">
                    <div className="px-4 py-4">
                        <PostStats 
                            likeCount={likeCount}
                            commentCount={comments.length}
                            isLiked={isLiked}
                            onLike={onLike}
                            size="md"
                        />
                    </div>

                    <div className="px-4 space-y-6 mb-4">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onDelete={handleDeleteComment}
                                currentUserId={session?.user?.id}
                            />
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex items-center gap-2 z-40 w-full">
                    <AvatarThumbnail
                        src={session?.user?.image || ''}
                        fallback={session?.user?.name?.[0] || 'U'}
                        size="sm"
                    />
                    <form onSubmit={handleSubmitComment} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={session ? "댓글 달기..." : "로그인이 필요합니다"}
                            disabled={!session || submittingComment}
                            className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none"
                        />
                        {commentText.trim() && (
                            <button
                                type="submit"
                                disabled={submittingComment}
                                className="text-emerald-500 font-bold text-sm px-2"
                            >
                                게시
                            </button>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );
}
