'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';
import RichTextEditor from '@/components/custom/RichTextEditor';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";

function CreatePostContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    // Test Layout Control: Hide default header/footer
    useHeader({ isVisible: false });
    useFooter({ isVisible: false });

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    // HTML 내용에서 썸네일 URL 추출 (data-is-thumbnail="true" 우선, 그 다음 첫 번째 img)
    const extractThumbnail = (htmlContent: string): string | null => {
        try {
            // 1. Check for data-is-thumbnail="true"
            const thumbnailMatch = htmlContent.match(/<img[^>]+data-is-thumbnail="true"[^>]+src="([^">]+)"/i) ||
                htmlContent.match(/<img[^>]+src="([^">]+)"[^>]+data-is-thumbnail="true"/i);
            if (thumbnailMatch) return thumbnailMatch[1];

            // 2. Fallback to first image
            const firstImgMatch = htmlContent.match(/<img[^>]+src="([^">]+)"/i);
            return firstImgMatch ? firstImgMatch[1] : null;
        } catch (e) {
            console.error('Thumbnail extraction error:', e);
            return null;
        }
    };

    const handleSubmit = async () => {
        // Tiptap의 비어있는 상태 체크
        const strippedContent = content.replace(/<[^>]+>/g, '').trim();
        const hasImage = content.includes('<img');

        if (!title.trim()) {
            toast.error('제목을 입력해주세요.');
            return;
        }

        if (!strippedContent && !hasImage) {
            toast.error('내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            console.log('Submitting post:', { title, content: content.substring(0, 50) + '...', recipeId: searchParams.get('recipeId') });
            const imageUrl = extractThumbnail(content);
            console.log('Extracted thumbnail:', imageUrl);

            const res = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    imageUrl,
                    recipeId: searchParams.get('recipeId'),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '게시글 작성 실패');
            }

            toast.success('게시글이 등록되었습니다!');
            // Return to test community feed
            router.push('/test/community');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || '게시글 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* Custom Header */}
            <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-4 h-[60px]">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">글쓰기</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`
                        px-4 py-1.5 rounded-full text-sm font-bold transition-all
                        ${loading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm active:scale-95'}
                    `}
                >
                    {loading ? '등록 중...' : '등록'}
                </button>
            </header>

            <main className="flex-1 overflow-y-auto pt-[80px] px-4 pb-20 scrollbar-hide max-w-2xl mx-auto w-full">
                <section className="space-y-4">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-2xl font-bold placeholder:text-slate-300 border-none outline-none bg-transparent"
                    />
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="오늘의 요리는 어떠셨나요? 사진과 함께 이야기를 들려주세요!"
                    />
                </section>

                <div className="mt-6">
                    <button className="w-full py-4 px-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all group shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform">
                                <Icon name="Link" size={20} />
                            </div>
                            <span className="font-medium">레시피 연결하기 (선택)</span>
                        </div>
                        <Icon name="ChevronRight" size={20} className="text-slate-400" />
                    </button>
                </div>
            </main>
        </div>
    );
}

export default function CreatePostTestPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePostContent />
        </Suspense>
    );
}
