"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Pencil, User, Cpu } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { FilterCarousel } from "@/components/modules";
import { MediaCard, SelectableChip, IconButton, AvatarThumbnail, Typography } from "@/components/elements";
import { STYLES as FilterStyles } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

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
    };
    recipe?: {
        ckgNm: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
    isLiked: boolean; // Added isLiked
}

const COMMUNITY_FILTERS = [
    { id: "all", label: "All" },
    { id: "new", label: "New ✨" },
    { id: "hot", label: "Hot 🔥" },
    { id: "following", label: "Following 🤝" },
];

export default function CommunityPage() {
    const { data: session } = useSession(); // Session for ownership check
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState("all");

    const handleDelete = async (postId: string) => {
        if (!confirm('정말로 삭제하시겠습니까?')) return;

        try {
            const res = await fetch(`/api/community/posts/${postId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('게시글이 삭제되었습니다.');
                // Optimistic update or refetch
                setPosts(prev => prev.filter(p => p.id !== postId));
            } else {
                toast.error('삭제 실패');
            }
        } catch (error) {
            console.error(error);
            toast.error('오류가 발생했습니다.');
        }
    };

    const handleLike = async (post: Post) => {
        if (!session) {
            toast.error("로그인이 필요합니다.");
            return;
        }

        // Optimistic UI interaction
        const prevLiked = post.isLiked;
        const prevCount = post._count.likes;

        // Update local state immediately
        setPosts(prev => prev.map(p => {
            if (p.id === post.id) {
                return {
                    ...p,
                    isLiked: !prevLiked,
                    _count: {
                        ...p._count,
                        likes: prevLiked ? prevCount - 1 : prevCount + 1
                    }
                };
            }
            return p;
        }));

        try {
            const res = await fetch(`/api/community/posts/${post.id}/like`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error();
        } catch (error) {
            // Revert on error
            setPosts(prev => prev.map(p => {
                if (p.id === post.id) {
                    return {
                        ...p,
                        isLiked: prevLiked,
                        _count: {
                            ...p._count,
                            likes: prevCount
                        }
                    };
                }
                return p;
            }));
            toast.error("오류가 발생했습니다.");
        }
    };
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useHeader({
        isVisible: true,
        title: "커뮤니티",
        right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
    });

    useFooter({
        isVisible: true,
    });

    useEffect(() => {
        fetchPosts();
    }, [activeFilter]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/community/posts?sort=${activeFilter}`);
            const data = await response.json();
            if (data.success) {
                setPosts(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-20 scrollbar-hide">
            {/* Filter Section */}
            <div className={FilterStyles.stickySection}>
                <FilterCarousel
                    data={COMMUNITY_FILTERS}
                    keyExtractor={(it) => it.id}
                    renderItem={(filter) => (
                        <SelectableChip
                            label={filter.label}
                            selected={activeFilter === filter.id}
                            onClick={() => {
                                if (filter.id === 'following' && !session) {
                                    toast.error("로그인이 필요합니다.");
                                    return;
                                }
                                setActiveFilter(filter.id);
                            }}
                        />
                    )}
                />
            </div>

            {/* Posts List */}
            <div className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-text-secondary">피드를 불러오는 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-surface rounded-3xl border border-border shadow-sm">
                        <p className="text-text-secondary mb-4">아직 올라온 소식이 없어요.</p>
                        <button
                            onClick={() => window.location.href = '/test/community/create'}
                            className="text-primary font-medium hover:underline"
                        >
                            첫 소식 전하기
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => router.push(`/test/community/${post.id}`)}
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
                                        ) : <div></div>}

                                        {/* Edit/Delete Menu */}
                                        {session?.user?.id === post.userId && (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="p-1 -mr-2 -mt-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors outline-none">
                                                        <MoreHorizontal size={20} />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => router.push(`/test/community/edit/${post.id}`)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>수정</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>삭제</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight mb-1 pr-6">
                                        {post.title}
                                    </h3>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <AvatarThumbnail src={post.user.image || ''} fallback={post.user.name?.[0] || 'U'} size="sm" />
                                        <Typography variant="caption" className="text-text-tertiary text-xs">
                                            {post.user.name || '익명'}
                                        </Typography>
                                    </div>

                                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(post);
                                            }}
                                            className={`flex items-center gap-1 active:scale-90 transition-transform ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                                            <span>{post._count.likes}</span>
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            <span>{post._count.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => window.location.href = '/test/community/create'}
                className="absolute bottom-6 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 border-2 border-white z-100"
                aria-label="게시글 작성"
            >
                <Pencil className="w-6 h-6" />
            </button>
        </div>
    );
}
