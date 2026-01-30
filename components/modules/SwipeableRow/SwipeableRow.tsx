"use client";

import { motion, PanInfo, useAnimation, useMotionValue } from "framer-motion";
import { STYLES } from "./SwipeableRow.style";
import { SwipeableRowProps } from "./SwipeableRow.type";
import { cn } from "@/lib/utils";

/**
 * 스와이프 가능한 행 컴포넌트 (Swipe to Reveal)
 * @description Framer Motion을 사용하여 좌우 스와이프 시 액션 버턴을 노출합니다.
 * 즉시 실행되지 않고, 스와이프 후 버튼을 클릭해야 동작합니다.
 */
export const SwipeableRow = ({
  children,
  leftAction,
  rightAction,
  actionWidth = 80, // 기본 버튼 너비
  className,
}: SwipeableRowProps) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // 드래그 종료 시 스냅 위치 계산
  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = actionWidth / 2; // 절반 이상 드래그하면 열림

    // 1. 오른쪽으로 스와이프 (왼쪽 액션 열기)
    if (leftAction && (offset > threshold || velocity > 500)) {
       await controls.start({ x: actionWidth, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
    // 2. 왼쪽으로 스와이프 (오른쪽 액션 열기)
    else if (rightAction && (offset < -threshold || velocity < -500)) {
       await controls.start({ x: -actionWidth, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
    // 3. 제자리로 복귀
    else {
       await controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div className={cn(STYLES.container, className)}>
      {/* Background Actions Layer */}
      <div className={STYLES.actionLayer}>
        <div className={STYLES.leftAction} style={{ width: actionWidth }}>
            {leftAction}
        </div>
        <div className={STYLES.rightAction} style={{ width: actionWidth }}>
            {rightAction}
        </div>
      </div>

      {/* Foreground Content Layer */}
      <motion.div
        drag="x"
        // 드래그 제약: 왼쪽/오른쪽 액션이 있는 경우에만 해당 방향으로 드래그 허용
        dragConstraints={{ 
            left: rightAction ? -actionWidth : 0, 
            right: leftAction ? actionWidth : 0 
        }}
        dragElastic={0.1} // 오버스크롤 저항감
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, touchAction: "pan-y" }} // pan-y: 수직 스크롤 허용
        className="relative bg-background z-10" // z-10으로 액션 위에 표시
      >
        {children}
      </motion.div>
    </div>
  );
};
