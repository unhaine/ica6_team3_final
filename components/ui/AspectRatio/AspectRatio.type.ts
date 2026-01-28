import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"
import { ComponentPropsWithoutRef } from "react"

/**
 * AspectRatio 컴포넌트 Props
 */
export interface AspectRatioProps extends ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {
  /** 가로세로 비율 (예: 16 / 9) */
  ratio?: number;
}
