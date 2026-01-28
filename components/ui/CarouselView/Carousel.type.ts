import { ReactNode } from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"

export type CarouselApi = UseEmblaCarouselType[1]
export type UseCarouselParameters = Parameters<typeof useEmblaCarousel>[0]

export interface CarouselProps {
  /** 캐러셀 옵션 */
  opts?: UseCarouselParameters
  /** 캐러셀 플러그인 */
  plugins?: any[]
  /** API 객체 전달을 위한 콜백 */
  setApi?: (api: CarouselApi) => void
  /** 캐러셀 방향 */
  orientation?: "horizontal" | "vertical"
  /** 추가 클래스명 */
  className?: string
  /** 내부 요소 */
  children?: ReactNode
}

export interface CarouselContextProps extends CarouselProps {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}
