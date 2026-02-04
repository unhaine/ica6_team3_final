'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/elements/Icon';
import ImageUploader from '@/components/custom/ImageUploader';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function CreatePostPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageSelect = (selectedFile: File, url: string) => {
        setFile(selectedFile);
        setPreviewUrl(url);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error('사진을 선택해주세요.');
            return;
        }
        if (!content.trim()) {
            toast.error('내용을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);

            // 1. 이미지 업로드
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('이미지 업로드 실패');
            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.url;

            // 2. 게시글 작성
            const postRes = await fetch('/api/community/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    imageUrl,
                    recipeId: null, // 추후 레시피 연동 가능
                }),
            });

            if (!postRes.ok) throw new Error('게시글 작성 실패');

            toast.success('게시글이 등록되었습니다!');
            router.push('/community');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('게시글 등록 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-4 h-[60px]">
                <button
                    onClick={() => router.back()}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">새 게시글</h1>
                <button
                    onClick={handleSubmit}
                    disabled={loading || !file || !content.trim()}
                    className={`
                        px-4 py-1.5 rounded-full text-sm font-bold transition-all
                        ${loading || !file || !content.trim()
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm active:scale-95'}
                    `}
                >
                    {loading ? '등록 중...' : '완료'}
                </button>
            </header>

            <main className="pt-[80px] px-6 space-y-6">
                {/* Image Uploader */}
                <section>
                    <ImageUploader
                        onImageSelect={handleImageSelect}
                        onAnalyze={() => { }} // No-op
                        isAnalyzing={false}
                        hasImage={!!file}
                        showUploader={!file}
                        uploadText="사진을 업로드하세요"
                    />

                    {/* Selected Image Preview & Remove Button */}
                    {file && (
                        <div className="mt-4 relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                            <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover max-h-[400px]" />
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreviewUrl('');
                                }}
                                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 backdrop-blur-sm transition-colors"
                            >
                                <Icon name="X" size={20} />
                            </button>
                        </div>
                    )}
                </section>

                {/* Content Input */}
                <section>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="어떤 요리를 만드셨나요? 꿀팁이나 자랑거리를 공유해주세요! #요리 #인증샷"
                        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none text-slate-800 placeholder:text-slate-400"
                    />
                </section>

                {/* Optional: Add Recipe Link (Placeholder) */}
                <button className="w-full py-4 px-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-105 transition-transform">
                            <Icon name="Link" size={20} />
                        </div>
                        <span className="font-medium">레시피 연결하기 (선택)</span>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-slate-400" />
                </button>
            </main>
        </div>
    );
}
