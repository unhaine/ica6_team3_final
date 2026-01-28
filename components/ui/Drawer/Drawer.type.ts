import { ComponentProps, ComponentPropsWithoutRef, HTMLAttributes } from "react"
import { Drawer as DrawerPrimitive } from "vaul"

/** Drawer 루트 컴포넌트 Props */
export type DrawerProps = ComponentProps<typeof DrawerPrimitive.Root> & {
  /** 배경 크기 조정 여부 */
  shouldScaleBackground?: boolean
}

/** Drawer 오버레이 컴포넌트 Props */
export type DrawerOverlayProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>

/** Drawer 콘텐츠 컴포넌트 Props */
export type DrawerContentProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>

/** Drawer 헤더 컴포넌트 Props */
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>

/** Drawer 푸터 컴포넌트 Props */
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>

/** Drawer 제목 컴포넌트 Props */
export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>

/** Drawer 설명 컴포넌트 Props */
export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
