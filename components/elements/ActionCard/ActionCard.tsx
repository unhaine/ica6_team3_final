"use client";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ActionCardProps } from "./ActionCard.type";
import { STYLES } from "./ActionCard.style";

/**
 * 범용 액션 카드
 * @description 클릭 가능한 카드 형태의 컨테이너로, 내부 컨텐츠를 자유롭게 구성할 수 있습니다.
 * 
 * @example
 * // 1. Item Style
 * <ActionCard>
 *   <div className="flex gap-4">
 *     <Image ... />
 *     <div>
 *       <h3>Title</h3>
 *       <Tags ... />
 *     </div>
 *   </div>
 * </ActionCard>
 * 
 * @example
 * // 2. Entry Style
 * <ActionCard variant="dashed" className="items-center justify-center p-8">
 *   <Icon />
 *   <span>Add New</span>
 * </ActionCard>
 */
export const ActionCard = ({
  children,
  className,
  variant = "default",
  disabled = false,
  onClick,
  ...props
}: ActionCardProps) => {
  return (
    <Card
      className={cn(STYLES.container({ variant, disabled }), className)}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </Card>
  );
};
