'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ActionButton } from '@/components/elements';
import { AuthContainer, AuthField } from '@/components/modules';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useHeader } from '@/components/modules/Header/Header.hook';

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

    useHeader({
        title: "회원가입",
        left: (
            <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900">
                <ChevronLeft size={24} />
            </button>
        ),
        isVisible: true,
    });

    return (
        <AuthContainer>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <AuthField
                        label="이름"
                        type="text"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                    <AuthField
                        label="비밀번호 확인"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <ActionButton 
                    type="submit" 
                    fullWidth
                    loading={isLoading}
                    className="h-12 rounded-xl font-bold text-base shadow-lg shadow-purple-600/20 bg-purple-600 text-white hover:bg-purple-700"
                >
                    회원가입
                </ActionButton>
            </form>
        </AuthContainer>
    );
}
