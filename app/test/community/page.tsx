"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Pencil, User, Cpu } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { FilterCarousel } from "@/components/modules";
import { MediaCard, SelectableChip, IconButton, AvatarThumbnail, Typography } from "@/components/elements";
import { STYLES as FilterStyles } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { useRouter } from 'next/navigation';

interface Post {
    id: string;
    userId: string;
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
}

const COMMUNITY_FILTERS = [
    { id: "all", label: "전체" },
    { id: "new", label: "NEW" },
    { id: "trending", label: "TRENDING" },
    { id: "hot", label: "HOT" },
];

export default function CommunityPage() {
    const [activeFilter, setActiveFilter] = useState("all");
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
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/community/posts');
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
                            onClick={() => setActiveFilter(filter.id)}
                        />
                    )}
                />
            </div>

            {/* Posts List */}
            <div className="p-4 space-y-6">
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
                        <div key={post.id} className="space-y-3">
                            {/* User Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AvatarThumbnail src={post.user.image || ''} fallback={post.user.name?.[0] || 'U'} size="sm" />
                                    <div className="flex flex-col">
                                        <Typography weight="bold" variant="body2">{post.user.name || '익명 고수'}</Typography>
                                        <Typography variant="caption" className="text-text-tertiary">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </div>
                                </div>
                                <IconButton icon="MoveHorizontal" ariaLabel="더보기" size="sm" />
                            </div>

                            {/* Image Post */}
                            <MediaCard
                                imageUrl={post.imageUrl}
                                title={null}
                                aspectRatio="square"
                                className="bg-surface border-none shadow-none overflow-hidden rounded-2xl"
                                contentClassName="px-0 pt-0"
                                footerLeft={
                                    <div className="flex items-center gap-4 mt-2">
                                        <button className="flex items-center gap-1.5 text-text-secondary active:scale-90 transition-transform">
                                            <Heart className="w-5 h-5" />
                                            <span className="text-sm font-medium">{post._count.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-text-secondary active:scale-90 transition-transform">
                                            <MessageCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">{post._count.comments}</span>
                                        </button>
                                    </div>
                                }
                            />

                            {/* Caption */}
                            <div className="px-1 pb-10">
                                {post.recipeId && (
                                    <div className="mb-2 inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold">
                                        <Cpu size={12} />
                                        <span>먹이 추천으로 만듦</span>
                                    </div>
                                )}
                                <Typography variant="body2" color="primary" className="leading-relaxed font-medium whitespace-pre-wrap">
                                    {post.content}
                                </Typography>
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
