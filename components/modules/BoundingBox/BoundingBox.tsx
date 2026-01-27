'use client';

import React, { useMemo } from 'react';
import { Stage, Layer, Rect, Text, Group, Image as KonvaImage, Circle } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';

import { BoundingBoxCanvasProps, ExtendedBoundingBox } from './BoundingBox.type';
import { useBoundingBoxCanvas } from './BoundingBox.hook';
import {
  COLORS,
  BOX_STYLES,
  LABEL_STYLES,
  CONTROL_STYLES,
  CONTAINER_CLASSNAME,
  LOADING_CLASSNAME,
  GUIDE_OVERLAY_CLASSNAME,
} from './BoundingBox.style';

interface BoundingBoxItemProps {
  item: ExtendedBoundingBox;
  isSelected: boolean;
  dimensions: { width: number; height: number };
  onSelect: () => void;
  onDragEnd: (newX: number, newY: number) => void;
  onRemove?: () => void;
  onLabelChange?: () => void;
}

const BoundingBoxItem: React.FC<BoundingBoxItemProps> = ({
  item,
  isSelected,
  dimensions,
  onSelect,
  onDragEnd,
  onRemove,
  onLabelChange,
}) => {
  const rectX = item.x * dimensions.width;
  const rectY = item.y * dimensions.height;
  const rectWidth = item.width * dimensions.width;
  const rectHeight = item.height * dimensions.height;

  const currentBoxStyle = isSelected ? BOX_STYLES.selected : BOX_STYLES.default;
  const currentLabelColor = isSelected ? COLORS.primaryLight : COLORS.primary;
  const labelWidth = item.label.length * LABEL_STYLES.charWidth + LABEL_STYLES.extraPadding;

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    // 캔버스 밖으로 나가지 않도록 제한
    const newX = Math.max(0, Math.min(node.x(), dimensions.width - rectWidth));
    const newY = Math.max(0, Math.min(node.y(), dimensions.height - rectHeight));

    // 위치 보정
    node.x(newX);
    node.y(newY);

    onDragEnd(newX / dimensions.width, newY / dimensions.height);
  };

  return (
    <Group
      draggable
      x={rectX}
      y={rectY}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
    >
      {/* 박스 영역 */}
      <Rect
        width={rectWidth}
        height={rectHeight}
        stroke={currentBoxStyle.stroke}
        strokeWidth={currentBoxStyle.strokeWidth}
        cornerRadius={4}
        fill={currentBoxStyle.fill}
      />

      {/* 라벨 태그 */}
      <Group y={LABEL_STYLES.offsetY}>
        <Rect
          width={labelWidth}
          height={LABEL_STYLES.height}
          fill={currentLabelColor}
          cornerRadius={LABEL_STYLES.cornerRadius}
          shadowBlur={5}
        />
        <Text
          text={item.label}
          fontSize={LABEL_STYLES.fontSize}
          fill={COLORS.white}
          padding={LABEL_STYLES.padding}
          fontStyle="bold"
          onClick={onLabelChange}
          onTap={onLabelChange}
        />
      </Group>

      {/* 삭제 버튼 (선택되었을 때만 표시) */}
      {isSelected && onRemove && (
        <Group
          x={rectWidth}
          y={CONTROL_STYLES.deleteButton.offsetY}
          onClick={onRemove}
          onTap={onRemove}
        >
          <Circle
            radius={CONTROL_STYLES.deleteButton.radius}
            fill={COLORS.danger}
            shadowBlur={2}
          />
          <Text
            text="✕"
            fontSize={CONTROL_STYLES.deleteButton.fontSize}
            fill={COLORS.white}
            x={CONTROL_STYLES.deleteButton.textOffsetX}
            y={CONTROL_STYLES.deleteButton.textOffsetY}
            fontStyle="bold"
          />
        </Group>
      )}

      {/* 리사이즈 핸들 (우하단) */}
      {isSelected && (
        <Circle
          x={rectWidth}
          y={rectHeight}
          radius={CONTROL_STYLES.resizeHandle.radius}
          fill={COLORS.white}
          stroke={COLORS.primary}
          strokeWidth={CONTROL_STYLES.resizeHandle.strokeWidth}
          cursor="nwse-resize"
        />
      )}
    </Group>
  );
};

const BoundingBoxCanvas: React.FC<BoundingBoxCanvasProps> = ({
  imageUrl,
  items,
  onUpdateItem,
  onRemoveItem,
  onLabelChange,
  onHeightChange,
}) => {
  const [image] = useImage(imageUrl, 'anonymous');

  const hookOptions = useMemo(
    () => ({ onHeightChange }),
    [onHeightChange]
  );

  const {
    containerRef,
    dimensions,
    selectedId,
    setSelectedId,
    handleStageClick,
  } = useBoundingBoxCanvas(image, hookOptions);

  const guideText = selectedId
    ? '라벨을 눌러 수정하거나 🔴 버튼으로 삭제하세요'
    : '박스를 눌러 편집하세요';

  if (!image) {
    return <div className={LOADING_CLASSNAME} />;
  }

  return (
    <div ref={containerRef} className={CONTAINER_CLASSNAME}>
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

          {items.map((item) => (
            <BoundingBoxItem
              key={item.id}
              item={item}
              isSelected={selectedId === item.id}
              dimensions={dimensions}
              onSelect={() => setSelectedId(item.id)}
              onDragEnd={(newX, newY) => {
                onUpdateItem(item.id, {
                  x: newX,
                  y: newY,
                  width: item.width,
                  height: item.height,
                });
              }}
              onRemove={onRemoveItem ? () => onRemoveItem(item.id) : undefined}
              onLabelChange={
                onLabelChange
                  ? () => {
                      const newLabel = prompt('새로운 이름을 입력하세요:', item.label);
                      if (newLabel) onLabelChange(item.id, newLabel);
                    }
                  : undefined
              }
            />
          ))}
        </Layer>
      </Stage>

      {/* 안내 문구 오버레이 */}
      <div className={GUIDE_OVERLAY_CLASSNAME}>{guideText}</div>
    </div>
  );
};

export default BoundingBoxCanvas;
