import { ReactNode } from "react";

export interface FilterCarouselProps<T> {
  /** 
   * 필터 데이터 배열 
   */
  data: T[];

  /** 
   * 각 아이템 렌더링 함수 
   */
  renderItem: (item: T, index: number) => ReactNode;

  /** 
   * 스크롤 컨테이너 스타일 
   */
  className?: string;
  
  /**
   * 고유 키 추출 함수
   */
  keyExtractor?: (item: T) => string | number;
}
