'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ImageUploader from '@/components/ImageUploader';
import ImagePreview from '@/components/ImagePreview';

// Konva는 브라우저 API를 사용하므로 SSR을 비활성화해야 합니다.
const BoundingBoxCanvas = dynamic(() => import('@/components/BoundingBoxCanvas'), {
    ssr: false,
});

type ApiType = 'cloud-vision' | 'gemini-flash' | 'compare' | 'receipt-ocr';

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
    source?: string;
}

interface GroceryItem {
    id: string;
    name: string;
    quantity: string;
    price?: number;
    category?: string;
}

interface RecommendedRecipe {
    recipe: {
        rcpSno: string;
        rcpTtl: string;
        ckgNm: string;
        ckgIpdc: string;
        ckgMtrlCn: string;
        ckgInbunNm: string;
        ckgDodfNm: string;
        ckgTimeNm: string;
        rcpImgUrl: string;
        ckgKndActoNm: string;
    };
    matchedIngredients: string[];
    missingIngredients: string[];
    matchRate: number;
    canCook: boolean;
}

interface CompareResult {
    comparison: boolean;
    cloudVision: {
        detectedItems?: DetectedItem[];
        allLabels?: string[];
        error?: string;
    };
    geminiFlash: {
        detectedItems?: DetectedItem[];
        allLabels?: string[];
        error?: string;
    };
}

export default function Home() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
    const [allLabels, setAllLabels] = useState<string[]>([]);
    const [selectedApi, setSelectedApi] = useState<ApiType>('cloud-vision');
    const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
    const [analysisTime, setAnalysisTime] = useState<{ cloudVision?: number; geminiFlash?: number }>({});
    const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);  // 영수증에서 추출한 식료품
    const [recommendedRecipes, setRecommendedRecipes] = useState<RecommendedRecipe[]>([]);  // 추천 레시피
    const [isRecommending, setIsRecommending] = useState(false);  // 추천 중

    const handleImageSelect = useCallback((file: File, url: string) => {
        setImageFile(file);
        setPreviewUrl(url);
        setDetectedItems([]);
        setAllLabels([]);
        setIsAnalyzed(false);
        setCompareResult(null);
        setAnalysisTime({});
        setGroceryItems([]);
        setRecommendedRecipes([]);
    }, []);

    const handleRemoveImage = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setImageFile(null);
        setPreviewUrl(null);
        setDetectedItems([]);
        setAllLabels([]);
        setIsAnalyzed(false);
        setCompareResult(null);
        setAnalysisTime({});
        setGroceryItems([]);
        setRecommendedRecipes([]);
    }, [previewUrl]);

    const handleUpdateItem = useCallback((id: string, newBox: { x: number; y: number; width: number; height: number }) => {
        setDetectedItems((prev: DetectedItem[]) =>
            prev.map((item: DetectedItem) => (item.id === id ? { ...item, boundingBox: newBox } : item))
        );
    }, []);

    const handleAnalyze = useCallback(async () => {
        if (!imageFile) return;

        setIsAnalyzing(true);
        setCompareResult(null);
        
        try {
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(imageFile);
            });
            
            const base64Image = await base64Promise;
            const startTime = Date.now();

            const response = await fetch(`/api/vision/analyze?api=${selectedApi}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image }),
            });

            const endTime = Date.now();

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.error || errorData.details || '분석 실패';
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (selectedApi === 'receipt-ocr') {
                // 영수증 OCR 모드
                setGroceryItems(data.groceryItems || []);
                setIsAnalyzed(true);
            } else if (selectedApi === 'compare') {
                // 비교 모드
                setCompareResult(data);
                // 기본적으로 Gemini Flash 결과를 메인 캔버스에 표시
                if (data.geminiFlash?.detectedItems) {
                    setDetectedItems(data.geminiFlash.detectedItems);
                    setAllLabels(data.geminiFlash.allLabels || []);
                }
                setIsAnalyzed(true);
            } else {
                // 냉장고 사진 분석 모드
                setDetectedItems(data.detectedItems);
                setAllLabels(data.allLabels || []);
                setAnalysisTime({
                    [selectedApi === 'cloud-vision' ? 'cloudVision' : 'geminiFlash']: endTime - startTime
                });
                setIsAnalyzed(true);
            }
        } catch (error: any) {
            console.error('분석 실패:', error);
            
            let userMessage = error.message;
            
            // 할당량 에러인 경우 추가 안내
            if (error.message.includes('할당량') || error.message.includes('quota')) {
                userMessage += '\n\n💡 Cloud Vision API로 전환하거나 잠시 후 다시 시도해주세요.';
            }
            
            alert(`❌ 이미지 분석 중 오류가 발생했습니다:\n\n${userMessage}`);
        } finally {
            setIsAnalyzing(false);
        }
    }, [imageFile, selectedApi]);

    const handleReanalyze = useCallback(() => {
        setIsAnalyzed(false);
        setDetectedItems([]);
        setAllLabels([]);
        setCompareResult(null);
        setGroceryItems([]);
        setRecommendedRecipes([]);
    }, []);

    const handleRecommendRecipes = useCallback(async () => {
        setIsRecommending(true);
        
        try {
            // 냉장고 모드: detectedItems에서 재료 추출
            // 영수증 모드: groceryItems에서 재료 추출
            const ingredients = selectedApi === 'receipt-ocr' 
                ? groceryItems.map(item => item.name)
                : detectedItems.map(item => item.label);

            if (ingredients.length === 0) {
                alert('식재료가 없습니다. 먼저 이미지를 분석해주세요.');
                return;
            }

            console.log('레시피 추천 요청:', ingredients);

            const response = await fetch('/api/recipes/recommend-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '레시피 추천 실패');
            }

            const data = await response.json();
            console.log('추천 레시피:', data);

            setRecommendedRecipes(data.recipes || []);

            if (data.recipes && data.recipes.length > 0) {
                alert(`🎉 ${data.recipes.length}개의 레시피를 찾았습니다!`);
            } else {
                alert('😅 매칭되는 레시피가 없습니다. Recipe 테이블에 데이터를 넣어주세요.');
            }

        } catch (error: any) {
            console.error('레시피 추천 실패:', error);
            alert(`레시피 추천 중 오류가 발생했습니다:\n\n${error.message}`);
        } finally {
            setIsRecommending(false);
        }
    }, [selectedApi, groceryItems, detectedItems]);

    const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

    return (
        <main className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-emerald-500/30">
            {/* 배경 글래스모피즘 효과 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-1 max-w-7xl">
                <header className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 border-b border-slate-800/50 pb-2 mt-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                            Refriger<span className="text-emerald-400">AI</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-light leading-relaxed">
                            냉장고 속 식료품을 AI가 정밀 분석하여 정리해 드립니다.
                        </p>
                    </div>
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide">
                            AI-Powered Smart Fridge
                        </div>
                        <a 
                            href="/login"
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 text-[10px] font-bold uppercase tracking-wider transition-all hover:text-white"
                        >
                            Sign In
                        </a>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
                {/* 왼쪽: 이미지 영역 */}
                <div className={`${(previewUrl || isAnalyzed) ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-2 sticky top-8`}>
                    {previewUrl ? (
                        <div className="group relative">
                            {isAnalyzed && detectedItems.length > 0 && selectedApi !== 'receipt-ocr' ? (
                                <div className="transition-all duration-500 transform hover:scale-[1.01]">
                                    <BoundingBoxCanvas
                                        imageUrl={previewUrl}
                                        items={detectedItems}
                                        onUpdateItem={handleUpdateItem}
                                        onHeightChange={setCanvasHeight}
                                    />
                                    <div className="absolute top-2 right-4 z-20 flex gap-2">
                                        <button
                                            onClick={handleReanalyze}
                                            className="p-3 bg-blue-500/80 hover:bg-blue-600 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl hover:scale-105"
                                            title="다시 분석"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={handleRemoveImage}
                                            className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-2xl backdrop-blur-md transition-all shadow-xl hover:rotate-90"
                                            title="이미지 삭제"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <ImagePreview 
                                    previewUrl={previewUrl} 
                                    onRemove={handleRemoveImage} 
                                    onHeightChange={setCanvasHeight}
                                />
                            )}
                        </div>
                    ) : (
                        /* 이미지가 아예 없는 처음에만 가운데에 업로더 표시 */
                        <div className="max-w-2xl mx-auto">
                            <ImageUploader
                                onImageSelect={handleImageSelect}
                                onAnalyze={handleAnalyze}
                                isAnalyzing={isAnalyzing}
                                hasImage={!!imageFile}
                                showUploader={true}
                            />
                        </div>
                    )}
                </div>

                {/* 오른쪽: 컨트롤 및 결과 섹션 */}
                {(previewUrl || isAnalyzed) && (
                    <div 
                        className="lg:col-span-4 flex flex-col space-y-2 animate-in fade-in slide-in-from-right-8 duration-700"
                        style={{ height: canvasHeight ? `${canvasHeight}px` : 'auto' }}
                    >
                    
                        {/* 분석 도구 영역 (고정) */}
                        <div className="flex-none bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-4 shadow-2xl space-y-6">
                            <div className="space-y-2">
                                <label className="text-slate-400 text-sm font-medium block">분석 모드 선택</label>
                                
                                {/* 모드 선택: 냉장고 vs 영수증 */}
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <button
                                        onClick={() => setSelectedApi('cloud-vision')}
                                        className={`flex items-center justify-center px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                                            selectedApi !== 'receipt-ocr'
                                            ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-lg'
                                            : 'bg-slate-700/30 border border-transparent text-slate-400 hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1">📸 냉장고 사진</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedApi('receipt-ocr')}
                                        className={`flex items-center justify-center px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                                            selectedApi === 'receipt-ocr'
                                            ? 'bg-orange-500/20 border border-orange-500/50 text-orange-300 shadow-lg'
                                            : 'bg-slate-700/30 border border-transparent text-slate-400 hover:bg-slate-700/50'
                                        }`}
                                    >
                                        <span className="flex items-center gap-1">🧾 영수증/구매내역</span>
                                    </button>
                                </div>

                                {/* 냉장고 모드일 때만 AI 엔진 선택 표시 */}
                                {selectedApi !== 'receipt-ocr' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setSelectedApi('cloud-vision')}
                                            className={`flex items-center justify-center px-1 py-1 rounded-xl text-[10px] font-medium transition-all ${
                                                selectedApi === 'cloud-vision'
                                                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300 shadow-lg'
                                                : 'bg-slate-700/30 border border-transparent text-slate-400 hover:bg-slate-700/50'
                                            }`}
                                        >
                                            <span className="flex items-center gap-1">🔍 Cloud Vision</span>
                                        </button>
                                        <button
                                            onClick={() => setSelectedApi('gemini-flash')}
                                            className={`flex items-center justify-center px-1 py-1 rounded-xl text-[10px] font-medium transition-all ${
                                                selectedApi === 'gemini-flash'
                                                ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300 shadow-lg'
                                                : 'bg-slate-700/30 border border-transparent text-slate-400 hover:bg-slate-700/50'
                                            }`}
                                        >
                                        <span className="flex items-center gap-1">✨ Gemini Flash 2.0</span>
                                        </button>
                                    </div>
                                )}

                                {/* 영수증 모드 안내 */}
                                {selectedApi === 'receipt-ocr' && (
                                    <div className="text-xs text-slate-400 bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
                                        💡 쿠팡프레시, 롯데마트 등의 구매내역이나 영수증을 업로드하면 식료품 목록을 자동으로 추출합니다.
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-slate-700/50">
                                <ImageUploader
                                    onImageSelect={handleImageSelect}
                                    onAnalyze={handleAnalyze}
                                    isAnalyzing={isAnalyzing}
                                    hasImage={!!imageFile}
                                    showUploader={false}
                                />
                            </div>

                            {/* 레시피 추천 버튼 - 분석 완료 후에만 표시 */}
                            {isAnalyzed && (detectedItems.length > 0 || groceryItems.length > 0) && (
                                <div className="pt-2 border-t border-slate-700/50">
                                    <button
                                        onClick={handleRecommendRecipes}
                                        disabled={isRecommending}
                                        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                            isRecommending
                                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            : 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]'
                                        }`}
                                    >
                                        {isRecommending ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                레시피 찾는 중...
                                            </>
                                        ) : (
                                            <>
                                                🍳 레시피 추천받기
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 1. 탐지된 객체 리스트 (유동적 확장/축소) 또는 분석 대기 메시지 */}
                        <section className="flex-1 min-h-0 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-4 backdrop-blur-sm flex flex-col justify-center">
                            {!isAnalyzed ? (
                                <div className="text-center space-y-3 opacity-50">
                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">분석 시작 버튼을 눌러주세요</p>
                                </div>
                            ) : selectedApi === 'receipt-ocr' ? (
                                // 영수증 OCR 결과 표시
                                <>
                                    <h2 className="flex-none text-lg font-bold text-white mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-orange-500/20 rounded-lg">
                                                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            추출된 식료품 ({groceryItems.length})
                                        </div>
                                    </h2>
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {groceryItems.map((item: GroceryItem) => (
                                            <div
                                                key={item.id}
                                                className="bg-slate-700/30 border border-slate-600/20 rounded-xl p-3 hover:bg-slate-700/50 transition-all"
                                            >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white font-medium text-sm">{item.name}</span>
                                                        {item.category && (
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                                                                {item.category}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[11px] text-slate-400">수량: {item.quantity}</span>
                                                        {item.price && (
                                                            <span className="text-[11px] text-slate-400">• {item.price.toLocaleString()}원</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        ))}
                                        {groceryItems.length === 0 && (
                                            <p className="text-slate-500 text-center py-6 italic text-sm">
                                                추출된 식료품이 없습니다.
                                            </p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // 냉장고 사진 분석 결과 표시
                                <>
                                    <h2 className="flex-none text-lg font-bold text-white mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            탐지된 품목 ({detectedItems.length})
                                        </div>
                                        <div className="flex gap-2">
                                            {analysisTime.geminiFlash && (
                                                <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">✨ {analysisTime.geminiFlash}ms</span>
                                            )}
                                            {analysisTime.cloudVision && (
                                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">🔍 {analysisTime.cloudVision}ms</span>
                                            )}
                                        </div>
                                    </h2>
                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {detectedItems.map((item: DetectedItem) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between bg-slate-700/30 border border-slate-600/20 rounded-xl p-3 hover:bg-slate-700/50 transition-all"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium text-sm">{item.label}</span>
                                                    <span className="text-[10px] text-slate-500">정확도 {(item.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="h-1.5 w-16 bg-slate-600 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-emerald-400 transition-all duration-1000" 
                                                        style={{ width: `${item.confidence * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        {detectedItems.length === 0 && (
                                            <p className="text-slate-500 text-center py-6 italic text-sm">
                                                감지된 객체가 없습니다.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </section>

                        {/* 2. 전체 분석 라벨 (분석 완료 시에만 노출, 50/50 비율 유지) */}
                        {isAnalyzed && selectedApi !== 'receipt-ocr' && (
                            <section className="flex-1 min-h-0 bg-slate-800/30 border border-slate-700/50 rounded-3xl p-4 backdrop-blur-sm flex flex-col">
                                <h2 className="flex-none text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    인식된 키워드
                                </h2>
                                <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-1.5 content-start custom-scrollbar">
                                    {allLabels.map((label, idx) => (
                                        <span 
                                            key={idx}
                                            className="px-3 py-1 bg-slate-700/50 border border-slate-600/30 rounded-full text-xs text-slate-300 hover:text-white hover:border-emerald-400 transition-colors cursor-default h-fit"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 3. 추천 레시피 (레시피 추천 완료 시에만 노출) */}
                        {recommendedRecipes.length > 0 && (
                            <section className="flex-2 min-h-125 bg-linear-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-3xl p-4 backdrop-blur-sm flex flex-col">
                                <h2 className="flex-none text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    추천 레시피 ({recommendedRecipes.length})
                                </h2>
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                    {recommendedRecipes.map((rec, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-3 hover:bg-slate-700/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium text-sm mb-1">{rec.recipe.ckgNm}</h3>
                                                    <p className="text-xs text-slate-400 line-clamp-2">{rec.recipe.ckgIpdc}</p>
                                                </div>
                                                <div className={`ml-2 px-2 py-1 rounded-lg text-xs font-bold ${
                                                    rec.canCook 
                                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {Math.round(rec.matchRate * 100)}%
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                                                <span>👨‍🍳 {rec.recipe.ckgDodfNm}</span>
                                                <span>•</span>
                                                <span>⏱️ {rec.recipe.ckgTimeNm || '시간미정'}</span>
                                                <span>•</span>
                                                <span>🍽️ {rec.recipe.ckgInbunNm}</span>
                                            </div>

                                            {rec.canCook && (
                                                <div className="flex items-center gap-1 text-xs text-emerald-400 mb-2">
                                                    <span>✅ 바로 요리 가능!</span>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {rec.matchedIngredients.slice(0, 5).map((ing, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                                                        {ing}
                                                    </span>
                                                ))}
                                                {rec.matchedIngredients.length > 5 && (
                                                    <span className="px-2 py-0.5 bg-slate-700 text-slate-400 rounded text-xs">
                                                        +{rec.matchedIngredients.length - 5}
                                                    </span>
                                                )}
                                            </div>

                                            {rec.missingIngredients.length > 0 && rec.missingIngredients.length <= 3 && (
                                                <div className="text-xs text-slate-500">
                                                    부족: {rec.missingIngredients.join(', ')}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
                </div>

                <footer className="text-center mt-32 space-y-2 py-8 border-t border-slate-800/50">
                </footer>
            </div>
        </main>
    );
}
