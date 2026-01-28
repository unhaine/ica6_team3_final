"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"
import { DRAWER_STYLES } from "./Drawer.style"
import {
  DrawerProps,
  DrawerOverlayProps,
  DrawerContentProps,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
} from "./Drawer.type"

/**
 * 드로어 컴포넌트 (모바일 바텀 시트)
 * @description 화면 하단에서 올라오는 대화상자
 */
export const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: DrawerProps) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerPortal = DrawerPrimitive.Portal
export const DrawerClose = DrawerPrimitive.Close

/**
 * 드로어 오버레이
 */
export const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    className={cn(DRAWER_STYLES.overlay, className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

/**
 * 드로어 콘텐츠
 */
export const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  DrawerContentProps
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(DRAWER_STYLES.content, className)}
      {...props}
    >
      <div className={cn(DRAWER_STYLES.handle)} />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

/**
 * 드로어 헤더
 */
export const DrawerHeader = ({
  className,
  ...props
}: DrawerHeaderProps) => (
  <div
    className={cn(DRAWER_STYLES.header, className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

/**
 * 드로어 푸터
 */
export const DrawerFooter = ({
  className,
  ...props
}: DrawerFooterProps) => (
  <div
    className={cn(DRAWER_STYLES.footer, className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

/**
 * 드로어 제목
 */
export const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(DRAWER_STYLES.title, className)}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

/**
 * 드로어 설명
 */
export const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn(DRAWER_STYLES.description, className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName
