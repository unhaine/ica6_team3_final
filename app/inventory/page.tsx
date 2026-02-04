'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginButton from '@/components/LoginButton';

interface UserIngredient {
    id: string;
    name: string;
    quantity: string | null;
    category: string | null;
    source: string | null;
    expiryDate: string | null;
    purchaseDate: string | null;
    createdAt: string;
}

export default function InventoryPage() {
    const { data: session, status } = useSession();
    const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            setLoading(false);
            return;
        }

        if (status === 'authenticated') {
            fetchIngredients();
        }
    }, [status]);

    const fetchIngredients = async () => {
        try {
            const response = await fetch('/api/ingredients');
            const result = await response.json();
            if (result.success) {
                setIngredients(result.data || []);
            }
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/ingredients?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.success) {
                setIngredients(prev => prev.filter(item => item.id !== id));
            } else {
                alert('삭제 실패: ' + (result.error || '알 수 없는 오류'));
            }
        } catch (error) {
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-200">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">나의 냉장고</h1>
                        <p className="text-slate-400 text-sm">보관 중인 식재료를 관리하세요</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={() => router.push('/')}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            ← 메인으로
                        </button>
                        <LoginButton />
                    </div>
                </header>

                {loading || status === 'loading' ? (
                    <div className="text-center py-20 text-slate-500">
                        로딩 중...
                    </div>
                ) : ingredients.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                        <p className="text-slate-400 mb-4">
                            {status === 'unauthenticated'
                                ? '로그인이 필요합니다.'
                                : '냉장고가 비어있습니다.'}
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                        >
                            {status === 'unauthenticated' ? '메인으로 가기' : '재료 추가하러 가기'}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ingredients.map((item) => (
                            <div
                                key={item.id}
                                className="bg-slate-800/50 border border-slate-700/50 p-5 rounded-2xl flex justify-between items-start hover:bg-slate-800/80 transition-all"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg font-bold text-white">{item.name}</span>
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full">
                                            보관중
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        {item.quantity && (
                                            <p className="text-sm text-slate-400">수량: {item.quantity}</p>
                                        )}
                                        {item.expiryDate && (
                                            <p className="text-sm text-orange-400">유통기한: {new Date(item.expiryDate).toLocaleDateString()}</p>
                                        )}
                                        <p className="text-xs text-slate-500">
                                            등록일: {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="삭제"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
