import { useState } from 'react';
import { AnalysisResult, AnalysisStatus, AnalysisType } from '@/types/analysis';

export const useAnalysisSimulation = () => {
  const [status, setStatus] = useState<AnalysisStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const simulateAnalysis = async (type: AnalysisType, imageUrl: string) => {
    setStatus('ANALYZING');
    setProgress(0);

    // 진행률 시뮬레이션
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // 결과 시뮬레이션
    const mockResult: AnalysisResult = {
      type,
      imageUrl,
      timestamp: new Date().toISOString(),
      boundingBoxes: type === 'fridge' ? [
        { id: '1', label: '우유', x: 0.1, y: 0.2, width: 0.2, height: 0.3 },
        { id: '2', label: '당근', x: 0.4, y: 0.5, width: 0.1, height: 0.1 },
        { id: '3', label: '계란', x: 0.6, y: 0.1, width: 0.15, height: 0.2 },
      ] : undefined,
      ingredients: type === 'receipt' ? [
        { id: '1', name: '삼겹살', quantity: 300, unit: 'g', addedAt: new Date().toISOString() },
        { id: '2', name: '양파', quantity: 3, unit: '개', addedAt: new Date().toISOString() },
        { id: '3', name: '대파', quantity: 1, unit: '봉', addedAt: new Date().toISOString() },
      ] : undefined,
    };

    setResult(mockResult);
    setStatus('SUCCESS');
  };

  const reset = () => {
    setStatus('IDLE');
    setProgress(0);
    setResult(null);
  };

  return { status, progress, result, simulateAnalysis, reset };
};
