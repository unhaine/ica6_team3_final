import { HTMLAttributes, ReactNode } from "react";

export interface ActionCardProps extends HTMLAttributes<HTMLDivElement> {
  /** 
   * 카드 내부 컨텐츠 
   * - 자유로운 구성이 가능합니다 (예: 아이콘+텍스트, 또는 이미지+설명+태그)
   */
  children: ReactNode;
  
  /** 
   * 테두리 및 배경 스타일
   * - default: 기본 카드 (Solid)
   * - dashed: 점선 테두리 (추가/진입 유도용)
   * - outline: 투명 배경 + 테두리
   * - ghost: 테두리 없음, 호버 효과만
   */
  variant?: "default" | "dashed" | "outline" | "ghost";
  
  /** 비활성화 상태 */
  disabled?: boolean;
}
