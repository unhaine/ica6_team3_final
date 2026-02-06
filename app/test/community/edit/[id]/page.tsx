'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';
import RichTextEditor from '@/components/custom/RichTextEditor';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();

    // Test Layout Control: Hide default header/footer
    useHeader({ isVisible: false });
    useFooter({ isVisible: false });

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (params?.id) {
            fetchPost(params.id as string);
        }
    }, [params]);

    const fetchPost = async (id: string) => {
        try {
            const res = await fetch(`/api/community/posts/${id}`);
            const data = await res.json();

            if (data.success) {
                // Verify ownership (optional here, blocked by logic later/server, but good for UI)
                if (session?.user?.id && data.data.userId !== session.user.id) {
                    toast.error('수정 권한이 없습니다.');
                    router.back();
                    return;
                }
                setContent(data.data.content);
                setTitle(data.data.title || ''); // Fetch title
            } else {
                toast.error('게시글을 불러오지 못했습니다.');
                router.back();
            }
        } catch (error) {
            console.error(error);
            toast.error('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // HTML 내용에서 썸네일 URL 추출 (선택된 이미지 > 첫 번째 이미지 > null)
    const extractThumbnail = (htmlContent: string): string | null => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        // 1. Check for explicitly selected thumbnail
        const selectedImg = doc.querySelector('img[data-is-thumbnail="true"]');
        if (selectedImg) return (selectedImg as HTMLImageElement).src;

        // 2. Fallback to first image
        const img = doc.querySelector('img');
        return img ? img.src : null;
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
            setSaving(true);
            const imageUrl = extractThumbnail(content);

            const res = await fetch(`/api/community/posts/${params.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    imageUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '게시글 수정 실패');
            }

            toast.success('게시글이 수정되었습니다!');
            window.location.href = '/test/community';
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || '게시글 수정 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">로딩 중...</div>;
    }

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
                <h1 className="text-lg font-bold text-slate-900">글 수정</h1>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className={`
                        px-4 py-1.5 rounded-full text-sm font-bold transition-all
                        ${saving
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm active:scale-95'}
                    `}
                >
                    {saving ? '저장 중...' : '완료'}
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
                        placeholder="내용을 수정해주세요..."
                    />
                </section>
            </main>
        </div>
    );
}
