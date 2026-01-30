import { ActionCardProps } from "@/components/elements/ActionCard/ActionCard";
import { ReactNode } from "react";

export interface RecipeCardProps extends Omit<ActionCardProps, 'children'> {
    /** 썸네일 이미지 URL */
    imageUrl?: string;
    /** 제목 */
    title: string;
    /** 부제목/카테고리 */
    subtitle?: string;
    /** 본문 요약 */
    description?: string;
    
    /** 이미지 상단 오버레이 (시간, 난이도 등) */
    overlay?: ReactNode;
    /** 하단 메타 정보 (작성자, 날짜 등) */
    footerLeft?: ReactNode;
    /** 하단 통계 정보 (좋아요, 조회수 등) */
    footerRight?: ReactNode;

    /** 이미지 비율 (기본: aspect-video) */
    aspectRatio?: "square" | "video" | "portrait";
}
