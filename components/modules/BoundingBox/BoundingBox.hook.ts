import { useEffect, useState, useRef, RefObject, useCallback } from 'react';
import type { KonvaEventObject } from 'konva/lib/Node';
import { CanvasDimensions } from './BoundingBox.type';

interface UseBoundingBoxCanvasOptions {
  onHeightChange?: (height: number) => void;
}

interface UseBoundingBoxCanvasReturn {
  containerRef: RefObject<HTMLDivElement | null>;
  dimensions: CanvasDimensions;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  handleStageClick: (e: KonvaEventObject<MouseEvent | TouchEvent>) => void;
}

export const useBoundingBoxCanvas = (
  image: HTMLImageElement | undefined,
  options?: UseBoundingBoxCanvasOptions
): UseBoundingBoxCanvasReturn => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<CanvasDimensions>({ 
    width: 0, 
    height: 0, 
    scale: 1 
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && image) {
        const containerWidth = containerRef.current.offsetWidth;
        // 화면 높이의 70% 정도로 제한하여 스크롤 최소화
        const maxViewportHeight = window.innerHeight * 0.7;

        let width = containerWidth;
        let scale = width / image.width;
        let height = image.height * scale;

        if (height > maxViewportHeight) {
          height = maxViewportHeight;
          scale = height / image.height;
          width = image.width * scale;
        }

        setDimensions({ width, height, scale });
        options?.onHeightChange?.(height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, options?.onHeightChange]);

  // 배경 클릭 시 선택 해제
  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Stage(배경) 클릭 시에만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  }, []);

  return {
    containerRef,
    dimensions,
    selectedId,
    setSelectedId,
    handleStageClick,
  };
};
