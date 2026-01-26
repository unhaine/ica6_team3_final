import { useState } from 'react';
import { AnalysisResult, AnalysisStatus, AnalysisType } from '@/types/analysis';
import { IngredientUnit } from '@/types/ingredient';

export const useAnalysis = () => {
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

  const performAnalysis = async (type: AnalysisType, imageUrl: string) => {
    setStatus('ANALYZING');
    setProgress(10);

    try {
      // 1. 이미지 URL을 Base64로 변환
      setProgress(20);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      setProgress(40);

      // 2. API 호출
      const apiEndpoint = type === 'fridge' 
        ? '/api/vision/analyze/gemini-flash' 
        : '/api/vision/analyze/receipt-ocr';

      const apiResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });

      if (!apiResponse.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const data = await apiResponse.json();
      setProgress(90);

      // 3. 결과 매핑
      const analysisResult: AnalysisResult = {
        type,
        imageUrl,
        timestamp: new Date().toISOString(),
        boundingBoxes: type === 'fridge' ? data.detectedItems.map((item: {
          id: string;
          label: string;
          boundingBox: { x: number; y: number; width: number; height: number };
        }) => ({
          id: item.id,
          label: item.label,
          x: item.boundingBox.x,
          y: item.boundingBox.y,
          width: item.boundingBox.width,
          height: item.boundingBox.height,
        })) : undefined,
        ingredients: type === 'receipt' ? data.groceryItems.map((item: {
          id: string;
          name: string;
          quantity: string;
          category?: string;
        }) => {
          // "1개", "700g" 등에서 숫자와 단위 추출 시도
          const qtyMatch = item.quantity.match(/(\d+(\.\d+)?)/);
          const quantity = qtyMatch ? parseFloat(qtyMatch[0]) : 1;
          
          // 대략적인 단위 매칭
          let unit: IngredientUnit = '개';
          if (item.quantity.includes('g')) unit = 'g';
          if (item.quantity.includes('kg')) unit = 'kg';
          if (item.quantity.includes('ml')) unit = 'ml';
          if (item.quantity.includes('L')) unit = 'L';
          if (item.quantity.includes('팩')) unit = '팩';
          if (item.quantity.includes('봉')) unit = '봉';

          return {
            id: item.id,
            name: item.name,
            quantity,
            unit,
            category: item.category,
            addedAt: new Date().toISOString(),
          };
        }) : undefined,
      };

      setResult(analysisResult);
      setProgress(100);
      setStatus('SUCCESS');
    } catch (error) {
      console.error('Analysis error:', error);
      console.warn('API 호출에 실패하여 테스트용 샘플 데이터를 사용합니다.');
      
      // Fallback: API 에러 시 시뮬레이션 데이터 사용 (개발/테스트 목적)
      const mockResult: AnalysisResult = {
        type,
        imageUrl,
        timestamp: new Date().toISOString(),
        boundingBoxes: type === 'fridge' ? [
          { id: '1', label: '우유(샘플)', x: 0.2, y: 0.2, width: 0.2, height: 0.3 },
          { id: '2', label: '김치', x: 0.5, y: 0.5, width: 0.3, height: 0.2 },
          { id: '3', label: '계란', x: 0.1, y: 0.6, width: 0.2, height: 0.15 },
        ] : undefined,
        ingredients: type === 'receipt' ? [
          { id: '1', name: '샘플_삼겹살', quantity: 600, unit: 'g', addedAt: new Date().toISOString() },
          { id: '2', name: '샘플_양파', quantity: 1, unit: '봉', addedAt: new Date().toISOString() },
        ] : undefined,
      };

      setResult(mockResult);
      setStatus('SUCCESS');
    }
  };

  const reset = () => {
    setStatus('IDLE');
    setProgress(0);
    setResult(null);
  };

  return { status, progress, result, simulateAnalysis, performAnalysis, reset };
};
