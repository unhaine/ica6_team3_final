'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Typography } from '@/components/elements/Typography';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    name,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || '회원가입에 실패했습니다.');
            } else {
                // 회원가입 성공 후 자동 로그인
                toast.success('회원가입이 완료되었습니다!');
                
                const loginResult = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (loginResult?.error) {
                    toast.error('자동 로그인에 실패했습니다. 로그인 페이지로 이동합니다.');
                    router.push('/login/email');
                } else {
                    toast.success('로그인되었습니다.');
                    router.push('/onboarding');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('회원가입 중 오류가 발생했습니다.');
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
                        회원가입
                    </Typography>
                    <Typography variant="body2" color="muted">
                        냉장고양이와 함께 스마트한 식생활을 시작해 보세요.
                    </Typography>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                이름
                            </label>
                            <Input
                                type="text"
                                placeholder="홍길동"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                            />
                        </div>
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
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                                비밀번호 확인
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {isLoading ? '가입 중...' : '회원가입'}
                    </Button>
                </form>

                <div className="text-center">
                    <button 
                        onClick={() => router.push('/login/email')}
                        className="text-sm text-slate-500 hover:text-primary transition-colors duration-200"
                    >
                        이미 계정이 있으신가요? <span className="font-bold underline decoration-primary/30 underline-offset-4">로그인</span>
                    </button>
                </div>
            </div>
        </main>
    );
}
