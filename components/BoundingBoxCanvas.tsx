'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage, Circle } from 'react-konva';
import useImage from 'use-image';

import { BoundingBox } from '@/types/ingredient';

interface ExtendedBoundingBox extends BoundingBox {
  confidence?: number;
}

interface BoundingBoxCanvasProps {
  imageUrl: string;
  items: ExtendedBoundingBox[];
  onUpdateItem: (id: string, newBox: { x: number; y: number; width: number; height: number }) => void;
  onRemoveItem?: (id: string) => void;
  onLabelChange?: (id: string, newLabel: string) => void;
  onHeightChange?: (height: number) => void;
}

const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = ({ 
  imageUrl, 
  items, 
  onUpdateItem, 
  onRemoveItem, 
  onLabelChange,
  onHeightChange 
}) => {
  const [image] = useImage(imageUrl, 'anonymous'); // CORS safe
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
  
  // 선택된 박스 ID (편집 UI 표시용)
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
        if (onHeightChange) onHeightChange(height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image, onHeightChange]);

  // 배경 클릭 시 선택 해제
  const handleStageClick = (e: any) => {
    // Stage(배경) 클릭 시에만 선택 해제
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  if (!image) return <div className="w-full aspect-video bg-muted animate-pulse rounded-xl" />;

  return (
    <div ref={containerRef} className="w-full relative bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-zinc-700 flex justify-center touchscreen-manipulation">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
      >
        <Layer>
          <KonvaImage
            image={image}
            width={dimensions.width}
            height={dimensions.height}
          />
          
          {items.map((item) => {
            const { x, y, width, height } = item;
            const rectX = x * dimensions.width;
            const rectY = y * dimensions.height;
            const rectWidth = width * dimensions.width;
            const rectHeight = height * dimensions.height;
            const isSelected = selectedId === item.id;

            return (
              <Group
                key={item.id}
                draggable
                x={rectX}
                y={rectY}
                onClick={() => setSelectedId(item.id)}
                onTap={() => setSelectedId(item.id)}
                onDragEnd={(e) => {
                  const node = e.target;
                  // 캔버스 밖으로 나가지 않도록 제한 (옵션)
                  const newX = Math.max(0, Math.min(node.x(), dimensions.width - rectWidth));
                  const newY = Math.max(0, Math.min(node.y(), dimensions.height - rectHeight));
                  
                  // 위치 보정
                  node.x(newX);
                  node.y(newY);

                  onUpdateItem(item.id, {
                    x: newX / dimensions.width,
                    y: newY / dimensions.height,
                    width,
                    height,
                  });
                }}
              >
                {/* 박스 영역 */}
                <Rect
                  width={rectWidth}
                  height={rectHeight}
                  stroke={isSelected ? "#34d399" : "#10b981"} // 선택 시 더 밝은색
                  strokeWidth={isSelected ? 4 : 2}
                  cornerRadius={4}
                  fill={isSelected ? "rgba(52, 211, 153, 0.2)" : "rgba(16, 185, 129, 0.1)"}
                />
                
                {/* 라벨 태그 */}
                <Group y={-26}>
                  <Rect
                    width={item.label.length * 12 + 30}
                    height={24}
                    fill={isSelected ? "#34d399" : "#10b981"}
                    cornerRadius={[4, 4, 4, 0]}
                    shadowBlur={5}
                  />
                  <Text
                    text={item.label}
                    fontSize={14}
                    fill="white"
                    padding={4}
                    fontStyle="bold"
                    onClick={() => {
                        // 간단한 라벨 수정 (Prompt)
                        if (onLabelChange) {
                            const newLabel = prompt("새로운 이름을 입력하세요:", item.label);
                            if (newLabel) onLabelChange(item.id, newLabel);
                        }
                    }}
                    onTap={() => {
                        if (onLabelChange) {
                            const newLabel = prompt("새로운 이름을 입력하세요:", item.label);
                            if (newLabel) onLabelChange(item.id, newLabel);
                        }
                    }}
                  />
                </Group>

                {/* 삭제 버튼 (선택되었을 때만 표시) */}
                {isSelected && onRemoveItem && (
                  <Group x={rectWidth} y={-10} 
                    onClick={() => onRemoveItem(item.id)}
                    onTap={() => onRemoveItem(item.id)}
                  >
                    <Circle radius={10} fill="#ef4444" shadowBlur={2} />
                    <Text text="✕" fontSize={12} fill="white" x={-4} y={-5} fontStyle="bold" />
                  </Group>
                )}
                
                {/* 리사이즈 핸들 (우하단) */}
                {isSelected && (
                    <Circle 
                        x={rectWidth} 
                        y={rectHeight} 
                        radius={5} 
                        fill="white" 
                        stroke="#10b981"
                        strokeWidth={2}
                        cursor="nwse-resize"
                    />
                )}
              </Group>
            );
          })}
        </Layer>
      </Stage>
      
      {/* 안내 문구 오버레이 */}
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10 pointer-events-none">
        {selectedId ? "라벨을 눌러 수정하거나 🔴 버튼으로 삭제하세요" : "박스를 눌러 편집하세요"}
      </div>
    </div>
  );
};

export default BoundingBoxCanvas;
