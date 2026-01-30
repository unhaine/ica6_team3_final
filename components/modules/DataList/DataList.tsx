import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { DataListProps } from "./DataList.type";
import { STYLES } from "./DataList.style";

/**
 * 범용 데이터 리스트 컴포넌트
 * @description 배열 데이터를 받아 리스트나 그리드 형태로 렌더링합니다. Layout Agnostic 하므로 className으로 레이아웃을 결정합니다.
 * React Native의 FlatList 인터페이스와 유사합니다.
 */
export const DataList = <T,>({
  data,
  renderItem,
  className,
  keyExtractor,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  ItemSeparatorComponent,
  isLoading,
  ListLoadingComponent,
}: DataListProps<T>) => {
  const safeData = data || [];
  const isEmpty = safeData.length === 0;

  if (isLoading && ListLoadingComponent) {
    return <div className={cn(STYLES.container, className)}>{ListLoadingComponent}</div>;
  }

  if (isEmpty && !isLoading) {
    return (
      <div className={cn(STYLES.container, className)}>
        {ListHeaderComponent}
        {ListEmptyComponent}
        {ListFooterComponent}
      </div>
    );
  }

  return (
    <div className={cn(STYLES.container, className)}>
      {ListHeaderComponent}
      
      {safeData.map((item, index) => {
        const key = keyExtractor ? keyExtractor(item, index) : (item as { id?: string | number }).id || index;
        const isLast = index === safeData.length - 1;

        return (
          <Fragment key={key}>
            {renderItem(item, index)}
            {!isLast && ItemSeparatorComponent}
          </Fragment>
        );
      })}

      {ListFooterComponent}
    </div>
  );
};
