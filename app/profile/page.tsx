"use client";

import { useHeader } from "@/components/modules/Header";
import { useFooter } from "@/components/modules/Footer";
import { AvatarThumbnail, Typography, ActionCard } from "@/components/elements";
import { ChevronRight, LogOut, MessageSquare, Users, Utensils, AlertTriangle, Edit2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { EditSurveyModal } from "@/components/modules/ProfileSection";
import { AlertModal } from "@/components/elements/AlertModal/AlertModal";
import { COOKING_STYLE_OPTIONS } from "@/data/constants/cookingSituations";

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [isHovering, setIsHovering] = useState(false);
    const [userData, setUserData] = useState<{
        householdSize: number | null;
        allergies: string[];
        cookingPreference: string | null;
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editingType, setEditingType] = useState<'household' | 'allergies' | 'cookingPreference' | null>(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useHeader({
        isVisible: true,
        title: "프로필",
        left: null,
    });

    useFooter({
        isVisible: true,
    });

    // 사용자 데이터 불러오기
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.user) {
                        setUserData({
                            householdSize: data.user.householdSize,
                            allergies: data.user.allergies || [],
                            cookingPreference: data.user.cookingPreference || null,
                        });
                    }
                }
            } catch (error) {
                console.error('사용자 데이터 조회 에러:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchUserData();
        }
    }, [user]);

    // 설문조사 값 저장
    const handleSaveSurvey = async (type: 'household' | 'allergies' | 'cookingPreference', value: number | string[] | string) => {
        try {
            const response = await fetch('/api/user/survey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    householdSize: type === 'household' ? value : userData?.householdSize,
                    allergies: type === 'allergies' ? value : userData?.allergies,
                    cookingPreference: type === 'cookingPreference' ? value : userData?.cookingPreference,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setUserData({
                    householdSize: data.user.householdSize,
                    allergies: data.user.allergies || [],
                    cookingPreference: data.user.cookingPreference || null,
                });
                setEditingType(null);
                alert('✅ 수정되었습니다.');
            } else {
                alert(`❌ 수정 실패: ${data.error}`);
            }
        } catch (error) {
            console.error('설문조사 수정 에러:', error);
            alert('❌ 수정 중 오류가 발생했습니다.');
        }
    };

    const SETTINGS = [
        {
            icon: Users,
            label: "가구 인원",
            value: userData?.householdSize
                ? `${userData.householdSize}${userData.householdSize === 4 ? '인+' : '인'}`
                : "미설정",
            onClick: () => setEditingType('household'),
        },
        {
            icon: Utensils,
            label: "요리 선호",
            value: userData?.cookingPreference
                ? COOKING_STYLE_OPTIONS.find((opt: any) => opt.value === userData.cookingPreference)?.label || userData.cookingPreference
                : "미설정",
            onClick: () => setEditingType('cookingPreference'),
        },
        {
            icon: AlertTriangle,
            label: "알러지/비선호",
            value: userData?.allergies && userData.allergies.length > 0
                ? userData.allergies.join(', ')
                : "없음",
            onClick: () => setEditingType('allergies'),
        },
    ];

    const MENU = [
        { icon: MessageSquare, label: "피드백 보내기" },
    ];

    return (
        <div className="absolute inset-0 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
                {/* 1. Header Section */}
                <section className="bg-surface p-6 flex flex-row items-center gap-6">
                    <div
                        className="relative cursor-pointer group shrink-0"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={() => router.push('/profile/select')}
                    >
                        <AvatarThumbnail
                            size="lg"
                            className="w-20 h-20 ring-4 ring-surface-alt shadow-lg transition-all group-hover:ring-primary/10"
                            src={user?.image || ""}
                            fallback={user?.name?.[0] || "?"}
                        />
                        <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-all duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-white/90 rounded-full p-2 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                <Edit2 className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start overflow-hidden">
                        <Typography variant="h3" weight="bold" color="primary" className="truncate w-full">
                            {user?.name || "사용자"}님
                        </Typography>
                        <div className="mt-1.5 inline-block">
                            <Typography variant="caption" color="secondary" className="px-3 py-1 bg-surface-alt rounded-full border border-border-subtle font-medium truncate max-w-[200px]">
                                {user ? (user.email || "이메일 정보 없음") : "로그인이 필요합니다."}
                            </Typography>
                        </div>
                    </div>
                </section>

                {/* 2. Settings Section */}
                <div className="mt-4 pb-10">
                    <div className="px-4 py-2">
                        <Typography variant="caption" weight="bold" color="tertiary" className="uppercase tracking-widest text-[11px]">
                            개인화 설정
                        </Typography>
                    </div>
                    <div className="bg-white">
                        {SETTINGS.map((item, idx) => (
                            <div
                                key={idx}
                                className={`
                                    flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors
                                `}
                                onClick={item.onClick}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-400 group-hover:text-primary transition-colors">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <Typography weight="semibold" className="text-[15px]">{item.label}</Typography>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Typography className="text-primary font-bold text-[14px]">{item.value}</Typography>
                                    <ChevronRight className="w-4 h-4 text-gray-300" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-4 py-2 mt-4">
                        <Typography variant="caption" weight="bold" color="tertiary" className="uppercase tracking-widest text-[11px]">
                            계정 및 지원
                        </Typography>
                    </div>
                    <div className="bg-white">
                        {MENU.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="text-gray-400">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <Typography weight="semibold" className="text-[15px]">{item.label}</Typography>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        ))}

                        <div
                            className="flex items-center justify-between p-4 cursor-pointer active:bg-destructive/5 transition-colors"
                            onClick={() => setShowLogoutConfirm(true)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-destructive/60">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <Typography weight="bold" className="text-[15px] text-destructive">로그아웃</Typography>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-12 flex flex-col items-center gap-2">
                    <Typography variant="caption" className="text-[10px] text-text-tertiary opacity-50 uppercase tracking-[0.2em]">Build 1.0.0 (MVP)</Typography>
                </div>
            </div>

            {/* 설문조사 수정 모달 */}
            {editingType && (
                <EditSurveyModal
                    isOpen={editingType !== null}
                    type={editingType}
                    currentValue={
                        editingType === 'household'
                            ? userData?.householdSize || null
                            : editingType === 'allergies'
                                ? userData?.allergies || []
                                : userData?.cookingPreference || null
                    }
                    onClose={() => setEditingType(null)}
                    onSave={(value) => handleSaveSurvey(editingType, value)}
                />
            )}

            {/* 로그아웃 확인 모달 */}
            <AlertModal
                isOpen={showLogoutConfirm}
                title="로그아웃"
                message="정말 로그아웃 하시겠습니까?"
                confirmLabel="로그아웃"
                cancelLabel="취소"
                variant="danger"
                onConfirm={() => signOut({ callbackUrl: "/" })}
                onClose={() => setShowLogoutConfirm(false)}
            />
        </div>
    );
}
