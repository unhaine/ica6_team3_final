'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Typography } from '@/components/elements/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

export default function EmailLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                toast.success('로그인되었습니다.');
                router.push('/test');
            }
        } catch (error) {
            console.error(error);
            toast.error('로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-slate-900 flex flex-col items-center p-6 pt-12 relative">
            <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors duration-200"
                >
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">뒤로가기</span>
                </button>

                <div className="text-center space-y-3">
                    <Typography variant="h3" weight="bold">
                        이메일 로그인
                    </Typography>
                    <Typography variant="body2" color="muted">
                        이메일과 비밀번호를 입력해 주세요.
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                이메일
                            </label>
                            <Input
                                type="email"
                                placeholder="example@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                비밀번호
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => router.push('/login/signup')}
                        className="text-sm text-slate-500 hover:text-primary transition-colors duration-200"
                    >
                        계정이 없으신가요? <span className="font-bold underline decoration-primary/30 underline-offset-4">회원가입</span>
                    </button>
                </div>
            </div>
        </main>
    );
}
