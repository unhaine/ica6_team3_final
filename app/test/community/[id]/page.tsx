"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, User, Cpu, ArrowLeft } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { AvatarThumbnail, Typography } from "@/components/elements";
import { useRouter, useParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
}

interface Post {
    id: string;
    userId: string;
    title: string;
    content: string;
    imageUrl: string;
    createdAt: string;
    recipeId: string | null;
    user: {
        name: string | null;
        image: string | null;
        isFollowing?: boolean;
    };
    recipe?: {
        ckgNm: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    isLiked: boolean;
}

export default function PostDetailPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const params = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    // Interaction State
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useHeader({ isVisible: false });
    useFooter({ isVisible: false });

    useEffect(() => {
        if (params?.id) {
            fetchPost(params.id as string);
        }
    }, [params]);

    const fetchPost = async (id: string) => {
        try {
            const response = await fetch(`/api/community/posts/${id}`);
            const data = await response.json();
            if (data.success) {
                setPost(data.data);
                setIsLiked(data.data.isLiked);
                setLikeCount(data.data._count.likes);
                setIsFollowing(data.data.user.isFollowing || false);
                fetchComments(id);
            } else {
                toast.error("게시글을 찾을 수 없습니다.");
                router.back();
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
            toast.error("오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!session) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        if (!post) return;

        const prevFollowing = isFollowing;
        setIsFollowing(!prevFollowing); // Optimistic

        try {
            const res = await fetch(`/api/users/${post.userId}/follow`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            setIsFollowing(prevFollowing); // Revert
            toast.error("팔로우 처리 중 오류가 발생했습니다.");
        }
    };

    // ... (keep fetchComments, handleLike, handleSubmitComment, handleDeleteComment, handleDelete) ...

    const fetchComments = async (id: string) => {
        try {
            const res = await fetch(`/api/community/posts/${id}/comments`);
            const data = await res.json();
            if (data.success) {
                setComments(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleLike = async () => { /* ... existing code ... */
        if (!session) {
            toast.error("로그인이 필요합니다.");
            return;
        }
        // ...
        const prevLiked = isLiked;
        const prevCount = likeCount;

        setIsLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            const res = await fetch(`/api/community/posts/${post!.id}/like`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error("오류가 발생했습니다.");
        }
    };

    // ... (rest of the functions) ...
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !session) return;

        setSubmittingComment(true);
        try {
            const res = await fetch(`/api/community/posts/${post!.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });
            const data = await res.json();

            if (data.success) {
                setComments(prev => [...prev, data.data]);
                setCommentText("");
            }
        } catch (error) {
            console.error(error);
            toast.error("댓글 등록 실패");
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            const res = await fetch(`/api/community/comments/${commentId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setComments(prev => prev.filter(c => c.id !== commentId));
                toast.success("댓글이 삭제되었습니다.");
            }
        } catch (error) {
            console.error(error);
            toast.error("삭제 실패");
        }
    };

    const handleDelete = async () => {
        if (!post) return;
        if (!confirm('정말로 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/community/posts/${post.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('게시글이 삭제되었습니다.');
                window.location.href = '/test/community';
            } else {
                toast.error('삭제 실패');
            }
        } catch (error) {
            console.error(error);
            toast.error('오류가 발생했습니다.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full">로딩 중...</div>;
    if (!post) return null;

    const isMe = session?.user?.id === post.userId;

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* ... Header ... */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-4 h-[60px]">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-2">
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pt-[80px] px-0 pb-20 scrollbar-hide">
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

                        {/* User Info & Follow Button */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <AvatarThumbnail src={post.user.image || ''} fallback={post.user.name?.[0] || 'U'} size="sm" />
                                    <div className="flex flex-col">
                                        <Typography weight="bold" variant="body2">{post.user.name || '익명 고수'}</Typography>
                                        <Typography variant="caption" className="text-text-tertiary">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </div>

                                {!isMe && session && (
                                    <button
                                        onClick={handleFollow}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isFollowing
                                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                                : 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            }`}
                                    >
                                        {isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                )}
                            </div>


                            {/* Edit/Delete Menu (Previously in Header) */}
                            {session?.user?.id === post.userId && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors outline-none">
                                        <MoreHorizontal size={20} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => router.push(`/test/community/edit/${post.id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>수정</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>삭제</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-4" />

                    {/* HTML Content */}
                    <div className="px-4 py-4">
                        <div
                            className="prose prose-sm max-w-none text-text-primary [&>img]:rounded-xl [&>img]:my-4 [&>p]:mb-2"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>

                {/* Comments / Likes (Placeholder functional area) */}
                {/* Comments / Likes Section */}
                <div className="bg-white border-t border-slate-100 pb-20">
                    <div className="px-4 py-4 flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1.5 active:scale-90 transition-transform ${isLiked ? 'text-red-500' : 'text-text-secondary hover:text-red-500'}`}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-text-secondary">
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-sm font-medium">{comments.length}</span>
                        </button>
                    </div>

                    {/* Comment List */}
                    <div className="px-4 space-y-6 mb-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
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
                                        {session?.user?.id === comment.user.id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-xs text-slate-400 hover:text-red-500"
                                            >
                                                삭제
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comment Input Fixed Bottom */}
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
