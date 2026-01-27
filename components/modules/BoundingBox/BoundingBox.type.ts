import { BoundingBox } from '@/types/ingredient';

export interface ExtendedBoundingBox extends BoundingBox {
  confidence?: number;
}

export interface BoundingBoxCanvasProps {
  imageUrl: string;
  items: ExtendedBoundingBox[];
  onUpdateItem: (id: string, newBox: { x: number; y: number; width: number; height: number }) => void;
  onRemoveItem?: (id: string) => void;
  onLabelChange?: (id: string, newLabel: string) => void;
  onHeightChange?: (height: number) => void;
}

export interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}
