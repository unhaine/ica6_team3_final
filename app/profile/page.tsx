'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Icon } from '@/components/elements/Icon';
import { ActionButton } from '@/components/elements/ActionButton';

export default function ProfilePage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-8 flex flex-col items-center space-y-4 border-b border-slate-100 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-xl overflow-hidden relative group">
                    {session?.user?.image ? (
                        <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-emerald-500">
                            <Icon name="User" size={48} />
                        </div>
                    )}
                </div>
                <div className="text-center">
                    <h1 className="text-xl font-bold text-slate-900">{session?.user?.name || '익명 고수'}</h1>
                    <p className="text-sm text-slate-400">{session?.user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Level 1</span>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">먹이 마스터</span>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-0 bg-white border-b border-slate-100 mt-2">
                <div className="py-6 flex flex-col items-center border-r border-slate-50">
                    <span className="text-lg font-bold text-slate-900">12</span>
                    <span className="text-[10px] text-slate-400 font-medium">인증샷</span>
                </div>
                <div className="py-6 flex flex-col items-center border-r border-slate-50">
                    <span className="text-lg font-bold text-slate-900">45</span>
                    <span className="text-[10px] text-slate-400 font-medium">좋아요</span>
                </div>
                <div className="py-6 flex flex-col items-center">
                    <span className="text-lg font-bold text-slate-900">8</span>
                    <span className="text-[10px] text-slate-400 font-medium">레시피</span>
                </div>
            </div>

            {/* Menus */}
            <main className="p-6 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                    <button className="w-full px-6 py-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Icon name="Settings" size={20} className="text-slate-400" />
                            <span className="text-sm font-medium">환경 설정</span>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-slate-300" />
                    </button>
                    <div className="h-[1px] bg-slate-50 mx-6" />
                    <button className="w-full px-6 py-4 flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <Icon name="HelpCircle" size={20} className="text-slate-400" />
                            <span className="text-sm font-medium">고객 센터</span>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-slate-300" />
                    </button>
                </div>

                <ActionButton
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-100 hover:text-slate-600 transition-all"
                    onClick={() => signOut()}
                >
                    로그아웃
                </ActionButton>
            </main>
        </div>
    );
}
