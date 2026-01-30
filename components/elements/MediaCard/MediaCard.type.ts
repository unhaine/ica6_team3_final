import { ActionCardProps } from "../ActionCard/ActionCard.type";
import { ReactNode } from "react";

export interface MediaCardProps extends Omit<ActionCardProps, 'children' | 'title'> {
    /** 썸네일 이미지 URL */
    imageUrl?: string;
    /** 제목 (1줄 말줄임) */
    title: ReactNode;
    /** 부제목/뱃지 (우측 상단, 강조) */
    badge?: ReactNode;
    
    /** 본문 요약 (2줄 말줄임) */
    description?: ReactNode;
    
    /** 이미지 상단 오버레이 (시간, 난이도 등) */
    overlay?: ReactNode;
    
    /** 푸터 전체 (커스텀) - 사용 시 footerLeft/Right 무시됨 */
    footer?: ReactNode;
    /** 하단 왼쪽 (작성자 등) */
    footerLeft?: ReactNode;
    /** 하단 오른쪽 (통계 등) */
    footerRight?: ReactNode;

    /** 이미지 비율 (기본: video) */
    aspectRatio?: "square" | "video" | "portrait" | "auto";
    /** 카드 레이아웃 방향 (기본: vertical) */
    layout?: "vertical" | "horizontal";
    /** 이미지 영역 추가 스타일 (너비, 높이 조정 등) */
    imageClassName?: string;
    /** 컨텐츠 영역 추가 스타일 (패딩, 정렬 등) */
    contentClassName?: string;
    /** 메타 정보 리스트 (아이콘 + 라벨 쌍) */
    metadata?: Array<{
        icon?: any; // LucideIcon
        label: ReactNode;
    }>;
}
