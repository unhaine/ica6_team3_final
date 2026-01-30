import { cn } from "@/lib/utils";
import { FilterCarouselProps } from "./FilterCarousel.type";
import { STYLES } from "./FilterCarousel.style";

/**
 * 필터 캐러셀 컴포넌트
 * @description 가로 스크롤이 가능한 필터 리스트 컨테이너입니다. 스크롤바를 숨기고 스냅 효과를 지원합니다.
 * SelectableChip 등의 요소를 renderItem으로 렌더링하여 사용합니다.
 */
export const FilterCarousel = <T,>({
  data,
  renderItem,
  className,
  keyExtractor,
}: FilterCarouselProps<T>) => {
  return (
    <div className={cn(STYLES.container, className)}>
      <div className={cn(STYLES.content)}>
        {data.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item) : (item as { id?: string | number; value?: string | number }).id || (item as { value?: string | number }).value || index;
          return (
            <div key={key} className="snap-start shrink-0">
               {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
