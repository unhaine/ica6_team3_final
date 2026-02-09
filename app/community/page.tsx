"use client";

import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { FilterCarousel } from "@/components/modules";
import { SelectableChip, IconButton } from "@/components/elements";
import { STYLES as FilterStyles } from "@/components/modules/FilterCarousel/FilterCarousel.style";
import { toast } from "sonner";
import { Post, COMMUNITY_FILTERS } from "@/types/community";
import { useCommunity } from "@/hooks/useCommunity";
import { PostCard, FloatingActionButton } from "@/components/modules/CommunitySection";

export default function CommunityPage() {
    const { session, handleLike, handleDelete } = useCommunity();
    const [activeFilter, setActiveFilter] = useState("all");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useHeader({
        isVisible: true,
        title: "커뮤니티",
        right: <IconButton icon="Search" variant="ghost" ariaLabel="검색" />,
    });

    useFooter({ isVisible: true });

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
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
        fetchPosts();
    }, [activeFilter]);

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
                            onClick={() => window.location.href = '/community/create'}
                            className="text-primary font-medium hover:underline"
                        >
                            첫 소식 전하기
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onLike={(p) => handleLike(p, setPosts)}
                            onDelete={(id) => handleDelete(id, () => setPosts(prev => prev.filter(item => item.id !== id)))}
                            currentUserId={session?.user?.id}
                        />
                    ))
                )}
            </div>

            {/* Floating Action Button (FAB) */}
            <FloatingActionButton
                icon={Pencil}
                onClick={() => window.location.href = '/community/create'}
                ariaLabel="게시글 작성"
            />
        </div>
    );
}
