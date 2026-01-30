import { ReactNode } from "react";

export interface SwipeableRowProps {
  /** 
   * 스와이프될 메인 컨텐츠 
   */
  children: ReactNode;

  /** 
   * 오른쪽으로 스와이프했을 때 나타날 왼쪽 영역 (예: 수정 버튼) 
   * - 클릭 가능한 요소를 포함해야 합니다.
   */
  leftAction?: ReactNode;

  /** 
   * 왼쪽으로 스와이프했을 때 나타날 오른쪽 영역 (예: 삭제 버튼) 
   * - 클릭 가능한 요소를 포함해야 합니다.
   */
  rightAction?: ReactNode;

  /**
   * 액션 영역의 너비 (px 단위)
   * @default 80
   */
  actionWidth?: number;
  
  className?: string;
}
