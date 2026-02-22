'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ActionButton, Typography } from '@/components/elements';
import { AuthContainer, AuthField } from '@/components/modules';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useHeader } from '@/components/modules/Header/Header.hook';

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

    useHeader({
        title: "이메일 로그인",
        left: (
            <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900">
                <ChevronLeft size={24} />
            </button>
        ),
        isVisible: true,
    });

    return (
        <AuthContainer>
            <div className="text-center space-y-3">
                <Typography color="secondary">
                    이메일과 비밀번호를 입력해 주세요.
                </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <AuthField
                        label="이메일"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <AuthField
                        label="비밀번호"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <ActionButton 
                    type="submit" 
                    fullWidth
                    loading={isLoading}
                    className="h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90"
                >
                    로그인
                </ActionButton>
            </form>

            <div className="text-center">
                <button 
                    onClick={() => router.push('/signup')}
                    className="text-sm text-slate-500 hover:text-primary transition-colors duration-200"
                >
                    계정이 없으신가요? 
                    <span className="font-bold underline decoration-primary/30 underline-offset-4 hover:decoration-primary">
                        회원가입
                    </span>
                </button>
            </div>
        </AuthContainer>
    );
}
