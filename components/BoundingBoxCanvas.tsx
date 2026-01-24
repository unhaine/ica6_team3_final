'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface DetectedItem {
  id: string;
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface BoundingBoxCanvasProps {
  imageUrl: string;
  items: DetectedItem[];
  onUpdateItem: (id: string, newBox: { x: number; y: number; width: number; height: number }) => void;
  onHeightChange?: (height: number) => void;
}

const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = ({ imageUrl, items, onUpdateItem, onHeightChange }) => {
  const [image] = useImage(imageUrl);
  const stageRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, scale: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 컨테이너 크기에 맞춰 캔버스 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && image) {
        const containerWidth = containerRef.current.offsetWidth;
        const maxViewportHeight = window.innerHeight * 0.85; // 화면 높이의 85%로 제한
        
        let width = containerWidth;
        let scale = width / image.width;
        let height = image.height * scale;

        // 세로로 너무 긴 이미지인 경우 높이를 기준으로 다시 스케일 조정
        if (height > maxViewportHeight) {
          height = maxViewportHeight;
          scale = height / image.height;
          width = image.width * scale;
        }

        setDimensions({
          width: width,
          height: height,
          scale: scale,
        });
        
        if (onHeightChange) {
          onHeightChange(height);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [image]);

  if (!image) return null;

  return (
    <div ref={containerRef} className="w-full relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 flex justify-center">
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        ref={stageRef}
      >
        <Layer>
          {/* 원본 이미지 */}
          <KonvaImage
            image={image}
            width={dimensions.width}
            height={dimensions.height}
          />
          
          {/* 바운딩 박스들 */}
          {items.map((item) => {
            const { x, y, width, height } = item.boundingBox;
            // Vision API 좌표는 0~1 사이의 정규화된 값이므로 캔버스 크기에 곱해줌
            const rectX = x * dimensions.width;
            const rectY = y * dimensions.height;
            const rectWidth = width * dimensions.width;
            const rectHeight = height * dimensions.height;

            return (
              <Group
                key={item.id}
                draggable
                x={rectX}
                y={rectY}
                onDragEnd={(e) => {
                  const node = e.target;
                  onUpdateItem(item.id, {
                    x: node.x() / dimensions.width,
                    y: node.y() / dimensions.height,
                    width: width, // 너비와 높이는 일단 고정 (드래그만 지원)
                    height: height,
                  });
                }}
              >
                {/* 박스 테두리 */}
                <Rect
                  width={rectWidth}
                  height={rectHeight}
                  stroke="#10b981" // emerald-500
                  strokeWidth={3}
                  cornerRadius={4}
                  fill="rgba(16, 185, 129, 0.1)"
                />
                
                {/* 라벨 태그 */}
                <Group y={-25}>
                  <Rect
                    width={item.label.length * 10 + 50}
                    height={25}
                    fill="#10b981"
                    cornerRadius={[4, 4, 0, 0]}
                  />
                  <Text
                    text={`${item.label} ${(item.confidence * 100).toFixed(0)}%`}
                    fontSize={14}
                    fill="white"
                    padding={5}
                    fontStyle="bold"
                  />
                </Group>
              </Group>
            );
          })}
        </Layer>
      </Stage>
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/10">
        박스를 드래그하여 위치를 조정할 수 있습니다
      </div>
    </div>
  );
};

export default BoundingBoxCanvas;
