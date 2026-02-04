'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/elements/Icon';
import { useSession } from 'next-auth/react';
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

export default function CommunityPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('전체');

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
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-slate-100">
                <h1 className="text-xl font-bold text-slate-900">커뮤니티</h1>
                <button className="relative p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                    <Icon name="Bell" size={24} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            {/* Tabs */}
            <div className="bg-white px-6 flex border-b border-slate-100 sticky top-[61px] z-20">
                {['전체', '인기', '팔로잉'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium transition-all relative ${activeTab === tab ? 'text-emerald-500' : 'text-slate-400'
                            }`}
                    >
                        {tab === '인기' && '🔥 '}
                        {tab === '팔로잉' && '👥 '}
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Feed */}
            <main className="p-4 space-y-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-400">피드를 불러오는 중...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-slate-400 mb-4">아직 올라온 소식이 없어요.</p>
                        <button
                            onClick={() => router.push('/community/create')}
                            className="text-emerald-500 font-medium hover:underline"
                        >
                            첫 소식 전하기
                        </button>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            {/* User Info */}
                            <div className="p-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-50">
                                        {post.user.image ? (
                                            <img src={post.user.image} alt={post.user.name || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                <Icon name="User" size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{post.user.name || '익명 고수'}</p>
                                        <p className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()} · 2시간 전</p>
                                    </div>
                                </div>
                                <button className="text-slate-300 hover:text-slate-600">
                                    <Icon name="MoreHorizontal" size={20} />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="relative aspect-video bg-slate-100 overflow-hidden">
                                <img src={post.imageUrl} alt="요리 인증샷" className="w-full h-full object-cover" />

                                {/* Meoki Badge (AI Recommended) */}
                                {post.recipeId && (
                                    <div className="absolute left-4 bottom-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-600/90 backdrop-blur-md text-white rounded-full text-xs font-semibold shadow-xl border border-white/20">
                                        <Icon name="Cpu" size={14} />
                                        <span>먹이 추천으로 만듦</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-3">
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {post.content}
                                </p>

                                {/* Engagement */}
                                <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors group">
                                        <Icon name="Heart" size={20} className="group-active:scale-125 transition-transform" />
                                        <span className="text-xs font-medium">{post._count.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-500 transition-colors">
                                        <Icon name="MessageCircle" size={20} />
                                        <span className="text-xs font-medium">{post._count.comments}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </main>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => router.push('/community/create')}
                className="fixed bottom-24 right-6 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 border-2 border-white z-[100]"
                aria-label="게시글 작성"
            >
                <Icon name="Pencil" size={24} />
            </button>
        </div>
    );
}
