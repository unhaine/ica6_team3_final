import { BoundingBox, Ingredient } from './ingredient';

export type AnalysisStatus = 'IDLE' | 'UPLOADING' | 'ANALYZING' | 'SUCCESS' | 'ERROR';

export type AnalysisType = 'fridge' | 'receipt';

export interface AnalysisResult {
  type: AnalysisType;
  imageUrl: string;
  timestamp: string;
  // 냉장고 사진인 경우
  boundingBoxes?: BoundingBox[];
  // 영수증 사진인 경우
  ingredients?: Ingredient[];
}
