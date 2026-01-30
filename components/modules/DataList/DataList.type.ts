import { ReactNode } from "react";

export interface DataListProps<T> {
  /** 
   * 렌더링할 데이터 배열 
   */
  data: T[] | undefined | null;

  /** 
   * 각 아이템을 렌더링하는 함수 
   */
  renderItem: (item: T, index: number) => ReactNode;

  /** 
   * 최상위 컨테이너의 클래스 이름
   * - 레이아웃(Grid/Flex)을 여기서 정의합니다.
   * - 예: "grid grid-cols-2 gap-4" 또는 "flex flex-col space-y-2"
   */
  className?: string;

  /** 
   * 고유 키 추출 함수 
   * - 기본적으로 item.id를 찾거나 인덱스를 사용하지만, 명시하는 것이 좋습니다.
   */
  keyExtractor?: (item: T, index: number) => string | number;

  /** 
   * 데이터가 빈 배열일 때 표시할 컴포넌트 
   */
  ListEmptyComponent?: ReactNode;

  /** 
   * 리스트 내부 최상단에 추가될 요소 
   */
  ListHeaderComponent?: ReactNode;

  /** 
   * 리스트 내부 최하단에 추가될 요소 
   * - Grid 레이아웃 사용 시 마지막 셀(Cell)로 자연스럽게 배치됩니다.
   */
  ListFooterComponent?: ReactNode;

  /** 
   * 아이템 사이 간격 컴포넌트 (Flex 레이아웃 사용 시 유용) 
   * - Grid 레이아웃에서는 gap 클래스를 사용하는 것이 더 좋습니다.
   */
  ItemSeparatorComponent?: ReactNode;
  
  /**
   * 로딩 상태 여부
   */
  isLoading?: boolean;
  
  /**
   * 로딩 중일 때 표시할 컴포넌트 (Skeleton 등)
   */
  ListLoadingComponent?: ReactNode;
}
