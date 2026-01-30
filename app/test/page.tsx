"use client";

import { useHeader } from "@/components/modules/Header";
import { Typography } from "@/components/elements/Typography";
import { IconButton } from "@/components/elements/IconButton";

export default function TestPage() {
    // 1. 헤더 제어
    useHeader({
        isVisible: true,
        title: "새로운 테스트 메인",
        right: <IconButton icon="Bell" variant="ghost" ariaLabel="알림" />,
        left: undefined, // 기본 뒤로가기 없음
    });

    // 2. 푸터 설정 (Global Layout에서 처리됨)

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-white pb-10 space-y-4 overflow-y-auto">
            <Typography variant="h3" weight="bold">
                환영합니다!
            </Typography>
            <Typography color="secondary" align="center">
                이곳은 새롭게 구축된 모듈형 UI 시스템의<br/>테스트 페이지입니다.
            </Typography>
            
            <div className="p-4 bg-gray-50 rounded-lg w-full text-sm text-gray-600">
                <p>✅ Header: 페이지에서 주입됨</p>
                <p>✅ Footer: 페이지에서 주입됨</p>
                <p>✅ Layout: 껍데기만 제공 중</p>
            </div>
        </div>
    );
}
